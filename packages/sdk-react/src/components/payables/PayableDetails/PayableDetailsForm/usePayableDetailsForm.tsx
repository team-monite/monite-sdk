import { useMoniteContext } from '@/core/context/MoniteContext';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useCounterpartList } from '@/core/queries/useCounterpart';
import { useCounterpartsBankAccountsList } from '@/core/queries/useCouterpartsBankAccounts';
import { useIsActionAllowed } from '@/core/queries/usePermissions';

export type UsePayableDetailsFormProps = {
  currentCounterpartId: string;
};

export function usePayableDetailsForm({
  currentCounterpartId,
}: UsePayableDetailsFormProps) {
  const { api } = useMoniteContext();
  const { data: user } = useEntityUserByAuthToken();
  const { data: isTagsReadAllowed } = useIsActionAllowed({
    method: 'tag',
    action: 'read',
    entityUserId: user?.id,
  });

  const tagQuery = api.tags.getTags.useQuery(
    {},
    { enabled: isTagsReadAllowed }
  );

  const counterpartQuery = useCounterpartList();

  const counterpartBankAccountQuery =
    useCounterpartsBankAccountsList(currentCounterpartId);

  return {
    tagQuery,
    counterpartQuery,
    counterpartBankAccountQuery,
  };
}
