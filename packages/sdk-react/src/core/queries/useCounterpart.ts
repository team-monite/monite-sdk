import { toast } from 'react-hot-toast';

import {
  getCounterpartName,
  getIndividualName,
} from '@/components/counterparts/helpers';
import { getMessageInError } from '@/core/utils/getMessageInError';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ApiError,
  CounterpartAddressResponseWithCounterpartID,
  CounterpartBankAccountResponse,
  CreateCounterpartBankAccount,
  UpdateCounterpartBankAccount,
  CounterpartContactResponse,
  CounterpartCreatePayload,
  CounterpartPaginationResponse,
  CounterpartResponse,
  CounterpartsService,
  CounterpartUpdateAddress,
  CounterpartUpdatePayload,
  CounterpartVatID,
  CounterpartVatIDResponse,
  CreateCounterpartContactPayload,
  UpdateCounterpartContactPayload,
} from '@monite/sdk-api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';
import { useEntityCache, useEntityListCache } from './hooks';

type CounterpartUpdate = {
  id: string;
  payload: CounterpartUpdatePayload;
};

type CounterpartContactUpdate = {
  contactId: string;
  payload: UpdateCounterpartContactPayload;
};

type CounterpartBankUpdate = {
  bankId: string;
  payload: UpdateCounterpartBankAccount;
};

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

const useCounterpartDetailCache = () =>
  useEntityCache<CounterpartResponse>(counterpartQueryKeys.detail);

const useCounterpartAddressListCache = (id: string) =>
  useEntityListCache<CounterpartAddressResponseWithCounterpartID>(() => [
    ...counterpartQueryKeys.addressList(id),
  ]);

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
  const { monite } = useMoniteContext();

  return useQuery<CounterpartAddressResponseWithCounterpartID[], Error>(
    counterpartQueryKeys.addressList(counterpartId),
    () =>
      !!counterpartId
        ? monite.api.counterpartsAddresses
            .getCounterpartAddresses(counterpartId)
            .then((response) => response.data)
        : [],
    {
      enabled: !!counterpartId,
    }
  );
};

export const useCounterpartAddressById = (
  counterpartId?: string,
  addressId?: string
) => {
  const { monite } = useMoniteContext();

  return useQuery<
    CounterpartAddressResponseWithCounterpartID | undefined,
    Error
  >(
    counterpartQueryKeys.addressDetail(counterpartId!, addressId!),
    () => {
      if (!counterpartId || !addressId) {
        throw new Error(
          'MoniteReactSDK: counterpartId and addressId required.'
        );
      }

      return monite.api.counterpartsAddresses.getCounterpartAddressesById(
        addressId,
        counterpartId
      );
    },
    {
      enabled: Boolean(counterpartId) && Boolean(addressId),
    }
  );
};

export const useUpdateCounterpartAddress = (
  addressId: string,
  counterpartId: string
) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { update } = useCounterpartAddressListCache(counterpartId);

  return useMutation<
    CounterpartAddressResponseWithCounterpartID,
    ApiError,
    CounterpartUpdateAddress
  >(
    (payload) =>
      monite.api.counterpartsAddresses.updateCounterpartsAddress(
        addressId,
        counterpartId,
        payload
      ),
    {
      onSuccess: (address) => {
        update(address);

        toast.success(t(i18n)`Successful update.`);
      },
      onError: () => {
        toast.error(t(i18n)`Failed to update.`);
      },
    }
  );
};

export const useCounterpartBankList = (counterpartId?: string) => {
  const { monite } = useMoniteContext();

  return useQuery<CounterpartBankAccountResponse[], Error>(
    counterpartQueryKeys.bankList(counterpartId),
    () =>
      !!counterpartId
        ? monite.api.counterparts
            .getBankAccounts(counterpartId)
            .then((response) => response.data)
        : [],
    {
      enabled: !!counterpartId,
    }
  );
};

export const useCreateCounterpartBank = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { add } = useCounterpartBankListCache(counterpartId);

  return useMutation<
    CounterpartBankAccountResponse,
    Error,
    CreateCounterpartBankAccount
  >((bank) => monite.api.counterparts.createBankAccount(counterpartId, bank), {
    onSuccess: (bank) => {
      add(bank);

      toast.success(t(i18n)`Bank Account “${bank.name}” was created.`);
    },
    onError: () => {
      toast.error(t(i18n)`Failed to create Bank Account.`);
    },
  });
};

