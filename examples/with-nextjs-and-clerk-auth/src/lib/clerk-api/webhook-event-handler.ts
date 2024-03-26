import type {
  OrganizationMembershipWebhookEvent,
  OrganizationWebhookEvent,
  UserWebhookEvent,
  WebhookEvent,
} from '@clerk/clerk-sdk-node';
import { clerkClient } from '@clerk/nextjs';

import { createOrganizationEntity } from '@/lib/clerk-api/create-organization-entity';
import { createUserEntity } from '@/lib/clerk-api/create-user-entity';
import {
  getEntityUserData,
  getUserEntitiesData,
} from '@/lib/clerk-api/get-entity-user-data';
import {
  getOrganizationEntityData,
  isDomainEnrollmentModeMode,
} from '@/lib/clerk-api/get-organization-entity';
import {
  deleteOrganizationVerifiedDomainMetadata,
  getOrganizationsByVerifiedDomainName,
  updateOrganizationVerifiedDomainsMetadata,
} from '@/lib/clerk-api/organization-verified-domain';
import type { OrganizationDomainWebhookEvent } from '@/lib/clerk-api/types';
import { updateOrganizationEntity } from '@/lib/clerk-api/update-organization-entity';
import {
  createEntityRoles,
  isExistingRole,
  roles_default_permissions,
} from '@/lib/monite-api/create-entity-role';
import { generateApprovalPolicies } from '@/lib/monite-api/demo-data-generator/generate-approval-policies';
import { generateEntity } from '@/lib/monite-api/demo-data-generator/generate-entity';
import { fetchTokenServer } from '@/lib/monite-api/fetch-token';
import { updateEntity } from '@/lib/monite-api/update-entity';
import { updateEntityUser } from '@/lib/monite-api/update-entity-user';
import { createMqttMessenger } from '@/lib/mqtt/create-mqtt-messenger';
import { nonNullable } from '@/lib/no-nullable';

export const webhookEventHandler = async (
  event: WebhookEvent | OrganizationDomainWebhookEvent
) => {
  if (event.type === 'organizationMembership.created') {
    await handleOrganizationMembershipCreatedEvent(event);
  } else if (event.type === 'organization.created') {
    await handleOrganizationCreatedEvent(event);
  } else if (event.type === 'organization.updated') {
    await handleOrganizationUpdateEvent(event);
  } else if (event.type === 'user.created') {
    await handleUserCreateEvent(event);
  } else if (event.type === 'user.updated') {
    await handleUserUpdateEvent(event);
  } else if (
    event.type === 'organizationDomain.created' ||
    event.type === 'organizationDomain.updated'
  ) {
    await organizationDomainUpdateEvent(event);
  } else if (event.type === 'organizationDomain.deleted') {
    await organizationDomainDeleteEvent(event);
  }
};

