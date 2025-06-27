import { apiVersion } from '@/api/api-version';
import type { MoniteSettings } from '@/core/context/MoniteProvider';
import { packageVersion } from '@/packageVersion';
import * as Sentry from '@sentry/react';
import { makeFetchTransport, defaultStackParser } from '@sentry/react';

export interface ISentryService {
  create(sdk: MoniteSettings): void; // Create method will now initialize Sentry directly
}

interface ISentryConfig {
  environment: 'dev' | 'sandbox' | 'production';
  entityId: string;
}

const createNoopClient = (): Sentry.BrowserClient => {
  return new Sentry.BrowserClient({
    dsn: '',
    transport: Sentry.makeFetchTransport,
    stackParser: Sentry.defaultStackParser,
    integrations: [],
  });
};

const getCommonSentryConfig = () => ({
  dsn: 'https://6639ef68c6db10ad889794dbd6822dca@o310686.ingest.sentry.io/4505629057286144',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export const SentryFactory = {
  create(config: ISentryConfig): Sentry.BrowserClient {
    /**
     * We shouldn't enable `Sentry` for production until we are
     *  on 100% sure that all customer's data is ignored
     */
    const sentryEnvironment = config.environment;

    const isLocalhost =
      typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const isDevelopmentRuntime = import.meta.env.MODE === 'development';

    const debug = sentryEnvironment === 'dev';
    const enabled =
      sentryEnvironment !== 'production' &&
      !isDevelopmentRuntime &&
      !isLocalhost;

    if (!enabled) return createNoopClient();

    Sentry.init({
      ...getCommonSentryConfig(),
      environment: sentryEnvironment,
      release: packageVersion,
      transport: makeFetchTransport,
      stackParser: defaultStackParser,
      debug: debug,
    });

    Sentry.getCurrentScope().update((scope) => {
      scope.setTags({
        entityId: config.entityId,
        packageVersion,
        apiVersion,
      });
      return scope;
    });

    return new Sentry.BrowserClient({
      ...getCommonSentryConfig(),
      transport: Sentry.makeFetchTransport,
      stackParser: Sentry.defaultStackParser,
    });
  },
};
