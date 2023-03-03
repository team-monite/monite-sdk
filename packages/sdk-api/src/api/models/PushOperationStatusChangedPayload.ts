/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PushOperationStatusChangedData } from './PushOperationStatusChangedData';

export type PushOperationStatusChangedPayload = {
    CompanyId: string;
    RuleId: string;
    AlertId: string;
    Message: string;
    RuleType: PushOperationStatusChangedPayload.RuleType;
    ClientId: string;
    ClientName: string;
    DataConnectionId: string;
    Data: PushOperationStatusChangedData;
};

export namespace PushOperationStatusChangedPayload {

    export enum RuleType {
        PUSH_OPERATION_STATUS_CHANGED_ = 'Push Operation Status Changed()',
    }


}

