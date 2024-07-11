import { toast } from 'react-hot-toast';

import { components, Services } from '@/api';
import {
  getCounterpartName,
  getIndividualName,
} from '@/components/counterparts/helpers';
import { getLegacyAPIErrorMessage } from '@/core/utils/getLegacyAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CounterpartBankAccountResponse,
  CounterpartContactResponse,
  CounterpartResponse,
  CounterpartVatID,
  CounterpartVatIDResponse,
  CreateCounterpartContactPayload,
} from '@monite/sdk-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';
import { useEntityListCache } from './hooks';

export type QCounterpartResponse =
  | components['schemas']['CounterpartIndividualRootResponse']
  | components['schemas']['CounterpartOrganizationRootResponse'];

export type QCounterpartCreatePayload =
  | components['schemas']['CounterpartIndividualRootCreatePayload']
  | components['schemas']['CounterpartOrganizationRootCreatePayload'];

export type QCounterpartUpdatePayload =
  | components['schemas']['CounterpartIndividualRootUpdatePayload']
  | components['schemas']['CounterpartOrganizationRootUpdatePayload'];

type CounterpartVatUpdate = {
  vatId: string;
  payload: CounterpartVatID;
};

const COUNTERPARTS_QUERY = 'counterparts';
const COUNTERPARTS_CONTACTS_QUERY = 'counterpartContacts';
const COUNTERPARTS_ADDRESS_QUERY = 'counterpartAddress';
const COUNTERPARTS_BANKS_QUERY = 'counterpartBanks';
const COUNTERPARTS_VATS_QUERY = 'counterpartVats';

export const counterpartQueryKeys = {
  all: () => [COUNTERPARTS_QUERY],
  list: () => [...counterpartQueryKeys.all(), 'list'],
  detail: (counterpartId?: string) =>
    counterpartId
      ? [...counterpartQueryKeys.all(), 'detail', counterpartId]
      : [...counterpartQueryKeys.all(), 'detail'],

  addressList: (id?: string) =>
    id
      ? [
          ...counterpartQueryKeys.detail(id),
          COUNTERPARTS_ADDRESS_QUERY,
          'list',
          id,
        ]
      : [...counterpartQueryKeys.detail(), COUNTERPARTS_ADDRESS_QUERY, 'list'],
  addressDetail: (counterpartId: string, addressId: string) => [
    ...counterpartQueryKeys.detail(counterpartId),
    COUNTERPARTS_ADDRESS_QUERY,
    'details',
    addressId,
  ],

  contactList: (counterpartId?: string) => [
    ...counterpartQueryKeys.detail(counterpartId),
    COUNTERPARTS_CONTACTS_QUERY,
    'list',
  ],
  contactDetail: (counterpartId: string, contactId: string) => [
    ...counterpartQueryKeys.detail(counterpartId),
    COUNTERPARTS_CONTACTS_QUERY,
    'detail',
    contactId,
  ],

  bankList: (counterpartId?: string) =>
    counterpartId
      ? [
          ...counterpartQueryKeys.list(),
          COUNTERPARTS_BANKS_QUERY,
          'list',
          counterpartId,
        ]
      : [...counterpartQueryKeys.list(), COUNTERPARTS_BANKS_QUERY, 'list'],
  bankDetail: (counterpartId?: string, bankId?: string) => [
    ...counterpartQueryKeys.detail(counterpartId),
    COUNTERPARTS_BANKS_QUERY,
    'detail',
    bankId,
  ],

  vatList: (counterpartId?: string) =>
    counterpartId
      ? [
          ...counterpartQueryKeys.detail(counterpartId),
          COUNTERPARTS_VATS_QUERY,
          'list',
          counterpartId,
        ]
      : [...counterpartQueryKeys.detail(), COUNTERPARTS_VATS_QUERY, 'list'],
  vatDetail: (counterpartId?: string, vatId?: string) => [
    ...counterpartQueryKeys.detail(counterpartId),
    COUNTERPARTS_VATS_QUERY,
    'detail',
    vatId,
  ],
};

export const useCounterpartCache = () =>
  useEntityListCache(counterpartQueryKeys.all);

