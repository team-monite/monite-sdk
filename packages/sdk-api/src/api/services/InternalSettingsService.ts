import { CancelablePromise } from '../CancelablePromise';
import type { PartnerProjectSettingsResponse } from '../models/PartnerProjectSettingsResponse';
import { PaymentPageThemePayload } from '../models/PaymentPageThemePayload';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export type PaymentPageTheme = PaymentPageThemePayload;

export class InternalSettingsService extends CommonService {
  /**
   * Get partner settings for frontend
   * Retrieve settings necessary for frontend for this partner.
   * @param partnerId
   * @param projectId
   * @returns PartnerProjectSettingsResponse Successful Response
   * @throws ApiError
   */
  public getInternalSettings(
    partnerId: string,
    projectId: string
  ): CancelablePromise<PartnerProjectSettingsResponse> {
    return __request(
      {
        method: 'GET',
        url: '/internal/settings',
        query: {
          partner_id: partnerId,
          project_id: projectId,
        },
        errors: {
          400: `Bad Request`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }
}
