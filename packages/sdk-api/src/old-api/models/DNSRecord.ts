/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { DNSRecordPurpose } from './DNSRecordPurpose';
import type { DNSRecordType } from './DNSRecordType';

export type DNSRecord = {
  is_active: boolean;
  name?: string;
  /**
   * Purpose of specific entry to distinguish between various TXT entries.
   */
  record_purpose?: DNSRecordPurpose;
  record_type: DNSRecordType;
  /**
   * Field reflecting validation status by Mailgun.
   */
  valid: string;
  value: string;
};
