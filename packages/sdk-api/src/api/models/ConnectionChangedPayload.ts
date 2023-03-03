/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConnectionChangedData } from './ConnectionChangedData';

export type ConnectionChangedPayload = {
    CompanyId: string;
    RuleId: string;
    AlertId: string;
    Message: string;
    RuleType: ConnectionChangedPayload.RuleType;
    Data: ConnectionChangedData;
};

export namespace ConnectionChangedPayload {

    export enum RuleType {
        DATA_CONNECTION_STATUS_CHANGED = 'DataConnectionStatusChanged',
    }


}

