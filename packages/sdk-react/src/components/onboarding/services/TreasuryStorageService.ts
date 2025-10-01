import {
  SafeLocalStorageService,
  type StorageService,
} from './SafeLocalStorageService';

/**
 * Treasury-specific storage service for managing terms acceptance and bank details
 */
export class TreasuryStorageService {
  private storage: StorageService;
  private readonly PREFIX = 'monite_treasury_';

  constructor(storage?: StorageService) {
    this.storage = storage || new SafeLocalStorageService();
  }

  hasTreasuryTermsAccepted(entityId: string): boolean {
    const key = `${this.PREFIX}tos_accepted_${entityId}`;
    return this.storage.get(key) === 'true';
  }

  setTreasuryTermsAccepted(entityId: string): void {
    const key = `${this.PREFIX}tos_accepted_${entityId}`;
    this.storage.set(key, 'true');
  }

  clearTreasuryTermsAccepted(entityId: string): void {
    const key = `${this.PREFIX}tos_accepted_${entityId}`;
    this.storage.remove(key);
  }

  saveBankAccountDetails(entityId: string, setupIntentId: string, details: Record<string, any>): void {
    const key = `${this.PREFIX}bank_details_${entityId}`;
    
    try {
      const existingDataStr = this.storage.get(key);
      const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
      
      const dataToSave = {
        ...existingData,
        [setupIntentId]: {
          ...details,
          saved_at: new Date().toISOString(),
          entity_id: entityId
        }
      };
      
      this.storage.set(key, JSON.stringify(dataToSave));
    } catch {
      // Error parsing or saving - ignore silently
    }
  }

  getBankAccountDetails<T = Record<string, any>>(entityId: string, setupIntentId?: string): T | null {
    const key = `${this.PREFIX}bank_details_${entityId}`;
    
    try {
      const savedDataStr = this.storage.get(key);
      if (!savedDataStr) return null;
      
      const savedData = JSON.parse(savedDataStr);
      
      if (setupIntentId && savedData[setupIntentId]) {
        return savedData[setupIntentId] as T;
      }
      
      const entries = Object.entries(savedData);
      if (entries.length === 0) return null;
      
      const mostRecent = entries
        .sort(([, a], [, b]) => {
          const aData = a as { saved_at: string };
          const bData = b as { saved_at: string };
          return new Date(bData.saved_at).getTime() - new Date(aData.saved_at).getTime();
        })[0];
        
      return mostRecent ? mostRecent[1] as T : null;
    } catch {
      return null;
    }
  }

  clearBankAccountDetails(entityId: string): void {
    const key = `${this.PREFIX}bank_details_${entityId}`;
    this.storage.remove(key);
  }

  hasAnyTreasuryTermsAccepted(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      
      const keys = Object.keys(localStorage);
      return keys.some((k) => k.startsWith(`${this.PREFIX}tos_accepted_`) && localStorage.getItem(k) === 'true');
    } catch {
      return false;
    }
  }

  clearAllForEntity(entityId: string): void {
    this.clearTreasuryTermsAccepted(entityId);
    this.clearBankAccountDetails(entityId);
  }
}

export const treasuryStorage = new TreasuryStorageService();
