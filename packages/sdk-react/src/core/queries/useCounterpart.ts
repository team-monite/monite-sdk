import { toast } from 'react-hot-toast';

import { components, Services } from '@/api';
import {
  getCounterpartName,
  getIndividualName,
} from '@/components/counterparts/helpers';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { useMoniteContext } from '../context/MoniteContext';

export type CounterpartResponse =
  | components['schemas']['CounterpartIndividualRootResponse']
  | components['schemas']['CounterpartOrganizationRootResponse'];

export const useCounterpartAddresses = (counterpartId?: string) => {
  const { api } = useMoniteContext();

  return api.counterparts.getCounterpartsIdAddresses.useQuery(
    {
      path: { counterpart_id: counterpartId ?? '' },
    },
    {
      enabled: !!counterpartId,
    }
  );
};

export const useUpdateCounterpartAddress = ({
  counterpartId,
  addressId,
}: {
  addressId: string;
  counterpartId: string;
}) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.counterparts.patchCounterpartsIdAddressesId.useMutation(
    {
      path: { counterpart_id: counterpartId, address_id: addressId },
    },
    {
      onSuccess: async (updatedAddress) => {
        api.counterparts.getCounterpartsIdAddressesId.setQueryData(
          {
            path: { counterpart_id: counterpartId, address_id: addressId },
          },
          (prevAddress) => ({
            ...prevAddress,
            ...updatedAddress,
          }),
          queryClient
        );

        await api.counterparts.getCounterpartsIdAddresses.invalidateQueries(
          {
            parameters: {
              path: { counterpart_id: counterpartId },
            },
          },
          queryClient
        );

        toast.success(
          t(i18n)`Address “${updatedAddress.line1}” has been updated.`
        );
      },

      onError: () => {
        toast.error(t(i18n)`Failed to update Address.`);
      },
    }
  );
};

export const useCreateCounterpartBank = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.counterparts.postCounterpartsIdBankAccounts.useMutation(
    undefined,
    {
      onSuccess: async (bank) => {
        await api.counterparts.getCounterpartsIdBankAccounts.invalidateQueries(
          {
            parameters: { path: { counterpart_id: bank.counterpart_id } },
          },
          queryClient
        );
        toast.success(t(i18n)`Bank Account “${bank.name}” has been created.`);
      },

      onError: () => {
        toast.error(t(i18n)`Failed to create Bank Account.`);
      },
    }
  );
};

export const useCounterpartBankById = (
  counterpartId: string,
  bankId?: string
) => {
  const { api } = useMoniteContext();

  return api.counterparts.getCounterpartsIdBankAccountsId.useQuery(
    {
      path: {
        counterpart_id: counterpartId,
        bank_account_id: bankId ?? '',
      },
    },
    {
      enabled: !!bankId,
    }
  );
};

export const useUpdateCounterpartBank = () => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  return api.counterparts.patchCounterpartsIdBankAccountsId.useMutation(
    undefined,
    {
      onSuccess: async (bank) => {
        toast.success(t(i18n)`Bank Account “${bank.name}” has been updated.`);

        api.counterparts.getCounterpartsIdBankAccountsId.setQueryData(
          {
            path: {
              counterpart_id: bank.counterpart_id,
              bank_account_id: bank.id,
            },
          },
          (prevBankAccount) => ({
            ...prevBankAccount,
            ...bank,
          }),
          queryClient
        );

        await api.counterparts.getCounterpartsIdBankAccounts.invalidateQueries(
          {
            parameters: { path: { counterpart_id: bank.counterpart_id } },
          },
          queryClient
        );
      },

      onError: () => {
        toast.error(t(i18n)`Failed to update Bank Account.`);
      },
    }
  );
};

export const useDeleteCounterpartBank = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.counterparts.deleteCounterpartsIdBankAccountsId.useMutation(
    undefined,
    {
      onSuccess: async () => {
        await api.counterparts.getCounterpartsIdBankAccounts.invalidateQueries(
          {
            parameters: { path: { counterpart_id: counterpartId } },
          },
          queryClient
        );

        toast.success(t(i18n)`Bank Account has been deleted.`);
      },

      onError: () => {
        toast.error(t(i18n)`Failed to delete Bank Account.`);
      },
    }
  );
};

