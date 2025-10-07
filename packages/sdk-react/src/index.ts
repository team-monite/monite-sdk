import './ui/table/TablePagination.theme';

export * from './components';

export {
  MoniteProvider,
  type MoniteSettings,
} from './core/context/MoniteProvider';
export * from './core/context/RootElementsProvider';
export { useMoniteContext } from './core/context/MoniteContext';
export { toast } from './ui/toast';

export * from './core/utils';
export * from './core/hooks';
export * from './core/queries';
export { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
export { MoniteAPIProvider } from '@/core/context/MoniteAPIProvider';
export type * as APISchema from './api/schema';
export {
  createAPIClient,
  type CreateMoniteAPIClientResult,
  type CreateMoniteAPIClientOptions,
} from '@/api/client';
export type {
  ComponentSettings,
  PayActionHandlers,
} from './core/componentSettings';
export type {
  MoniteApprovalRequestStatusChipProps,
  MoniteInvoiceStatusChipProps,
  MonitePayableStatusChipProps,
  MoniteCounterpartStatusChipProps,
  MoniteApprovalStatusChipProps,
  MoniteInvoiceRecurrenceStatusChipProps,
  MoniteInvoiceRecurrenceIterationStatusChipProps,
} from './core/theme/types';
export type {
  PaginationLayout,
  PaginationPosition,
} from './ui/table/TablePagination.types';
