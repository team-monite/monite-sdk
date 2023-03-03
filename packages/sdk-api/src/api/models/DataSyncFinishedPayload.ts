/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataSyncFinishedData } from './DataSyncFinishedData';

export type DataSyncFinishedPayload = {
    CompanyId: string;
    RuleId: string;
    AlertId: string;
    Message: string;
    RuleType: DataSyncFinishedPayload.RuleType;
    Data: DataSyncFinishedData;
};

export namespace DataSyncFinishedPayload {

    export enum RuleType {
        DATA_SYNC_COMPLETED = 'Data sync completed',
    }


}

