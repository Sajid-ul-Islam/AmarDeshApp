/**
 * Unit Tests for Event Tracker Module
 */

import { 
  trackEvent, 
  flushEventQueue, 
  initializeEventTracker,
  trackArticleOpened,
  trackArticleSaved,
  getQueueSize,
  __resetForTests,
} from '../eventTracker';
import * as db from '../db';
import * as anonymousId from '../anonymousId';

// Mock dependencies
jest.mock('../db');
jest.mock('../anonymousId');

describe('Event Tracker Module', () => {
  beforeEach(() => {
    __resetForTests();
    jest.clearAllMocks();
    (anonymousId.getAnonymousId as jest.Mock).mockResolvedValue('test-user-id');
  });

  describe('trackEvent', () => {
    it('should add event to queue', async () => {
      await trackEvent('article_opened', 'article', 'amd001', { category: 'জাতীয়' });

      expect(getQueueSize()).toBe(1);
    });

    it('should flush queue when batch size reached', async () => {
      // Add 10 events to trigger flush
      for (let i = 0; i < 10; i++) {
        await trackEvent('article_opened', 'article', `amd00${i}`);
      }

      expect(db.insertEvents).toHaveBeenCalled();
      expect(getQueueSize()).toBe(0);
    });

    it('should immediately write critical events', async () => {
      await trackEvent('article_saved', 'article', 'amd001');

      expect(db.insertEvent).toHaveBeenCalled();
      expect(getQueueSize()).toBe(0);
    });
  });

  describe('flushEventQueue', () => {
    it('should write all queued events to database', async () => {
      await trackEvent('article_opened', 'article', 'amd001');
      await trackEvent('article_opened', 'article', 'amd002');
      await trackEvent('article_opened', 'article', 'amd003');

      await flushEventQueue();

      expect(db.insertEvents).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ event_type: 'article_opened' }),
        ])
      );
      expect(getQueueSize()).toBe(0);
    });

    it('should not call database if queue is empty', async () => {
      await flushEventQueue();

      expect(db.insertEvents).not.toHaveBeenCalled();
    });
  });

  describe('trackArticleOpened', () => {
    it('should track article opened with correct metadata', async () => {
      await trackArticleOpened('amd001', 'জাতীয়', 'আন্তর্জাতিক ডেস্ক', 'feed');

      expect(getQueueSize()).toBe(1);
    });
  });

  describe('trackArticleSaved', () => {
    it('should immediately track article saved', async () => {
      await trackArticleSaved('amd001', 'জাতীয়', 'আন্তর্জাতিক ডেস্ক');

      expect(db.insertEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: 'article_saved',
          entity_type: 'article',
          entity_id: 'amd001',
        })
      );
    });
  });
});
