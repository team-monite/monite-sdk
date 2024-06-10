type Webhook<EvtType, Data> = {
  type: EvtType;
  object: 'event';
  data: Data;
};

type Verification = {
  attempts: number;
  expire_at: null | number;
  status: string;
  strategy: string;
};

export type OrganizationDomainEnrollmentMode =
  | 'automatic_suggestion'
  | 'automatic_invitation'
  | 'manual_invitation';

export type OrganizationDomainWebhookEvent =
  | Webhook<
      'organizationDomain.created' | 'organizationDomain.updated',
      {
        /** @example orgdmn_29w9IfBrPmcpi0IeBVaKtA7R94W */
        id: string;
        object: 'organization_domain';
        /** @example abc@example.org */
        affiliation_email_address: string;
        created_at: number;
        enrollment_mode: OrganizationDomainEnrollmentMode;
        /** @example example.org */
        name: string;
        /** @example org_29w9IfBrPmcpi0IeBVaKtA7R94W */
        organization_id: string;
        total_pending_invitations: number;
        total_pending_suggestions: number;
        updated_at: number;
        verification: Verification;
      }
    >
  | Webhook<
      'organizationDomain.deleted',
      {
        /** @example orgdmn_29w9IfBrPmcpi0IeBVaKtA7R94W */
        id: string;
        object: 'organization_domain';
        deleted: boolean;
      }
    >;

export type ThemeVariant = 'monite' | 'material';
export type ThemeMode = 'light' | 'dark';
export type SelectedTheme = [theme: ThemeVariant, mode: ThemeMode];

export type PrivateMetadata = UserPrivateMetadata & {
  selectedTheme: SelectedTheme;
};
