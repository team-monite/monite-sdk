/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { DNSRecords } from './DNSRecords';

export type DomainResponse = {
  /**
   * Entry UUID
   */
  id: string;
  /**
   * A dedicated IP address assigned to this mailbox and used to send outgoing email.
   */
  dedicated_ip?: string;
  dns_records: DNSRecords | Record<string, any>;
  domain: string;
  status: string;
};
