import chalk from 'chalk';

import type {
  Organization,
  OrganizationMembership,
  User,
} from '@clerk/clerk-sdk-node';
import type { clerkClient as clerkClientType } from '@clerk/nextjs';

import { createOrganizationEntity } from '@/lib/clerk-api/create-organization-entity';
import { createUserEntity } from '@/lib/clerk-api/create-user-entity';
import {
  getEntityUserData,
  getUserEntitiesData,
} from '@/lib/clerk-api/get-entity-user-data';
import { getOrganizationEntityData } from '@/lib/clerk-api/get-organization-entity';
import { updateOrganizationEntity } from '@/lib/clerk-api/update-organization-entity';
import {
  createEntityRoles,
  isExistingRole,
  roles_default_permissions,
} from '@/lib/monite-api/create-entity-role';
import { generateApprovalPolicies } from '@/lib/monite-api/demo-data-generator/generate-approval-policies';
import { AccessToken, fetchTokenServer } from '@/lib/monite-api/fetch-token';

/**
 * Generates a new Entity for the Organization and migrates the users to the new Entity
 * Previous Entity will not be deleted.
 * If migration fails, Organization Entity will be reverted
 *
 * @returns The new Entity data for the Organization
 */
export const recreateOrganizationEntity = async ({
  organizationId,
  token,
  clerkClient,
}: {
  organizationId: string;
  token: AccessToken;
  clerkClient: typeof clerkClientType;
}) => {
  const organization = await clerkClient.organizations.getOrganization({
    organizationId,
  });

  // Reverts the changes for the 'Organization' if `createOrganizationEntity()` fails
  const revertOrganizationEntityChanges = createRevertOrganizationEntity(
    organization,
    clerkClient
  );

  try {
    console.log(
      chalk.greenBright(
        `Creating a new entity for the organization "${organization.id}"`
      )
    );

    const owner = await clerkClient.users.getUser(organization.createdBy);

    const newEntity = await createOrganizationEntity(
      {
        email: owner.emailAddresses.at(0)?.emailAddress ?? '',
        legal_name: organization.name,
      },
      token
    );

    console.log(
      chalk.greenBright(
        `✅ New Entity has been created for the organization "${organization.id}" with the entity_id "${newEntity.id}"`
      )
    );

    console.log(
      chalk.greenBright(
        `Creating new roles for the new entity_id "${newEntity.id}"`
      )
    );

    const newEntityRoles = await createEntityRoles(
      newEntity.id,
      Object.keys(roles_default_permissions).filter(isExistingRole),
      token
    );

    console.log(
      chalk.greenBright(
        `✅ New roles have been created for the new entity_id "${newEntity.id}"`
      )
    );

    console.log(
      chalk.greenBright(
        `Updating the organization "${organization.id}" with the new Entity "${newEntity.id}"`
      )
    );

    /**
     * We must update Organization with the new Entity before migrating the users
     * It's needed because `user.updated` webhook event will be triggered,
     * and it will assume that the Organization has the new Entity
     */
    await updateOrganizationEntity(
      {
        organizationId: organization.id,
        entity: {
          entity_id: newEntity.id,
          default_roles: newEntityRoles,
        },
      },
      clerkClient
    );

    console.log(
      chalk.greenBright(
        `✅ Organization "${organization.id}" has been updated with the new Entity "${newEntity.id}"`
      )
    );

    console.log(
      chalk.greenBright(
        `Migrating members to the new Entity for the organization "${organization.id}" with the entity_id "${newEntity.id}"`
      )
    );

    await createOrganizationMembersMissingEntityUsers(
      {
        organizationId,
        entity: {
          entity_id: newEntity.id,
          default_roles: newEntityRoles,
        },
      },
      {
        token,
        clerkClient,
      }
    );

    const updatedOwner = await clerkClient.users.getUser(
      organization.createdBy
    );

    const { entity_user_id: ownerEntityUserId } = getEntityUserData(
      newEntity.id,
      updatedOwner
    );

    if (!ownerEntityUserId)
      throw new Error(
        `entity_user_id is not set for the owner "${updatedOwner.id}" of the organization "${organization.id}"`
      );

    await generateApprovalPolicies({
      entity_id: newEntity.id,
      entity_user_id: ownerEntityUserId,
      token: await fetchTokenServer({
        // Approval Policies creation requires `{grant_type: 'entity_user'}` token
        grant_type: 'entity_user',
        entity_user_id: ownerEntityUserId,
      }),
    });

    console.log(
      chalk.greenBright(
        `✅ Members have been migrated in the new Entity "${newEntity.id}" for the organization "${organizationId}"`
      )
    );

    return { entity_id: newEntity.id };
  } catch (error) {
    console.error(
      `Error while migrating Organization users: createOrganizationEntity for the organization "${
        organization.id
      }" and entity_id "${getOrganizationEntityData(organization).entity_id}"`
    );

    // Reverting the changes to the Users is not needed
    await revertOrganizationEntityChanges();

    throw error;
  }
};

/**
 * Creates a new Entity Users for the Organization Members
 * if the Member does not have an `EntityUser` for the Organization `Entity`
 */
