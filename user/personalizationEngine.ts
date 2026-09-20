/**
 * Personalization Engine
 * 
 * Uses affinity scores to rank and recommend content.
 * Implements the personalization algorithms defined in the design document.
 * 
 * Key Features:
 * - Content ranking based on affinity scores
 * - "For You" feed generation
 * - Recommendations based on user interests
 * - Diversity injection to prevent filter bubbles
 */

import { getTopAffinities, Affinity } from './affinityCalculator';
import { Article } from '../data/mockData';

// Configuration
const TOPIC_WEIGHT = 0.5; // 50% weight for topic affinity
const AUTHOR_WEIGHT = 0.3; // 30% weight for author affinity
const RECENCY_WEIGHT = 0.2; // 20% weight for recency
const RECENCY_WINDOW_HOURS = 168; // 7 days
const DIVERSITY_PERCENTAGE = 0.1; // 10% random content

/**
 * Rank articles based on user affinity scores
 * 
 * @param articles - Array of articles to rank
 * @param userId - User ID (for fetching affinities)
 * @returns Ranked articles (highest score first)
 * 
 * @example
 * const ranked = await rankArticles(articles, 'user-123');
 */
export async function rankArticles(
  articles: Article[],
  userId: string
): Promise<Article[]> {
  try {
    // Get user's top affinities
    const topTopics = await getTopAffinities('topic', 10);
    const topAuthors = await getTopAffinities('author', 10);
    
    console.log(`[Personalization] Ranking ${articles.length} articles`);
    console.log(`[Personalization] Top topics:`, topTopics.map(t => t.entity_id));
    console.log(`[Personalization] Top authors:`, topAuthors.map(a => a.entity_id));
    
    // Score each article
    const scored = articles.map(article => {
      let score = 0;
      
      // Topic affinity score
      const topicMatch = topTopics.find(t => t.entity_id === article.category);
      if (topicMatch) {
        score += topicMatch.score * TOPIC_WEIGHT;
      }
      
      // Author affinity score
      const authorMatch = topAuthors.find(a => a.entity_id === article.author);
      if (authorMatch) {
        score += authorMatch.score * AUTHOR_WEIGHT;
      }
      
      // Recency score (newer = better)
      const ageInHours = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
      const recencyScore = Math.max(0, 1 - (ageInHours / RECENCY_WINDOW_HOURS));
      score += recencyScore * RECENCY_WEIGHT;
      
      return { article, score };
    });
    
    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);
    
    console.log(`[Personalization] Top scored article:`, scored[0]?.article.title, 'Score:', scored[0]?.score);
    
    // Return ranked articles
    return scored.map(s => s.article);
  } catch (error) {
    console.error('[Personalization] Error ranking articles:', error);
    return articles; // Fallback to original order
  }
}

/**
 * Generate "For You" feed
 * 
 * @param allArticles - All available articles
 * @param userId - User ID
 * @returns Personalized feed with diversity injection
 * 
 * @example
 * const feed = await generateForYouFeed(articles, 'user-123');
 */
export async function generateForYouFeed(
  allArticles: Article[],
  userId: string
): Promise<Article[]> {
  try {
    console.log('[Personalization] Generating "For You" feed');
    
    // Rank all articles
    const ranked = await rankArticles(allArticles, userId);
    
    // Split into personalized and random
    const personalizedCount = Math.floor(ranked.length * (1 - DIVERSITY_PERCENTAGE));
    const personalized = ranked.slice(0, personalizedCount);
    const random = ranked.slice(personalizedCount);
    
    // Shuffle random articles
    const shuffledRandom = shuffleArray(random);
    
    // Inject random articles at regular intervals
    const feed: Article[] = [];
    const interval = Math.floor(personalized.length / shuffledRandom.length);
    
    let randomIndex = 0;
    for (let i = 0; i < personalized.length; i++) {
      feed.push(personalized[i]);
      
      // Inject random article every 'interval' articles
      if (interval > 0 && (i + 1) % interval === 0 && randomIndex < shuffledRandom.length) {
        feed.push(shuffledRandom[randomIndex]);
        randomIndex++;
      }
    }
    
    // Add remaining random articles at the end
    while (randomIndex < shuffledRandom.length) {
      feed.push(shuffledRandom[randomIndex]);
      randomIndex++;
    }
    
    console.log(`[Personalization] Generated feed with ${feed.length} articles (${shuffledRandom.length} random)`);
    
    return feed;
  } catch (error) {
    console.error('[Personalization] Error generating feed:', error);
    return allArticles; // Fallback
  }
}

