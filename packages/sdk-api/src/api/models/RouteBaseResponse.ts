/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type RouteBaseResponse = {
    /**
     * Entry UUID
     */
    id: string;
    partner_id?: string;
    status: string;
    belongs_to_mailbox_domain_id: number;
    provider: string;
    remote_route_id: string;
    webhook: string;
    route_description: any;
    /**
     * UTC datetime
     */
    created_at: string;
    /**
     * UTC datetime
     */
    updated_at: string;
};