export const useCounterpartBankById = (
  counterpartId: string,
  bankId?: string
) => {
  const { monite } = useMoniteContext();
  const { findById } = useCounterpartBankListCache(counterpartId);

  return useQuery<CounterpartBankAccountResponse | undefined, Error>(
    counterpartQueryKeys.bankDetail(counterpartId, bankId),
    () => {
      if (!bankId) return undefined;

      const existedBank = findById(bankId);

      if (existedBank) return existedBank;

      return monite.api.counterparts.getBankAccountById(counterpartId, bankId);
    },
    {
      enabled: !!bankId,
    }
  );
};

export const useUpdateCounterpartBank = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { update } = useCounterpartBankListCache(counterpartId);

  return useMutation<
    CounterpartBankAccountResponse,
    Error,
    CounterpartBankUpdate
  >(
    ({ bankId, payload }) =>
      monite.api.counterparts.updateBankAccount(counterpartId, bankId, payload),
    {
      onSuccess: (bank) => {
        update(bank);

        toast.success(t(i18n)`Bank Account “${bank.name}” was updated.`);
      },
      onError: () => {
        toast.error(t(i18n)`Failed to update Bank Account.`);
      },
    }
  );
};

export const useDeleteCounterpartBank = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { remove } = useCounterpartBankListCache(counterpartId);

  return useMutation<void, Error, string>(
    (bankId) =>
      monite.api.counterparts.deleteBankAccount(counterpartId, bankId),
    {
      onSuccess: (_, bankId) => {
        remove(bankId);

        toast.success(t(i18n)`Bank Account was deleted.`);
      },
      onError: () => {
        toast.error(t(i18n)`Failed to delete Bank Account.`);
      },
    }
  );
};

export const useCounterpartVatList = (counterpartId?: string) => {
  const { monite } = useMoniteContext();

  return useQuery<CounterpartVatIDResponse[], Error>(
    counterpartQueryKeys.vatList(counterpartId),
    () =>
      !!counterpartId
        ? monite.api.counterparts
            .getVats(counterpartId)
            .then((response) => response.data)
        : [],
    {
      enabled: !!counterpartId,
    }
  );
};

export const useCreateCounterpartVat = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { add } = useCounterpartVatListCache(counterpartId);

  return useMutation<CounterpartVatIDResponse, Error, CounterpartVatID>(
    (vat) => monite.api.counterparts.createVat(counterpartId, vat),
    {
      onSuccess: (vat) => {
        add(vat);

        toast.success(t(i18n)`Vat “${vat.value}” was created.`);
      },
      onError: () => {
        toast.error(t(i18n)`Failed to create VAT.`);
      },
    }
  );
};

export const useCounterpartVatById = (
  counterpartId: string,
  vatId?: string
) => {
  const { monite } = useMoniteContext();
  const { findById } = useCounterpartVatListCache(counterpartId);

  return useQuery<CounterpartVatIDResponse | undefined, Error>(
    counterpartQueryKeys.vatDetail(counterpartId, vatId),
    () => {
      if (!vatId) return undefined;

      const existedVat = findById(vatId);

      if (existedVat) return existedVat;

      return monite.api.counterparts.getVatById(counterpartId, vatId);
    },
    {
      enabled: !!vatId,
    }
  );
};

export const useUpdateCounterpartVat = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { update } = useCounterpartVatListCache(counterpartId);

  return useMutation<CounterpartVatIDResponse, Error, CounterpartVatUpdate>(
    ({ vatId, payload }) =>
      monite.api.counterparts.updateVat(counterpartId, vatId, payload),
    {
      onSuccess: (vat) => {
        update(vat);

        toast.success(t(i18n)`Vat “${vat.value}” was updated.`);
      },
      onError: () => {
        toast.error(t(i18n)`Failed to update VAT.`);
      },
    }
  );
};

export const useDeleteCounterpartVat = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { remove } = useCounterpartVatListCache(counterpartId);

  return useMutation<void, Error, string>(
    (vatId) => monite.api.counterparts.deleteVat(counterpartId, vatId),
    {
      onSuccess: (_, vatId) => {
        remove(vatId);

        toast.success(t(i18n)`VAT was deleted.`);
      },
      onError: () => {
        toast.error(t(i18n)`Failed to delete VAT.`);
      },
    }
  );
};

