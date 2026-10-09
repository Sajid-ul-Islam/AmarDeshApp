/**
 * Affinity Calculator
 * 
 * Computes affinity scores for topics, authors, and sections based on user behavior.
 * Implements the scoring algorithm defined in the design document.
 * 
 * Key Features:
 * - Engagement-weighted scoring
 * - Recency decay (7-day half-life)
 * - Normalized scores (0.0 to 1.0)
 * - Efficient batch computation
 */

import { getEvents, upsertAffinity, getTopAffinities as dbGetTopAffinities, Affinity, Event } from './db';

export type { Affinity };

// Configuration
const HALF_LIFE_DAYS = 7; // Recency decay half-life
const MAX_SCORE = 10; // Raw score cap before normalization
const RECALCULATION_THRESHOLD_HOURS = 1; // Don't recalculate more than once per hour

// Engagement weights for different event types
const ENGAGEMENT_WEIGHTS: Record<string, number> = {
  article_opened: 1.0,
  article_scrolled: 0.5,
  article_closed: 1.0,
  article_saved: 3.0,
  article_unsaved: -1.0,
  article_shared: 4.0,
  search_result_clicked: 1.5,
  tts_started: 1.5,
  tts_stopped: 2.0,
};

// Last recalculation timestamp
let lastRecalculationTime = 0;

/**
 * Calculate recency decay factor
 * 
 * @param timestamp - Event timestamp (epoch ms)
 * @returns Decay factor (0.0 to 1.0)
 * 
 * Formula: 0.5^(age_in_days / half_life)
 */
function calculateRecencyDecay(timestamp: number): number {
  const now = Date.now();
  const ageInDays = (now - timestamp) / (1000 * 60 * 60 * 24);
  return Math.pow(0.5, ageInDays / HALF_LIFE_DAYS);
}

/**
 * Get engagement weight for an event
 * 
 * @param eventType - Type of event
 * @param metadata - Event metadata (for additional context)
 * @returns Engagement weight
 */
function getEngagementWeight(eventType: string, metadata?: Record<string, any>): number {
  let weight = ENGAGEMENT_WEIGHTS[eventType] || 0;
  
  // Bonus for high scroll depth
  if (eventType === 'article_closed' && metadata?.max_scroll_depth) {
    const scrollDepth = metadata.max_scroll_depth as number;
    if (scrollDepth > 0.8) {
      weight *= 2.0; // Double weight for articles read > 80%
    }
  }
  
  // Bonus for long TTS listening
  if (eventType === 'tts_stopped' && metadata?.listened_duration_ms) {
    const duration = metadata.listened_duration_ms as number;
    if (duration > 60000) { // > 1 minute
      weight *= 1.5;
    }
  }
  
  return weight;
}

/**
 * Extract entities from an event
 * 
 * @param event - The event to extract entities from
 * @returns Array of { type, id } pairs
 */
function extractEntities(event: Event): Array<{ type: string; id: string }> {
  const entities: Array<{ type: string; id: string }> = [];
  
  if (!event.entity_type || !event.entity_id) {
    return entities;
  }
  
  // Direct entity
  entities.push({
    type: event.entity_type,
    id: event.entity_id,
  });
  
  // Extract topic from article category
  if (event.entity_type === 'article' && event.metadata?.category) {
    entities.push({
      type: 'topic',
      id: event.metadata.category as string,
    });
  }
  
  // Extract author
  if (event.entity_type === 'article' && event.metadata?.author) {
    entities.push({
      type: 'author',
      id: event.metadata.author as string,
    });
  }
  
  // Extract section (mapped from category)
  if (event.entity_type === 'article' && event.metadata?.category) {
    const category = event.metadata.category as string;
    const section = mapCategoryToSection(category);
    if (section) {
      entities.push({
        type: 'section',
        id: section,
      });
    }
  }
  
  return entities;
}

/**
 * Map article category to broader section
 */
function mapCategoryToSection(category: string): string | null {
  const sectionMap: Record<string, string> = {
    'জাতীয়': 'national',
    'রাজনীতি': 'politics',
    'সারা দেশ': 'national',
    'বাণিজ্য': 'business',
    'বিনোদন': 'entertainment',
    'বিশ্ব': 'world',
    'খেলা': 'sports',
    'ইসলাম ও জীবন': 'religion',
    'ফিচার': 'feature',
    'মতামত': 'opinion',
    'আইন-আদালত': 'law',
    'শিক্ষা': 'education',
    'স্বাস্থ্য': 'health',
    'তথ্য-প্রযুক্তি': 'technology',
  };
  
  return sectionMap[category] || null;
}

/**
 * Calculate affinity scores for all entities
 * 
 * @param userId - User ID to calculate affinities for
 * @param force - Force recalculation even if recently calculated
 * 
 * @example
 * await calculateAffinity('user-123');
 */
