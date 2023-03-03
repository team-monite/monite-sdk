/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TextTemplateResponse } from './TextTemplateResponse';

export type TextTemplateResponseList = {
    data: Array<TextTemplateResponse>;
    next_pagination_token?: string;
    prev_pagination_token?: string;
};

