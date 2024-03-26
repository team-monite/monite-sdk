import type { Organization } from '@clerk/backend/dist/types/api/resources';
import { clerkClient } from '@clerk/nextjs';

import { getOrganizationEntityData } from '@/lib/clerk-api/get-organization-entity';
import { nonNullable } from '@/lib/no-nullable';

export const updateOrganizationVerifiedDomainsMetadata = async (
  {
    organizationId,
  }: {
    organizationId: string;
  },
  verifiedDomains: NonNullable<
    ReturnType<typeof getOrganizationEntityData>['verified_domains']
  >
) => {
  await clerkClient.organizations.updateOrganizationMetadata(organizationId, {
    privateMetadata: {
      verified_domains: {
        ...verifiedDomains,
      },
    },
  });
};

export const deleteOrganizationVerifiedDomainMetadata = async (
  domainId: string
) => {
  const organization = await getOrganizationByDomainId(domainId);

  if (!organization) {
    return void console.error(
      `Organization not found for domain id "${domainId}"`
    );
  }

  await clerkClient.organizations.updateOrganizationMetadata(organization.id, {
    privateMetadata: {
      verified_domains: {
        [domainId]: null, // Clerk removes the key if the value is null
      },
    },
  });
};

export const getOrganizationsByVerifiedDomainName = async (
  domainNames: string[]
) => {
  const organizations = await getAllOrganizations();

  return organizations
    .map((organization) => {
      const { verified_domains = {} } = getOrganizationEntityData(organization);
      const verifiedDomain = Object.values(verified_domains)
        .filter(nonNullable)
        .find(({ name }) => domainNames.includes(name));
      if (!verifiedDomain) return null;
      return [verifiedDomain, organization] as const;
    })
    .filter(nonNullable);
};

const getOrganizationByDomainId = async (domainId: string) => {
  const organizations = await getAllOrganizations();
  return organizations.find((organization) => {
    const { verified_domains } = getOrganizationEntityData(organization);
    return verified_domains?.[domainId];
  });
};

const getAllOrganizations = async () => {
  const organizationPages: Organization[][] = [];
  const isLastPage = () => organizationPages.at(-1)?.length === 0;

  while (!isLastPage()) {
    const organizations = await clerkClient.organizations.getOrganizationList({
      offset: organizationPages.reduce((acc, page) => acc + page.length, 0),
    });
    organizationPages.push(organizations);
  }

  return organizationPages.flat();
};
