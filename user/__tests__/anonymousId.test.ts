/**
 * Unit Tests for Anonymous ID Module
 */

import { getAnonymousId, deleteAnonymousId, hasAnonymousId } from '../anonymousId';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

// Mock dependencies
jest.mock('expo-secure-store');
jest.mock('uuid');

describe('Anonymous ID Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnonymousId', () => {
    it('should return existing ID if one exists', async () => {
      const existingId = 'existing-uuid-1234';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(existingId);

      const result = await getAnonymousId();

      expect(result).toBe(existingId);
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('amar_desh_anonymous_user_id');
      expect(uuidv4).not.toHaveBeenCalled();
    });

    it('should generate new ID if none exists', async () => {
      const newId = 'new-uuid-5678';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      (uuidv4 as jest.Mock).mockReturnValue(newId);

      const result = await getAnonymousId();

      expect(result).toBe(newId);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'amar_desh_anonymous_user_id',
        newId
      );
    });

    it('should return fallback ID on error', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));
      const fallbackId = 'fallback-uuid-9999';
      (uuidv4 as jest.Mock).mockReturnValue(fallbackId);

      const result = await getAnonymousId();

      expect(result).toBe(fallbackId);
    });
  });

  describe('deleteAnonymousId', () => {
    it('should delete anonymous ID from storage', async () => {
      await deleteAnonymousId();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
        'amar_desh_anonymous_user_id'
      );
    });

    it('should handle deletion errors gracefully', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(new Error('Delete error'));

      await expect(deleteAnonymousId()).resolves.not.toThrow();
    });
  });

  describe('hasAnonymousId', () => {
    it('should return true if ID exists', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('some-uuid');

      const result = await hasAnonymousId();

      expect(result).toBe(true);
    });

    it('should return false if ID does not exist', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await hasAnonymousId();

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Error'));

      const result = await hasAnonymousId();

      expect(result).toBe(false);
    });
  });
});
