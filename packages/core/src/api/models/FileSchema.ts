/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PreviewSchema } from './PreviewSchema';

export type FileSchema = {
    id: string;
    created_at: string;
    file_type: string;
    name: string;
    region: string;
    md5: string;
    mimetype: string;
    url: string;
    size: number;
    previews?: Array<PreviewSchema>;
};