const handleOrganizationMembershipCreatedEvent = async (
  event: OrganizationMembershipWebhookEvent,
  retry = 0
): Promise<void> => {
  if (event.type !== 'organizationMembership.created')
    throw new Error('Invalid event type');

  const [organization, user] = await Promise.all([
    clerkClient.organizations.getOrganization({
      organizationId: event.data.organization.id,
    }),
    clerkClient.users.getUser(event.data.public_user_data.user_id),
  ]);

  const { entity_id, default_roles } = getOrganizationEntityData(organization);

  if (!entity_id) {
    const maxRetries = 3;

    if (retry < maxRetries) {
      console.log(
        `Organization ${
          event.data.organization.id
        } does not have an entity_id, retrying in 1.5s.. (${
          retry + 1
        }/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return void handleOrganizationMembershipCreatedEvent(event, retry + 1);
    }

    throw new Error(
      `Organization ${event.data.organization.id} does not have an entity_id`
    );
  }

  const newEntityUserId = await new Promise<string>(async (resolve, reject) => {
    const { entity_user_id } = getEntityUserData(entity_id, user);
    if (entity_user_id) return resolve(entity_user_id);

    const newEntityUser = await createUserEntity(
      {
        organizationId: organization.id,
        userId: user.id,
        role: isExistingRole(event.data.role)
          ? event.data.role
          : 'guest_member',
        entity: {
          entity_id,
          default_roles,
        },
      },
      {
        token: await fetchTokenServer({
          grant_type: 'client_credentials',
        }),
        clerkClient,
      }
    );
    if (newEntityUser.id) resolve(newEntityUser.id);
    else reject(new Error('Failed to create entity user'));
  });

  if (
    process.env.GENERATE_ENTITY_DEMO_DATA === 'true' &&
    // Generate Approval Policies only for the organization owner
    organization.createdBy === user.id
  ) {
    const { publishMessage, closeMqttConnection } = createMqttMessenger(
      `demo-data-generation-log/${entity_id}`
    );

    await generateApprovalPolicies(
      {
        entity_id,
        entity_user_id: newEntityUserId,
        token: await fetchTokenServer({
          // Approval Policies creation requires `{grant_type: 'entity_user'}` token
          grant_type: 'entity_user',
          entity_user_id: newEntityUserId,
        }),
      },
      publishMessage
    ).finally(() => void closeMqttConnection());
  }
};

const handleOrganizationCreatedEvent = async (
  event: OrganizationWebhookEvent
) => {
  if (event.type !== 'organization.created')
    throw new Error('Invalid event type');

  const [organization, owner] = await Promise.all([
    clerkClient.organizations.getOrganization({
      organizationId: event.data.id,
    }),
    clerkClient.users.getUser(event.data.created_by),
  ]);

  const token = await fetchTokenServer({
    grant_type: 'client_credentials',
  });

  const entity_id = await new Promise<string>(async (resolve) => {
    // Webhook may be called multiple times, so we need to check if the `entity_id` already exists
    const existingEntityId = getOrganizationEntityData(organization).entity_id;
    if (existingEntityId) return existingEntityId;
    resolve(
      createOrganizationEntity({ owner, organization }, token).then(
        ({ id }) => id
      )
    );
  });

  const existingRoles = getOrganizationEntityData(organization).default_roles;
  const entityRoles = Object.keys(roles_default_permissions)
    .filter(isExistingRole)
    // Webhook may be called multiple times, so we need to create only the roles that do not exist
    .filter((role) => !existingRoles?.[role]);

  await updateOrganizationEntity(
    {
      organizationId: organization.id,
      entity: {
        entity_id,
        default_roles: await createEntityRoles(entity_id, entityRoles, token),
      },
    },
    clerkClient
  );

  if (process.env.GENERATE_ENTITY_DEMO_DATA === 'true') {
    const { publishMessage, closeMqttConnection } = createMqttMessenger(
      `demo-data-generation-log/${entity_id}`
    );

    await generateEntity(
      { entity_id },
      {
        logger: publishMessage,
        token,
      }
    ).finally(() => void closeMqttConnection());
  }
};

const handleOrganizationUpdateEvent = async (
  event: OrganizationWebhookEvent
) => {
  if (event.type !== 'organization.updated')
    throw new Error('Invalid event type');

  const organization = await clerkClient.organizations.getOrganization({
    organizationId: event.data.id,
  });

  const { entity_id } = getOrganizationEntityData(organization);

  if (!entity_id)
    throw new Error(`Organization ${event.data.id} does not have an entity_id`);

  await updateEntity({
    entity_id,
    entity: {
      organization: {
        legal_name: event.data.name,
      },
    },
  });
};

/**
 * Clerk Auto Invitation is kind of broken, so we have to do it manually.
 * On user creation, we check if the user has a verified domain.
 * If so, we check if the verified domain of any organization has the enrollment
 * mode "auto-invitation".
 * If so, we create an organization membership for the user.
 */
const handleUserCreateEvent = async (event: UserWebhookEvent) => {
  if (event.type !== 'user.created') throw new Error('Invalid event type');

  const emailAddressDomainList = event.data.email_addresses
    .filter(({ verification }) => verification?.status === 'verified')
    .map(({ email_address }) => email_address.split('@').at(-1))
    .filter(nonNullable);

  const organizations = await getOrganizationsByVerifiedDomainName(
    emailAddressDomainList
  );

  const enrollmentModes =
    process.env.CLERK_AUTO_INVINTATION_VERIFIED_DOMAIN_ENROLLMENT_MODES?.split(
      ','
    )
      .flatMap((mode) => mode.split(' '))
      .filter(isDomainEnrollmentModeMode);

  for (const [verifiedDomain, organization] of organizations) {
    if (!enrollmentModes?.includes(verifiedDomain.enrollment_mode)) {
      console.log(
        `User ${event.data.id} has a verified domain "${verifiedDomain.name}" with enrollment mode "${verifiedDomain.enrollment_mode}", skipping..`
      );
      continue;
    }

    await clerkClient.organizations.createOrganizationMembership({
      organizationId: organization.id,
      userId: event.data.id,
      role: 'basic_member',
    });
  }
};

const handleUserUpdateEvent = async (event: UserWebhookEvent) => {
  if (event.type !== 'user.updated') throw new Error('Invalid event type');

  const [user, organizationMembershipList] = await Promise.all([
    clerkClient.users.getUser(event.data.id),
    clerkClient.users.getOrganizationMembershipList({
      userId: event.data.id,
    }),
  ]);

  const userEntities = getUserEntitiesData(user);

  for (const member of organizationMembershipList) {
    const { entity_id, default_roles } = getOrganizationEntityData(
      member.organization
    );

    if (!entity_id) {
      console.error(
        `Organization "${member.organization.id}" does not have an entity_id`
      );
      continue;
    }

    const entity_user_id = userEntities[entity_id]?.entity_user_id;

    if (!entity_user_id) {
      console.error(
        `User "${event.data.id}" does not have an entity_user_id "${entity_user_id}"`
      );
      continue;
    }

    const entityRoleId =
      member.role && default_roles?.[member.role as keyof typeof default_roles];

    if (!entityRoleId)
      throw new Error(
        `User ${event.data.id} does not have an "${entity_id}" organization membership role`
      );

    const email = user.emailAddresses.at(0)?.emailAddress;

    await updateEntityUser(
      {
        entity_id,
        entity_user_id: entity_user_id ?? undefined,
        user: {
          role_id: entityRoleId,
          first_name: user.firstName || email || '',
          last_name: user.lastName ?? undefined,
          phone: user.phoneNumbers.at(0)?.phoneNumber ?? undefined,
          email,
        },
      },
      await fetchTokenServer({
        grant_type: 'client_credentials',
      })
    );
  }
};

const organizationDomainUpdateEvent = async (
  event: OrganizationDomainWebhookEvent
) => {
  if (
    event.type !== 'organizationDomain.created' &&
    event.type !== 'organizationDomain.updated'
  )
    throw new Error('Invalid event type');

  await updateOrganizationVerifiedDomainsMetadata(
    {
      organizationId: event.data.organization_id,
    },
    {
      [event.data.id]: {
        name: event.data.name,
        verification_status: event.data.verification.status,
        enrollment_mode: event.data.enrollment_mode,
      },
    }
  );
};

const organizationDomainDeleteEvent = async (
  event: OrganizationDomainWebhookEvent
) => {
  if (event.type !== 'organizationDomain.deleted')
    throw new Error('Invalid event type');

  await deleteOrganizationVerifiedDomainMetadata(event.data.id);
};
