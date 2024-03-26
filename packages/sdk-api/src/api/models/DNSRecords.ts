/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { DNSRecord } from './DNSRecord';

export type DNSRecords = {
  /**
   * Set of DNS settings required by Mailgun for domain verification before emails receiving is possible.
   */
  receiving_dns_records: Array<DNSRecord>;
  /**
   * Set of DNS settings required by Mailgun for domain verification before emails sending is possible.
   */
  sending_dns_records: Array<DNSRecord>;
};