const useCounterpartListCache = () =>
  useEntityListCache<CounterpartResponse>(counterpartQueryKeys.list);

const useCounterpartBankListCache = (id: string) =>
  useEntityListCache<CounterpartBankAccountResponse>(() => [
    ...counterpartQueryKeys.bankList(id),
  ]);

const useCounterpartContactListCache = (counterpartId: string) =>
  useEntityListCache<CounterpartContactResponse>(() => [
    ...counterpartQueryKeys.contactList(counterpartId),
  ]);

const useCounterpartVatListCache = (counterpartId: string) =>
  useEntityListCache<CounterpartVatIDResponse>(() => [
    ...counterpartQueryKeys.vatList(counterpartId),
  ]);

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

export const useUpdateCounterpartAddress = () => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  return api.counterparts.patchCounterpartsIdAddressesId.useMutation(
    undefined,
    {
      onSuccess: (counterpart) => {
        toast.success(t(i18n)`Address “${counterpart.line1}” was updated.`);
      },

      onError: () => {
        toast.error(t(i18n)`Failed to update Address.`);
      },
    }
  );
};

export const useCreateCounterpartBank = () => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  return api.counterparts.postCounterpartsIdBankAccounts.useMutation(
    undefined,
    {
      onSuccess: (bank) => {
        toast.success(t(i18n)`Bank Account “${bank.name}” was created.`);
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
  const { api } = useMoniteContext();
  const { i18n } = useLingui();
  const queryClient = useQueryClient();

  return api.counterparts.patchCounterpartsIdBankAccountsId.useMutation(
    undefined,
    {
      onSuccess: (bank) => {
        toast.success(t(i18n)`Bank Account “${bank.name}” was updated.`);

        api.counterparts.getCounterpartsIdBankAccounts.invalidateQueries(
          queryClient
        );
      },

      onError: () => {
        toast.error(t(i18n)`Failed to update Bank Account.`);
      },
    }
  );
};

// export const useDeleteCounterpartBank = (counterpartId: string) => {
//   const { i18n } = useLingui();
//   const { monite } = useMoniteContext();
//   const { remove } = useCounterpartBankListCache(counterpartId);
//
//   return useMutation<void, Error, string>({
//     mutationFn: (bankId) =>
//       monite.api.counterparts.deleteBankAccount(counterpartId, bankId),
//
//     onSuccess: (_, bankId) => {
//       remove(bankId);
//
//       toast.success(t(i18n)`Bank Account was deleted.`);
//     },
//
//     onError: () => {
//       toast.error(t(i18n)`Failed to delete Bank Account.`);
//     },
//   });
// };

export const useDeleteCounterpartBank = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const queryClient = useQueryClient();

  return api.counterparts.deleteCounterpartsIdBankAccountsId.useMutation(
    undefined,
    {
      onSuccess: () => {
        api.counterparts.getCounterpartsIdBankAccounts.invalidateQueries(
          {
            parameters: { path: { counterpart_id: counterpartId } },
          },
          queryClient
        );

        toast.success(t(i18n)`Bank Account was deleted.`);
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

export const useCreateCounterpartVat = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { add } = useCounterpartVatListCache(counterpartId);

  return useMutation<CounterpartVatIDResponse, Error, CounterpartVatID>({
    mutationFn: (vat) => monite.api.counterparts.createVat(counterpartId, vat),

    onSuccess: (vat) => {
      add(vat);

      toast.success(t(i18n)`Vat “${vat.value}” was created.`);
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
  const { monite } = useMoniteContext();
  const { findById } = useCounterpartVatListCache(counterpartId);

  return useQuery<CounterpartVatIDResponse | undefined, Error>({
    queryKey: counterpartQueryKeys.vatDetail(counterpartId, vatId),

    queryFn: () => {
      if (!vatId) return undefined;

      const existedVat = findById(vatId);

      if (existedVat) return existedVat;

      return monite.api.counterparts.getVatById(counterpartId, vatId);
    },

    enabled: !!vatId,
  });
};

export const useUpdateCounterpartVat = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { update } = useCounterpartVatListCache(counterpartId);

  return useMutation<CounterpartVatIDResponse, Error, CounterpartVatUpdate>({
    mutationFn: ({ vatId, payload }) =>
      monite.api.counterparts.updateVat(counterpartId, vatId, payload),

    onSuccess: (vat) => {
      update(vat);

      toast.success(t(i18n)`Vat “${vat.value}” was updated.`);
    },

    onError: () => {
      toast.error(t(i18n)`Failed to update VAT.`);
    },
  });
};

export const useDeleteCounterpartVat = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { remove } = useCounterpartVatListCache(counterpartId);

  return useMutation<void, Error, string>({
    mutationFn: (vatId) =>
      monite.api.counterparts.deleteVat(counterpartId, vatId),

    onSuccess: (_, vatId) => {
      remove(vatId);

      toast.success(t(i18n)`VAT was deleted.`);
    },

    onError: () => {
      toast.error(t(i18n)`Failed to delete VAT.`);
    },
  });
};

export const useCounterpartContactList = (
  counterpartId?: string,
  isOrganization?: boolean
) => {
  const { api } = useMoniteContext();

  return api.counterparts.getCounterpartsIdContacts.useQuery(
    {
      path: { counterpart_id: counterpartId ?? '' },
    },
    {
      enabled: !!counterpartId && isOrganization,
    }
  );
};

export const useCreateCounterpartContact = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useCounterpartListCache();
  const { add } = useCounterpartContactListCache(counterpartId);

  return useMutation<
    CounterpartContactResponse,
    Error,
    CreateCounterpartContactPayload
  >({
    mutationFn: (contact) =>
      monite.api.counterparts.createContact(counterpartId, contact),

    onSuccess: (contact) => {
      add(contact);
      invalidate();
      toast.success(
        t(i18n)`Contact Person “${getIndividualName(
          contact.first_name,
          contact.last_name
        )}” was created.`
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
  const { api } = useMoniteContext();

  return api.counterparts.patchCounterpartsIdContactsId.useMutation(undefined, {
    onSuccess: (counterpart) => {
      toast.success(
        t(i18n)`Contact Person “${getIndividualName(
          counterpart.first_name,
          counterpart.last_name
        )}” was updated.`
      );
    },

    onError: () => {
      toast.error(t(i18n)`Failed to update Contact Person.`);
    },
  });
};

export const useDeleteCounterpartContact = () => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  return api.counterparts.deleteCounterpartsIdContactsId.useMutation(
    undefined,
    {
      onSuccess: () => {
        toast.success(t(i18n)`Contact Person was deleted.`);
      },

      onError: (error) => {
        toast.error(
          getLegacyAPIErrorMessage(error) ||
            t(i18n)`Failed to delete Contact Person.`
        );
      },
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
  const { api } = useMoniteContext();
  const queryClient = useQueryClient();

  return api.counterparts.postCounterparts.useMutation(
    {},
    {
      onSuccess: (counterpart) => {
        api.counterparts.getCounterpartsId.removeQueries(queryClient);
        api.counterparts.getCounterpartsId.invalidateQueries(queryClient);
        toast.success(
          t(i18n)`Counterpart “${getCounterpartName(counterpart)}” was created.`
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
  const { api } = useMoniteContext();
  const queryClient = useQueryClient();

  return api.counterparts.patchCounterpartsId.useMutation(undefined, {
    onSuccess: (counterpart) => {
      api.counterparts.getCounterpartsId.invalidateQueries(
        {
          parameters: { path: { counterpart_id: counterpart.id } },
        },
        queryClient
      );
      toast.success(
        t(i18n)`Counterpart “${getCounterpartName(counterpart)}” was updated.`
      );
    },

    onError: () => {
      toast.error(t(i18n)`Failed to update Counterpart.`);
    },
  });
};

export const useDeleteCounterpart = () => {
  const queryClient = useQueryClient();
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  return api.counterparts.deleteCounterpartsId.useMutation(undefined, {
    onSuccess: () => {
      toast.success(t(i18n)`Counterpart was deleted.`);

      api.counterparts.getCounterpartsId.removeQueries(queryClient);
      api.counterparts.getCounterpartsId.invalidateQueries(queryClient);
    },
    onError: () => {
      toast.error(t(i18n)`Failed to delete Counterpart.`);
    },
  });
};