export const useCounterpartContactList = (
  counterpartId?: string,
  isOrganization?: boolean
) => {
  const { monite } = useMoniteContext();

  return useQuery<Array<CounterpartContactResponse> | undefined, ApiError>(
    counterpartQueryKeys.contactList(counterpartId),
    () =>
      counterpartId
        ? monite.api.counterparts
            .getContacts(counterpartId)
            .then((res) => res.data)
        : undefined,
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
  >(
    (contact) => monite.api.counterparts.createContact(counterpartId, contact),
    {
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
    }
  );
};

export const useCounterpartContactById = (
  counterpartId: string,
  contactId?: string
) => {
  const { monite } = useMoniteContext();
  const { findById } = useCounterpartContactListCache(counterpartId);

  return useQuery<CounterpartContactResponse | undefined, Error>(
    counterpartQueryKeys.contactDetail(counterpartId, contactId!),
    () => {
      if (!contactId) return undefined;

      const existedContact = findById(contactId);

      if (existedContact) return existedContact;

      return monite.api.counterparts.getContactById(counterpartId, contactId);
    },
    {
      enabled: Boolean(contactId) && Boolean(counterpartId),
    }
  );
};

export const useUpdateCounterpartContact = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useCounterpartListCache();
  const { update } = useCounterpartContactListCache(counterpartId);

  return useMutation<
    CounterpartContactResponse,
    Error,
    CounterpartContactUpdate
  >(
    ({ contactId, payload }) =>
      monite.api.counterparts.updateContact(counterpartId, contactId, payload),
    {
      onSuccess: (contact) => {
        update(contact);
        invalidate();

        toast.success(
          t(i18n)`Contact Person “${getIndividualName(
            contact.first_name,
            contact.last_name
          )}” was updated.`
        );
      },
      onError: () => {
        toast.error(t(i18n)`Failed to update Contact Person.`);
      },
    }
  );
};

export const useDeleteCounterpartContact = (counterpartId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useCounterpartListCache();
  const { remove } = useCounterpartContactListCache(counterpartId);

  return useMutation<void, Error, string>(
    (contactId) =>
      monite.api.counterparts.deleteContact(counterpartId, contactId),
    {
      onSuccess: (_, contactId) => {
        remove(contactId);
        invalidate();

        toast.success(t(i18n)`Contact Person was deleted.`);
      },
      onError: (error) => {
        toast.error(
          getMessageInError(error) || t(i18n)`Failed to delete Contact Person.`
        );
      },
    }
  );
};

export const useCounterpartList = (
  ...args: Parameters<CounterpartsService['getList']>
) => {
  const { monite } = useMoniteContext();

  return useQuery<CounterpartPaginationResponse, Error>(
    [...counterpartQueryKeys.list(), ...args] as const,
    () => monite.api.counterparts.getList(...args)
  );
};

export const useCreateCounterpart = () => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useCounterpartListCache();
  const { setEntity } = useCounterpartDetailCache();

  return useMutation<CounterpartResponse, Error, CounterpartCreatePayload>(
    (payload) => monite.api.counterparts.create(payload),
    {
      onSuccess: (counterpart) => {
        setEntity(counterpart);
        invalidate();

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
  const { monite } = useMoniteContext();

  return useQuery<CounterpartResponse | undefined, Error>(
    counterpartQueryKeys.detail(id),
    () => (id ? monite.api.counterparts.getById(id) : undefined),
    {
      enabled: !!id,
    }
  );
};

export const useUpdateCounterpart = () => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useCounterpartListCache();
  const { setEntity } = useCounterpartDetailCache();

  return useMutation<CounterpartResponse, Error, CounterpartUpdate>(
    ({ id, payload }) => monite.api.counterparts.update(id, payload),
    {
      onSuccess: (counterpart) => {
        setEntity(counterpart);
        invalidate();

        toast.success(
          t(i18n)`Counterpart “${getCounterpartName(counterpart)}” was updated.`
        );
      },
      onError: () => {
        toast.error(t(i18n)`Failed to update Counterpart.`);
      },
    }
  );
};

export const useDeleteCounterpart = () => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useCounterpartListCache();
  const { removeEntity } = useCounterpartDetailCache();

  return useMutation<void, Error, CounterpartResponse, CounterpartResponse>(
    (counterpart) => monite.api.counterparts.delete(counterpart.id),
    {
      onSuccess: (_, counterpart) => {
        toast.success(t(i18n)`Counterpart was deleted.`);

        removeEntity(counterpart.id);
        invalidate();
      },
      onError: () => {
        toast.error(t(i18n)`Failed to delete Counterpart.`);
      },
    }
  );
};
