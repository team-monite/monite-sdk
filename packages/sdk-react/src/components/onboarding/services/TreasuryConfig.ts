/**
 * Treasury configuration service
 * Manages configuration for Treasury-related features including storage strategy
 */

declare global {
  interface Window {
    VITE_TREASURY_STORAGE?: string;
    REACT_APP_TREASURY_STORAGE?: string;
    VITE_TREASURY_DEBUG?: string;
    REACT_APP_TREASURY_DEBUG?: string;
    VITE_TREASURY_SAVE_ENDPOINT?: string;
    REACT_APP_TREASURY_SAVE_ENDPOINT?: string;
  }
}

export interface TreasuryConfiguration {
  /**
   * Storage strategy for bank account details
   * - 'localStorage': Use browser localStorage (default, for development/testing)
   * - 'api': Use API endpoint (fails if unavailable - no silent fallback to localStorage)
   * - 'none': Don't store bank details at all
   */
  bankDetailsStorage: 'localStorage' | 'api' | 'none';

  /**
   * Custom API endpoint for saving bank details (when storage is 'api')
   * If not provided, defaults to '/internal/stripe-bank-account-verification/save-details'
   */
  saveBankDetailsEndpoint?: string;

  /**
   * Enable debug logging for Treasury operations
   */
  debug?: boolean;

  /**
   * Custom timeout for API calls in milliseconds
   */
  apiTimeout?: number;

  /**
   * Enable optimistic UI updates (update UI before API response)
   */
  optimisticUpdates?: boolean;
}

class TreasuryConfigService {
  private config: TreasuryConfiguration = {
    bankDetailsStorage: 'none',
    optimisticUpdates: true,
    debug: false,
    apiTimeout: 30000,
  };

  getConfig(): TreasuryConfiguration {
    return { ...this.config };
  }

  setConfig(updates: Partial<TreasuryConfiguration>): void {
    this.config = {
      ...this.config,
      ...updates,
    };

    if (this.config.debug) {
      console.log('[TreasuryConfig] Configuration updated:', this.config);
    }
  }

  isFeatureEnabled(feature: keyof TreasuryConfiguration): boolean {
    const value = this.config[feature];
    return value !== undefined && value !== false && value !== 'none';
  }

  getStorageStrategy(): TreasuryConfiguration['bankDetailsStorage'] {
    return this.config.bankDetailsStorage;
  }

  useLocalStorage(): boolean {
    return this.config.bankDetailsStorage === 'localStorage';
  }

  useAPI(): boolean {
    return this.config.bankDetailsStorage === 'api';
  }

  getSaveBankDetailsEndpoint(): string {
    return (
      this.config.saveBankDetailsEndpoint ||
      '/internal/stripe-bank-account-verification/save-details'
    );
  }

  debug(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[Treasury] ${message}`, data || '');
    }
  }

  initFromEnv(): void {
    if (typeof window !== 'undefined') {
      const processEnv = typeof process !== 'undefined' && process.env ? process.env : {};
      
      const envStorage =
        window.VITE_TREASURY_STORAGE ||
        window.REACT_APP_TREASURY_STORAGE ||
        processEnv.VITE_TREASURY_STORAGE ||
        processEnv.REACT_APP_TREASURY_STORAGE;

      if (
        envStorage === 'api' ||
        envStorage === 'localStorage' ||
        envStorage === 'none'
      ) {
        this.config.bankDetailsStorage = envStorage;
      }

      const envDebug =
        window.VITE_TREASURY_DEBUG ||
        window.REACT_APP_TREASURY_DEBUG ||
        processEnv.VITE_TREASURY_DEBUG ||
        processEnv.REACT_APP_TREASURY_DEBUG;

      if (envDebug === 'true' || envDebug === '1') {
        this.config.debug = true;
      }

      const envEndpoint =
        window.VITE_TREASURY_SAVE_ENDPOINT ||
        window.REACT_APP_TREASURY_SAVE_ENDPOINT ||
        processEnv.VITE_TREASURY_SAVE_ENDPOINT ||
        processEnv.REACT_APP_TREASURY_SAVE_ENDPOINT;

      if (envEndpoint) {
        this.config.saveBankDetailsEndpoint = envEndpoint;
      }
    }
  }
}

export const treasuryConfig = new TreasuryConfigService();

treasuryConfig.initFromEnv();

export { TreasuryConfigService };
