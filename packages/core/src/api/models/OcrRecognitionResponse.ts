/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LabelNValue } from './LabelNValue';

export type OcrRecognitionResponse = {
    summary?: Array<LabelNValue>;
    line_items?: Array<LabelNValue>;
};