export const useCounterpartVatList = (counterpartId?: string) => {
  const { api } = useMoniteContext();

  return api.counterparts.getCounterpartsIdVatIds.useQuery(
    {
      path: {
        counterpart_id: counterpartId ?? '',
      },
    },
    {
      enabled: !!counterpartId,
    }
  );
};

export const useCreateCounterpartVat = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.counterparts.postCounterpartsIdVatIds.useMutation(undefined, {
    onSuccess: async (vatId) => {
      await api.counterparts.getCounterpartsIdVatIds.invalidateQueries(
        {
          parameters: { path: { counterpart_id: vatId.counterpart_id } },
        },
        queryClient
      );
      toast.success(t(i18n)`Vat “${vatId.value}” has been created.`);
    },

    onError: () => {
      toast.error(t(i18n)`Failed to create VAT.`);
    },
  });
};

export const useCounterpartVatById = (
  counterpartId: string,
  vatId?: string
) => {
  const { api } = useMoniteContext();

  return api.counterparts.getCounterpartsIdVatIdsId.useQuery(
    {
      path: {
        counterpart_id: counterpartId,
        vat_id: vatId ?? '',
      },
    },
    {
      enabled: !!counterpartId && !!vatId,
    }
  );
};

export const useUpdateCounterpartVat = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.counterparts.patchCounterpartsIdVatIdsId.useMutation(undefined, {
    onSuccess: async (updatedVatId) => {
      api.counterparts.getCounterpartsIdVatIdsId.setQueryData(
        {
          path: {
            counterpart_id: updatedVatId.counterpart_id,
            vat_id: updatedVatId.id,
          },
        },
        (prevVatId) => ({
          ...prevVatId,
          ...updatedVatId,
        }),
        queryClient
      );

      await api.counterparts.getCounterpartsIdVatIds.invalidateQueries(
        {
          parameters: { path: { counterpart_id: updatedVatId.counterpart_id } },
        },
        queryClient
      );

      toast.success(t(i18n)`Vat “${updatedVatId.value}” has been updated.`);
    },

    onError: () => {
      toast.error(t(i18n)`Failed to update VAT.`);
    },
  });
};

export const useDeleteCounterpartVat = (counterpartId: string) => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  return api.counterparts.deleteCounterpartsIdVatIdsId.useMutation(undefined, {
    onSuccess: async () => {
      await api.counterparts.getCounterpartsIdVatIds.invalidateQueries(
        {
          parameters: { path: { counterpart_id: counterpartId } },
        },
        queryClient
      );

      toast.success(t(i18n)`VAT has been deleted.`);
    },

    onError: () => {
      toast.error(t(i18n)`Failed to delete VAT.`);
    },
  });
};

export const useCounterpartContactList = (
  counterpartId: string | undefined
) => {
  const { api } = useMoniteContext();

  const { data: counterpart } = api.counterparts.getCounterpartsId.useQuery(
    { path: { counterpart_id: counterpartId ?? '' } },
    {
      enabled: !!counterpartId,
    }
  );

  return api.counterparts.getCounterpartsIdContacts.useQuery(
    {
      path: { counterpart_id: counterpartId ?? '' },
    },
    {
      enabled: Boolean(counterpartId && counterpart?.type === 'organization'),
    }
  );
};

export const useCreateCounterpartContact = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.counterparts.postCounterpartsIdContacts.useMutation(undefined, {
    onSuccess: async (contact) => {
      await api.counterparts.getCounterpartsIdContacts.invalidateQueries(
        {
          parameters: {
            path: { counterpart_id: contact.counterpart_id },
          },
        },
        queryClient
      );
      toast.success(
        t(i18n)`Contact Person “${getIndividualName(
          contact.first_name,
          contact.last_name
        )}” has been created.`
      );
    },

    onError: () => {
      toast.error(t(i18n)`Failed to create Contact Person.`);
    },
  });
};

