/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataTypes } from './DataTypes';

export type PushOperationStatusChangedData = {
    dataType: DataTypes;
    status: string;
    pushOperationKey: string;
};

