import {
  EntityResponse,
  isIndividualEntity,
  isOrganizationEntity,
} from '@/components/counterparts/helpers';
import { useMoniteContext } from '@/core/context/MoniteContext';

/**
 * @note We are deviating from the default query configuration because the data
 * does not require frequent refetching or retries as the data fetched
 * (user entity information) is relatively static
 *
 * @returns {QueryResult} The result of the user entity fetch.
 */

export const useMe = () => {
  const { api } = useMoniteContext();

  return api.entityUsers.getEntityUsersMe.useQuery(
    {},
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useMyEntity = () => {
  const { api } = useMoniteContext();

  const queryProps = api.entityUsers.getEntityUsersMyEntity.useQuery(
    {},
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const isUSEntity = Boolean(
    queryProps.data?.address && queryProps.data?.address.country === 'US'
  );

  const entityName = getEntityName(queryProps.data);

  return {
    ...queryProps,
    entityName,
    isUSEntity,
  };
};

export const getEntityName = (entity?: EntityResponse) => {
  if (!entity) return '';

  if (isIndividualEntity(entity)) {
    const { first_name, last_name } = entity.individual;
    return `${first_name} ${last_name}`;
  }

  if (isOrganizationEntity(entity)) {
    return entity.organization.legal_name;
  }

  return '';
};