/**
 * Get recommended articles based on user interests
 * 
 * @param allArticles - All available articles
 * @param userId - User ID
 * @param excludeArticleIds - Articles to exclude (already read, etc.)
 * @param limit - Maximum number of recommendations
 * @returns Recommended articles
 * 
 * @example
 * const recommendations = await getRecommendations(articles, 'user-123', ['amd001'], 5);
 */
export async function getRecommendations(
  allArticles: Article[],
  userId: string,
  excludeArticleIds: string[] = [],
  limit: number = 5
): Promise<Article[]> {
  try {
    console.log('[Personalization] Getting recommendations');
    
    // Filter out excluded articles
    const available = allArticles.filter(a => !excludeArticleIds.includes(a.id));
    
    // Rank available articles
    const ranked = await rankArticles(available, userId);
    
    // Get top N recommendations
    const recommendations = ranked.slice(0, limit);
    
    console.log(`[Personalization] Generated ${recommendations.length} recommendations`);
    
    return recommendations;
  } catch (error) {
    console.error('[Personalization] Error getting recommendations:', error);
    return [];
  }
}

/**
 * Get personalized search results
 * 
 * @param searchResults - Search results to rank
 * @param userId - User ID
 * @returns Ranked search results
 * 
 * @example
 * const ranked = await getPersonalizedSearchResults(results, 'user-123');
 */
export async function getPersonalizedSearchResults(
  searchResults: Article[],
  userId: string
): Promise<Article[]> {
  try {
    console.log('[Personalization] Personalizing search results');
    
    // Rank search results
    const ranked = await rankArticles(searchResults, userId);
    
    console.log(`[Personalization] Ranked ${ranked.length} search results`);
    
    return ranked;
  } catch (error) {
    console.error('[Personalization] Error personalizing search:', error);
    return searchResults; // Fallback
  }
}

/**
 * Get user's top interests (for display in UI)
 * 
 * @param userId - User ID
 * @param limit - Maximum number of interests
 * @returns Array of { type, id, score }
 * 
 * @example
 * const interests = await getUserInterests('user-123', 10);
 */
export async function getUserInterests(
  userId: string,
  limit: number = 10
): Promise<Array<{ type: string; id: string; score: number }>> {
  try {
    const topics = await getTopAffinities('topic', limit);
    const authors = await getTopAffinities('author', Math.floor(limit / 2));
    
    const interests = [
      ...topics.map(t => ({ type: 'topic', id: t.entity_id, score: t.score })),
      ...authors.map(a => ({ type: 'author', id: a.entity_id, score: a.score })),
    ];
    
    // Sort by score
    interests.sort((a, b) => b.score - a.score);
    
    return interests.slice(0, limit);
  } catch (error) {
    console.error('[Personalization] Error getting user interests:', error);
    return [];
  }
}

/**
 * Check if an article matches user's interests
 * 
 * @param article - Article to check
 * @param userId - User ID
 * @returns True if article matches interests
 * 
 * @example
 * const matches = await articleMatchesInterests(article, 'user-123');
 */
export async function articleMatchesInterests(
  article: Article,
  userId: string
): Promise<boolean> {
  try {
    const topTopics = await getTopAffinities('topic', 5);
    const topAuthors = await getTopAffinities('author', 5);
    
    const topicMatch = topTopics.some(t => t.entity_id === article.category);
    const authorMatch = topAuthors.some(a => a.entity_id === article.author);
    
    return topicMatch || authorMatch;
  } catch (error) {
    console.error('[Personalization] Error checking article match:', error);
    return false;
  }
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get personalization stats (for debugging)
 */
export async function getPersonalizationStats(userId: string): Promise<{
  topTopics: Array<{ id: string; score: number }>;
  topAuthors: Array<{ id: string; score: number }>;
}> {
  try {
    const topTopics = await getTopAffinities('topic', 10);
    const topAuthors = await getTopAffinities('author', 10);
    
    return {
      topTopics: topTopics.map(t => ({ id: t.entity_id, score: t.score })),
      topAuthors: topAuthors.map(a => ({ id: a.entity_id, score: a.score })),
    };
  } catch (error) {
    console.error('[Personalization] Error getting stats:', error);
    return {
      topTopics: [],
      topAuthors: [],
    };
  }
}
