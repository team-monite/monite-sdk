/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ProcessStatusEnum } from './ProcessStatusEnum';

export type ProcessResource = {
  id: string;
  /**
   * Tthe current status of the approval policy process.
   */
  status: ProcessStatusEnum;
  /**
   * The input for the script.
   */
  input: Record<string, any>;
  /**
   * The error for the process.
   */
  error?: Record<string, any>;
  /**
   * The script snapshot taken when script started.
   */
  script_snapshot?: boolean | number | string | Record<string, any>;
  /**
   * The metadata for the process.
   */
  metadata: Record<string, any>;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
};