export async function calculateAffinity(
  userId: string,
  force: boolean = false
): Promise<void> {
  try {
    // Check if we should recalculate
    const now = Date.now();
    const hoursSinceLastCalc = (now - lastRecalculationTime) / (1000 * 60 * 60);
    
    if (!force && hoursSinceLastCalc < RECALCULATION_THRESHOLD_HOURS) {
      console.log('[AffinityCalculator] Skipping recalculation (too recent)');
      return;
    }
    
    console.log('[AffinityCalculator] Starting affinity calculation');
    
    // Get all events from last 90 days
    const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);
    const events = await getEvents(userId, ninetyDaysAgo);
    
    if (events.length === 0) {
      console.log('[AffinityCalculator] No events found');
      return;
    }
    
    console.log(`[AffinityCalculator] Processing ${events.length} events`);
    
    // Group events by entity
    const entityScores = new Map<string, {
      type: string;
      id: string;
      rawScore: number;
      lastInteraction: number;
    }>();
    
    for (const event of events) {
      const entities = extractEntities(event);
      const weight = getEngagementWeight(event.event_type, event.metadata);
      
      for (const entity of entities) {
        const key = `${entity.type}:${entity.id}`;
        const existing = entityScores.get(key);
        
        if (existing) {
          existing.rawScore += weight;
          existing.lastInteraction = Math.max(existing.lastInteraction, event.created_at);
        } else {
          entityScores.set(key, {
            type: entity.type,
            id: entity.id,
            rawScore: weight,
            lastInteraction: event.created_at,
          });
        }
      }
    }
    
    console.log(`[AffinityCalculator] Computed scores for ${entityScores.size} entities`);
    
    // Calculate final scores with decay
    const affinityUpdates: Affinity[] = [];
    
    for (const [key, data] of entityScores) {
      const recencyDecay = calculateRecencyDecay(data.lastInteraction);
      const normalizedScore = Math.min(1.0, (data.rawScore * recencyDecay) / MAX_SCORE);
      
      // Only store if score is meaningful (> 0.01)
      if (normalizedScore > 0.01) {
        affinityUpdates.push({
          entity_type: data.type,
          entity_id: data.id,
          score: normalizedScore,
          last_updated: now,
        });
      }
    }
    
    console.log(`[AffinityCalculator] Updating ${affinityUpdates.length} affinity scores`);
    
    // Batch upsert to database
    if (affinityUpdates.length > 0) {
      await upsertAffinity(affinityUpdates);
    }
    
    lastRecalculationTime = now;
    console.log('[AffinityCalculator] Affinity calculation complete');
  } catch (error) {
    console.error('[AffinityCalculator] Error calculating affinity:', error);
    throw error;
  }
}

/**
 * Get top affinities for a specific entity type
 * 
 * @param entityType - Type of entity (topic, author, section)
 * @param limit - Maximum number of results
 * @returns Array of affinity scores
 * 
 * @example
 * const topTopics = await getTopAffinities('topic', 10);
 */
export async function getTopAffinities(
  entityType: string,
  limit: number = 10
): Promise<Affinity[]> {
  try {
    return await dbGetTopAffinities(entityType, limit);
  } catch (error) {
    console.error('[AffinityCalculator] Error getting top affinities:', error);
    return [];
  }
}

/**
 * Check if affinity calculation is needed
 * 
 * @param userId - User ID to check
 * @returns True if calculation is needed
 */
export async function shouldRecalculate(userId: string): Promise<boolean> {
  const now = Date.now();
  const hoursSinceLastCalc = (now - lastRecalculationTime) / (1000 * 60 * 60);
  
  // Recalculate if:
  // 1. Never calculated before
  if (lastRecalculationTime === 0) {
    return true;
  }
  
  // 2. More than threshold hours since last calculation
  if (hoursSinceLastCalc >= RECALCULATION_THRESHOLD_HOURS) {
    return true;
  }
  
  // 3. Check if there are new events since last calculation
  try {
    const events = await getEvents(userId, lastRecalculationTime);
    if (events.length >= 10) {
      return true;
    }
  } catch (error) {
    console.error('[AffinityCalculator] Error checking for new events:', error);
  }
  
  return false;
}

/**
 * Reset last recalculation time (force recalculation on next check)
 */
export function resetRecalculationTimer(): void {
  lastRecalculationTime = 0;
  console.log('[AffinityCalculator] Reset recalculation timer');
}

/**
 * Test-only helper: clear the in-memory recalculation cache and the
 * internal event queue so tests get a clean module state.
 */
export function __resetForTests(): void {
  lastRecalculationTime = 0;
}

/**
 * Get affinity calculation stats (for debugging)
 */
export function getCalculationStats(): {
  lastRecalculationTime: number;
  hoursSinceLastCalc: number;
} {
  const now = Date.now();
  const hoursSinceLastCalc = (now - lastRecalculationTime) / (1000 * 60 * 60);
  
  return {
    lastRecalculationTime,
    hoursSinceLastCalc,
  };
}
