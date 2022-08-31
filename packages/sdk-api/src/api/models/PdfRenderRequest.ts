/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CustomTemplate } from './CustomTemplate';
import type { InviteTemplate } from './InviteTemplate';
import type { ReceivableTemplate } from './ReceivableTemplate';

export type PdfRenderRequest = (ReceivableTemplate | InviteTemplate | CustomTemplate);

