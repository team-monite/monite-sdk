import {
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

  return {
    ...queryProps,
    isUSEntity,
  };
};

export const useMyEntityName = () => {
  const { data: myEntity } = useMyEntity();

  if (isOrganizationEntity(myEntity)) return myEntity.organization.legal_name;
  else if (isIndividualEntity(myEntity))
    return myEntity.individual.first_name + ' ' + myEntity.individual.last_name;
  return '';
};
