export * from './components';

export { MoniteProvider } from './core/context/MoniteProvider';
export * from './core/context/RootElementsProvider';
export { useMoniteContext } from './core/context/MoniteContext';
export { toast } from './ui/toast';

export * from './core/utils';
export * from './core/hooks';
export * from './core/queries';
export * from './utils'; // TODO: this export has to be backported to dev branch
export { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
export { MoniteAPIProvider } from '@/core/context/MoniteAPIProvider';
export type * as APISchema from './api/schema';
export {
  createAPIClient,
  type CreateMoniteAPIClientResult,
  type CreateMoniteAPIClientOptions,
} from '@/api/client';
export {
  createChatClient,
  type MoniteChatClient,
  type MoniteChatResponseChunk,
} from './core/context/MoniteChatClient';