const createOrganizationMembersMissingEntityUsers = async (
  {
    organizationId,
    entity,
  }: {
    /** The Clerk Organization for which the Entity Users are missing, but members are present */
    organizationId: string;
    /** The new Entity for the Organization */
    entity: Required<
      Pick<
        ReturnType<typeof getOrganizationEntityData>,
        'entity_id' | 'default_roles'
      >
    >;
  },
  {
    token,
    clerkClient,
  }: {
    /** The token to use for the Monite API requests (must be issued with `{grant_type: 'client_credentials'}`) */
    token: AccessToken;
    /** The Clerk client instance */
    clerkClient: typeof clerkClientType;
  }
) => {
  console.log(
    chalk.greenBright(
      `Fetching the list of members in the organization "${organizationId}"`
    )
  );

  if (!entity.entity_id)
    throw new Error(
      `entity_id is not set for the migration the organization "${organizationId}"`
    );

  const organizationMembershipList = await getOrganizationMembershipList({
    organizationId,
    clerkClient,
  });

  const organizationUserMap = (
    await getUserList({
      userId: organizationMembershipList.map(({ publicUserData }) => {
        if (!publicUserData?.userId)
          throw new Error('publicUserData.userId is not set');
        return publicUserData.userId;
      }),
      clerkClient,
    })
  ).reduce((acc, user) => acc.set(user.id, user), new Map<string, User>());

  try {
    console.log(
      chalk.greenBright(
        `Migrating users to entity_id "${entity.entity_id}" in the organization "${organizationId}"`
      )
    );

    for (const member of organizationMembershipList) {
      if (!member.publicUserData?.userId)
        throw new Error(
          `"publicUserData.userId" is not set for member "${member.id}"`
        );

      const user = organizationUserMap.get(member.publicUserData.userId);

      if (!user) {
        throw new Error(
          `User "${member.publicUserData.userId}" does not exist in the organization "${organizationId}"`
        );
      }

      if (getUserEntitiesData(user)[entity.entity_id]) {
        console.log(
          chalk.yellow(
            `- Skipping migrating the user ${
              user.id
            } of the organization "${organizationId}", because the user already has an entity_id "${
              entity.entity_id
            }" (${organizationMembershipList.indexOf(member) + 1}/ ${
              organizationMembershipList.length
            })`
          )
        );
        continue;
      }

      console.log(
        chalk.gray(
          `- Migrating user "${user.id}" to entity_id "${entity.entity_id}"`
        )
      );

      if (!isExistingRole(member.role))
        throw new Error(`Role "${member.role}" is not in the default roles`);

      await createUserEntity(
        {
          entity,
          organizationId,
          userId: user.id,
          role: member.role,
        },
        { token, clerkClient }
      );

      console.log(
        chalk.gray(
          `- User "${user.id}" has been migrated (${
            organizationMembershipList.indexOf(member) + 1
          }/ ${organizationMembershipList.length})`
        )
      );
    }
  } catch (error) {
    console.error(
      `Error while migrating Organization users: createUserEntity for user`,
      `in the organization "${organizationId}" and entity_id "${entity.entity_id}"`
    );

    throw error;
  }

  console.log(
    chalk.greenBright(
      `✅ All users have been migrated in the new Entity for the organization "${organizationId}"`
    )
  );
};

const createRevertOrganizationEntity = (
  organization: Organization,
  clerkClient: typeof clerkClientType
) => {
  const entityPreviousData = getOrganizationEntityData(organization);

  return () => {
    console.log(
      chalk.redBright(
        `⏪ Reverting the changes for the organization "${organization.id}"`
      )
    );

    return updateOrganizationEntity(
      {
        entity: entityPreviousData,
        organizationId: organization.id,
      },
      clerkClient
    );
  };
};

const getUserList = async ({
  userId,
  clerkClient,
}: {
  userId: string[];
  clerkClient: typeof clerkClientType;
}) => {
  const organizationUserListPages: User[][] = [];

  const isLastPage = () => organizationUserListPages.at(-1)?.length === 0;

  while (!isLastPage()) {
    organizationUserListPages.push(
      await clerkClient.users.getUserList({
        userId,
        limit: 20,
        offset: organizationUserListPages.reduce(
          (acc, page) => acc + page.length,
          0
        ),
      })
    );
  }

  return organizationUserListPages.flat();
};

export const getOrganizationMembershipList = async ({
  organizationId,
  clerkClient,
}: {
  organizationId: string;
  clerkClient: typeof clerkClientType;
}) => {
  const organizationMembershipPages: OrganizationMembership[][] = [];

  const isLastPage = () => organizationMembershipPages.at(-1)?.length === 0;

  while (!isLastPage()) {
    const members =
      await clerkClient.organizations.getOrganizationMembershipList({
        organizationId,
        limit: 20,
        offset: organizationMembershipPages.reduce(
          (acc, page) => acc + page.length,
          0
        ),
      });
    organizationMembershipPages.push(members);

    if (members.length) {
      console.log(
        chalk.bgBlueBright(
          `Fetched ${members.length} members in the organization "${organizationId}"...`
        )
      );
    }
  }

  console.log(
    chalk.greenBright(
      `✅ Fetched total ${
        organizationMembershipPages.flat().length
      } members in the organization "${organizationId}".`
    )
  );

  return organizationMembershipPages.flat();
};
