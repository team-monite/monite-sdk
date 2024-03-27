import type { OrganizationMembershipRole } from '@clerk/backend/dist/types/api/resources/Enums';
import type { Organization } from '@clerk/clerk-sdk-node';

import { OrganizationDomainEnrollmentMode } from '@/lib/clerk-api/types';
import { roles_default_permissions } from '@/lib/monite-api/create-entity-role';
import { nonNullable } from '@/lib/no-nullable';

export const getOrganizationEntityData = (
  organization: Organization | null | undefined
) => {
  const privateMetadata = organization?.privateMetadata as unknown;

  if (!privateMetadata || typeof privateMetadata !== 'object') return {};

  const entity_id =
    ('entity_id' in privateMetadata &&
      typeof privateMetadata.entity_id === 'string' &&
      privateMetadata.entity_id) ||
    undefined;

  return {
    entity_id,
    default_roles: getDefaultRoles(
      'default_roles' in privateMetadata && privateMetadata.default_roles
    ),
    verified_domains: getVerifiedDomains(
      'verified_domains' in privateMetadata && privateMetadata.verified_domains
    ),
  };
};

const getDefaultRoles = (roles: unknown) => {
  if (!roles || typeof roles !== 'object') return {};

  const roleNames = Object.keys(roles_default_permissions) as Array<
    keyof typeof roles_default_permissions
  >;

  const entityRoles: { [key in (typeof roleNames)[number]]?: string } = {};

  for (const roleName of roleNames) {
    const existingEntityRoleId =
      roleName in roles ? roles[roleName as keyof typeof roles] : undefined;

    if (existingEntityRoleId && typeof existingEntityRoleId === 'string')
      entityRoles[roleName] = existingEntityRoleId;
  }

  return entityRoles;
};

const getVerifiedDomains = (domains: unknown) => {
  if (!domains) return {};

  return Object.fromEntries(
    Object.entries(domains)
      .map(([domainId, verifiedDomainUntyped]) => {
        if (!verifiedDomainUntyped || typeof verifiedDomainUntyped !== 'object')
          return null;

        const { name, verification_status, enrollment_mode } =
          verifiedDomainUntyped as Partial<
            Record<keyof VerifiedDomain, unknown>
          >;

        if (typeof name !== 'string') return null;
        if (typeof verification_status !== 'string') return null;
        if (!isDomainEnrollmentModeMode(enrollment_mode)) return null;

        const verifiedDomain: VerifiedDomain = {
          name,
          verification_status,
          enrollment_mode,
        };

        return [domainId, verifiedDomain] as const;
      })
      .filter(nonNullable)
  );
};

export const isDomainEnrollmentModeMode = (
  enrollmentMode: unknown
): enrollmentMode is OrganizationDomainEnrollmentMode => {
  if (typeof enrollmentMode !== 'string') return false;
  return (
    [
      'automatic_suggestion',
      'automatic_invitation',
      'manual_invitation',
    ] satisfies OrganizationDomainEnrollmentMode[]
  ).includes(enrollmentMode as OrganizationDomainEnrollmentMode);
};

type VerifiedDomain = {
  name: string;
  verification_status: string;
  enrollment_mode: OrganizationDomainEnrollmentMode;
};
