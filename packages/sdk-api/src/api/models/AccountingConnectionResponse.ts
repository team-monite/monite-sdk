/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConnectionStatus } from './ConnectionStatus';
import type { ErrorSchema } from './ErrorSchema';

export type AccountingConnectionResponse = {
    id: string;
    status?: ConnectionStatus;
    platform?: string;
    connection_url: string;
    last_pull?: string;
    errors?: Array<ErrorSchema>;
    created_at: string;
    updated_at: string;
};