export const useCounterpartContactById = (
  counterpartId: string,
  contactId?: string
) => {
  const { api } = useMoniteContext();

  return api.counterparts.getCounterpartsIdContactsId.useQuery(
    {
      path: {
        counterpart_id: counterpartId,
        contact_id: contactId ?? '',
      },
    },
    {
      enabled: !!counterpartId && !!contactId,
    }
  );
};

export const useUpdateCounterpartContact = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.counterparts.patchCounterpartsIdContactsId.useMutation(undefined, {
    onSuccess: async (contact) => {
      api.counterparts.getCounterpartsIdContactsId.setQueryData(
        {
          path: {
            counterpart_id: contact.counterpart_id,
            contact_id: contact.id,
          },
        },
        (prevContact) => ({
          ...prevContact,
          ...contact,
        }),
        queryClient
      );

      await api.counterparts.getCounterpartsIdContacts.invalidateQueries(
        {
          parameters: {
            path: { counterpart_id: contact.counterpart_id },
          },
        },
        queryClient
      );
      toast.success(
        t(i18n)`Contact Person “${getIndividualName(
          contact.first_name,
          contact.last_name
        )}” has been updated.`
      );
    },

    onError: () => {
      toast.error(t(i18n)`Failed to update Contact Person.`);
    },
  });
};

export const useDeleteCounterpartContact = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.counterparts.deleteCounterpartsIdContactsId.useMutation(
    undefined,
    {
      onSuccess: async (_, { path }) => {
        await Promise.all([
          api.counterparts.getCounterparts.invalidateQueries(queryClient),
          api.counterparts.getCounterpartsIdContacts.invalidateQueries(
            {
              parameters: {
                path: { counterpart_id: path.counterpart_id },
              },
            },
            queryClient
          ),
        ]);
        toast.success(t(i18n)`Contact Person has been deleted.`);
      },

      onError: (error) => toast.error(getAPIErrorMessage(i18n, error)),
    }
  );
};

export const useCounterpartList = (
  parameters?: Services['counterparts']['getCounterparts']['types']['parameters']
) => {
  const { api } = useMoniteContext();
  return api.counterparts.getCounterparts.useQuery(parameters ?? {});
};

export const useCreateCounterpart = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.counterparts.postCounterparts.useMutation(
    {},
    {
      onSuccess: async (counterpart) => {
        await api.counterparts.getCounterparts.invalidateQueries(queryClient);
        toast.success(
          t(i18n)`Counterpart “${getCounterpartName(
            counterpart
          )}” has been created.`
        );
      },

      onError: () => {
        toast.error(t(i18n)`Failed to create Counterpart.`);
      },
    }
  );
};

export const useCounterpartById = (id?: string) => {
  const { api } = useMoniteContext();

  return api.counterparts.getCounterpartsId.useQuery(
    {
      path: {
        counterpart_id: id ?? '',
      },
    },
    {
      enabled: !!id,
    }
  );
};

export const useUpdateCounterpart = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.counterparts.patchCounterpartsId.useMutation(undefined, {
    onSuccess: async (counterpart) => {
      api.counterparts.getCounterpartsId.setQueryData(
        {
          path: { counterpart_id: counterpart.id },
        },
        (prevCounterpart) => ({
          ...prevCounterpart,
          ...counterpart,
        }),
        queryClient
      );

      await api.counterparts.getCounterparts.invalidateQueries(queryClient);

      toast.success(
        t(i18n)`Counterpart “${getCounterpartName(
          counterpart
        )}” has been updated.`
      );
    },

    onError: () => {
      toast.error(t(i18n)`Failed to update Counterpart.`);
    },
  });
};

export const useDeleteCounterpart = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.counterparts.deleteCounterpartsId.useMutation(undefined, {
    onSuccess: async () => {
      await api.counterparts.getCounterparts.invalidateQueries(queryClient);

      toast.success(t(i18n)`Counterpart has been deleted.`);
    },
    onError: () => {
      toast.error(t(i18n)`Failed to delete Counterpart.`);
    },
  });
};
