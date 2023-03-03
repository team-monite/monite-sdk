/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Status } from './Status';

export type ConnectionChangedData = {
    dataConnectionId: string;
    platformKey: string;
    newStatus: Status;
    oldStatus: Status;
};

