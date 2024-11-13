import {
  EntityResponse,
  isIndividualEntity,
  isOrganizationEntity,
} from '@/components/counterparts/helpers';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { VAT_SUPPORTED_COUNTRIES } from '@/enums/VatCountries';

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

  const isVatSupported = Boolean(
    queryProps.data?.address &&
      VAT_SUPPORTED_COUNTRIES.includes(queryProps.data?.address.country)
  );

  const entityName = getEntityName(queryProps.data);

  return {
    ...queryProps,
    entityName,
    isNonVatSupported: !isVatSupported,
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
