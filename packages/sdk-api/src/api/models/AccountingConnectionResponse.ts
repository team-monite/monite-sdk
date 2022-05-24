/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ConnectionStatus } from './ConnectionStatus';
import type { ErrorSchema } from './ErrorSchema';

export type AccountingConnectionResponse = {
  id: string;
  created_at: string;
  updated_at: string;
  connection_url: string;
  errors?: Array<ErrorSchema>;
  last_pull?: string;
  platform?: string;
  status?: ConnectionStatus;
};
