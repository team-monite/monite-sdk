import { packageVersion as sdkReactPackageVersion } from '@/packageVersion';
import type { MoniteSDK } from '@monite/sdk-api';
import {
  apiVersion as backendVersion,
  packageVersion as sdkApiVersion,
} from '@monite/sdk-api';
import {
  Hub,
  BrowserClient,
  makeFetchTransport,
  defaultStackParser,
  BrowserProfilingIntegration,
  BrowserTracing,
} from '@sentry/react';

export interface ISentryService {
  create(sdk: MoniteSDK): Hub;
}

interface ISentryConfig {
  environment: 'dev' | 'sandbox' | 'production';
  entityId: string;
}

export class SentryFactory implements ISentryService {
  constructor(private config: ISentryConfig) {}

  /**
   * Initialize Sentry with all provided `tags` and `environment`
   */
  public create(): Hub {
    /**
     * We shouldn't enable `Sentry` for production until we are
     *  on 100% sure that all customer's data is ignored
     */
    const sentryEnvironment = this.config.environment;

    const isLocalhost =
      typeof document !== 'undefined' &&
      document.location.hostname === 'localhost';

    // todo::remove this since in is not supported by esm
    const isDevelopmentRuntime =
      typeof process !== 'undefined' && typeof process.env === 'object'
        ? process.env.NODE_ENV === 'development' ||
          process.env.TESTS === 'true' ||
          process.env.TESTS === '1'
        : false;

    const debug = sentryEnvironment === 'dev';
    const enabled =
      sentryEnvironment !== 'production' &&
      !isDevelopmentRuntime &&
      !isLocalhost;

    const client = new BrowserClient({
      dsn: 'https://6639ef68c6db10ad889794dbd6822dca@o310686.ingest.sentry.io/4505629057286144',
      environment: sentryEnvironment,
      release: sdkReactPackageVersion,
      transport: makeFetchTransport,
      stackParser: defaultStackParser,
      integrations: [new BrowserProfilingIntegration(), new BrowserTracing()],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 1.0,
      replaysOnErrorSampleRate: 1.0,
      debug: debug,
      enabled: enabled,
    });

    const hub = new Hub(client);

    hub.configureScope((scope) => {
      scope.setTags({
        entityId: this.config.entityId,
        sdkApiVersion,
        backendVersion,
      });
    });

    return hub;
  }
}
