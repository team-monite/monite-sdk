import { useMutation, useQuery } from 'react-query';
import {
  CounterpartBankAccount,
  CounterpartBankAccountResponse,
  CounterpartContactResponse,
  CounterpartCreatePayload,
  CounterpartPaginationResponse,
  CounterpartResponse,
  CounterpartsService,
  CounterpartUpdatePayload,
  CreateCounterpartContactPayload,
  UpdateCounterpartContactPayload,
} from '@team-monite/sdk-api';
import { toast } from 'react-hot-toast';
import {
  getCounterpartName,
  getIndividualName,
} from 'components/counterparts/helpers';
import { useComponentsContext } from '../context/ComponentsContext';
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
  payload: CounterpartBankAccount;
};

const COUNTERPARTS_QUERY = 'counterparts';
const COUNTERPARTS_CONTACTS_QUERY = 'counterpartContacts';
const COUNTERPARTS_BANKS_QUERY = 'counterpartBanks';

export const counterpartQueryKeys = {
  all: () => [COUNTERPARTS_QUERY],
  list: () => [...counterpartQueryKeys.all(), 'list'],
  detail: (id?: string) => [...counterpartQueryKeys.all(), 'detail', id],
  contactList: () => [
    ...counterpartQueryKeys.all(),
    COUNTERPARTS_CONTACTS_QUERY,
    'list',
  ],
  contactDetail: (id?: string) => [
    ...counterpartQueryKeys.all(),
    COUNTERPARTS_CONTACTS_QUERY,
    'detail',
    id,
  ],
  bankList: () => [
    ...counterpartQueryKeys.all(),
    COUNTERPARTS_BANKS_QUERY,
    'list',
  ],
  bankDetail: (id?: string) => [
    ...counterpartQueryKeys.all(),
    COUNTERPARTS_BANKS_QUERY,
    'detail',
    id,
  ],
};

export const useCounterpartBankList = (counterpartId?: string) => {
  const { monite, t } = useComponentsContext();

  return useQuery<CounterpartBankAccountResponse[], Error>(
    counterpartQueryKeys.bankList(),
    () =>
      !!counterpartId
        ? monite.api.counterparts
            .getBankAccounts(counterpartId)
            .then((response) => response.data)
        : [],
    {
      onError: () => {
        toast.error(
          t('counterparts:notifications.getError', {
            type: t('counterparts:titles.bankAccounts'),
          })
        );
      },
      enabled: !!counterpartId,
    }
  );
};

export const useCreateCounterpartBank = (counterpartId: string) => {
  const { monite, t } = useComponentsContext();

  const { add } = useEntityListCache<CounterpartBankAccountResponse>(
    counterpartQueryKeys.bankList
  );

  return useMutation<
    CounterpartBankAccountResponse,
    Error,
    CounterpartBankAccount
  >((bank) => monite.api.counterparts.createBankAccount(counterpartId, bank), {
    onSuccess: async (bank) => {
      add(bank);

      toast.success(
        t('counterparts:notifications.createSuccess', {
          type: t('counterparts:titles.bank'),
          name: bank.name,
        })
      );
    },
    onError: () => {
      toast.error(
        t('counterparts:notifications.createError', {
          type: t('counterparts:titles.bank'),
        })
      );
    },
  });
};

export const useCounterpartBankById = (
  counterpartId: string,
  bankId?: string
) => {
  const { monite, t } = useComponentsContext();

  const { findById } = useEntityListCache<CounterpartBankAccountResponse>(
    counterpartQueryKeys.bankList
  );

  return useQuery<CounterpartBankAccountResponse | undefined, Error>(
    counterpartQueryKeys.bankDetail(bankId),
    () => {
      if (!bankId) return undefined;

      const existedBank = findById(bankId);

      if (existedBank) return existedBank;

      return monite.api.counterparts.getBankAccountById(counterpartId, bankId);
    },
    {
      enabled: !!bankId,
      onError: () => {
        toast.error(
          t('counterparts:notifications.getError', {
            type: t('counterparts:titles.bank'),
          })
        );
      },
    }
  );
};

export const useUpdateCounterpartBank = (counterpartId: string) => {
  const { monite, t } = useComponentsContext();

  const { update } = useEntityListCache<CounterpartBankAccountResponse>(
    counterpartQueryKeys.bankList
  );

  return useMutation<
    CounterpartBankAccountResponse,
    Error,
    CounterpartBankUpdate
  >(
    ({ bankId, payload }) =>
      monite.api.counterparts.updateBankAccount(counterpartId, bankId, payload),
    {
      onSuccess: async (bank) => {
        update(bank);
        toast.success(
          t('counterparts:notifications.updateSuccess', {
            type: t('counterparts:titles.bank'),
            name: bank.name,
          })
        );
      },
      onError: () => {
        toast.error(
          t('counterparts:notifications.updateError', {
            type: t('counterparts:titles.bank'),
          })
        );
      },
    }
  );
};

export const useDeleteCounterpartBank = (counterpartId: string) => {
  const { monite, t } = useComponentsContext();

  const { remove } = useEntityListCache<CounterpartBankAccountResponse>(
    counterpartQueryKeys.bankList
  );

  return useMutation<void, Error, string>(
    (bankId) =>
      monite.api.counterparts.deleteBankAccount(counterpartId, bankId),
    {
      onSuccess: (_, bankId) => {
        remove(bankId);
        toast.success(
          t('counterparts:notifications.deleteSuccess', {
            type: t('counterparts:titles.bank'),
          })
        );
      },
      onError: () => {
        toast.error(
          t('counterparts:notifications.deleteError', {
            type: t('counterparts:titles.bank'),
          })
        );
      },
    }
  );
};

export const useCounterpartContactList = (counterpartId?: string) => {
  const { monite, t } = useComponentsContext();

  return useQuery<CounterpartContactResponse[], Error>(
    counterpartQueryKeys.contactList(),
    () =>
      counterpartId ? monite.api.counterparts.getContacts(counterpartId) : [],
    {
      onError: () => {
        toast.error(
          t('counterparts:notifications.getError', {
            type: t('counterparts:titles.contactPersons'),
          })
        );
      },
      enabled: !!counterpartId,
    }
  );
};

export const useCreateCounterpartContact = (counterpartId: string) => {
  const { monite, t } = useComponentsContext();

  const { add } = useEntityListCache<CounterpartContactResponse>(
    counterpartQueryKeys.contactList
  );

  const { invalidate } = useInvalidateCounterpart(counterpartQueryKeys.list);

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
          t('counterparts:notifications.createSuccess', {
            type: t('counterparts:titles.contact'),
            name: getIndividualName(contact.first_name, contact.last_name),
          })
        );
      },
      onError: () => {
        toast.error(
          t('counterparts:notifications.createError', {
            type: t('counterparts:titles.contact'),
          })
        );
      },
    }
  );
};

export const useCounterpartContactById = (
  counterpartId: string,
  contactId?: string
) => {
  const { monite, t } = useComponentsContext();

  const { findById } = useEntityListCache<CounterpartContactResponse>(
    counterpartQueryKeys.contactList
  );

  return useQuery<CounterpartContactResponse | undefined, Error>(
    counterpartQueryKeys.contactDetail(contactId),
    () => {
      if (!contactId) return undefined;

      const existedContact = findById(contactId);

      if (existedContact) return existedContact;

      return monite.api.counterparts.getContactById(counterpartId, contactId);
    },
    {
      enabled: !!contactId,
      onError: () => {
        toast.error(
          t('counterparts:notifications.getError', {
            type: t('counterparts:titles.contact'),
          })
        );
      },
    }
  );
};

export const useUpdateCounterpartContact = (counterpartId: string) => {
  const { monite, t } = useComponentsContext();

  const { update } = useEntityListCache<CounterpartContactResponse>(
    counterpartQueryKeys.contactList
  );

  const { invalidate } = useInvalidateCounterpart(counterpartQueryKeys.list);

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
          t('counterparts:notifications.updateSuccess', {
            type: t('counterparts:titles.contact'),
            name: getIndividualName(contact.first_name, contact.last_name),
          })
        );
      },
      onError: () => {
        toast.error(
          t('counterparts:notifications.updateError', {
            type: t('counterparts:titles.contact'),
          })
        );
      },
    }
  );
};

export const useDeleteCounterpartContact = (counterpartId: string) => {
  const { monite, t } = useComponentsContext();

  const { remove } = useEntityListCache<CounterpartContactResponse>(
    counterpartQueryKeys.contactList
  );

  const { invalidate } = useInvalidateCounterpart(counterpartQueryKeys.list);

  return useMutation<void, Error, string>(
    (contactId) =>
      monite.api.counterparts.deleteContact(counterpartId, contactId),
    {
      onSuccess: (_, contactId) => {
        remove(contactId);
        invalidate();
        toast.success(
          t('counterparts:notifications.deleteSuccess', {
            type: t('counterparts:titles.contact'),
          })
        );
      },
      onError: () => {
        toast.error(
          t('counterparts:notifications.deleteError', {
            type: t('counterparts:titles.contact'),
          })
        );
      },
    }
  );
};

export const useCounterpartList = (
  ...args: Parameters<CounterpartsService['getList']>
) => {
  const { monite, t } = useComponentsContext();

  return useQuery<CounterpartPaginationResponse, Error>(
    counterpartQueryKeys.list(),
    () => monite.api.counterparts.getList(...args),
    {
      onError: () => {
        toast.error(
          t('counterparts:notifications.getError', {
            type: t('counterparts:titles.counterparts'),
          })
        );
      },
    }
  );
};

export const useCreateCounterpart = () => {
  const { monite, t } = useComponentsContext();

  const { invalidate } = useInvalidateCounterpart(counterpartQueryKeys.list);

  const { setEntity } = useEntityCache<CounterpartResponse>(
    counterpartQueryKeys.detail
  );

  return useMutation<CounterpartResponse, Error, CounterpartCreatePayload>(
    (payload) => monite.api.counterparts.create(payload),
    {
      onSuccess: (counterpart) => {
        setEntity(counterpart);
        invalidate();
        toast.success(
          t('counterparts:notifications.createSuccess', {
            type: t('counterparts:titles.counterpart'),
            name: getCounterpartName(counterpart),
          })
        );
      },
      onError: () => {
        toast.error(
          t('counterparts:notifications.createError', {
            type: t('counterparts:titles.counterpart'),
          })
        );
      },
    }
  );
};

export const useCounterpartById = (id?: string) => {
  const { monite, t } = useComponentsContext();

  return useQuery<CounterpartResponse | undefined, Error>(
    counterpartQueryKeys.detail(id),
    () => (id ? monite.api.counterparts.getById(id) : undefined),
    {
      enabled: !!id,
      onError: () => {
        toast.error(
          t('counterparts:notifications.getError', {
            type: t('counterparts:titles.counterpart'),
          })
        );
      },
    }
  );
};

export const useUpdateCounterpart = () => {
  const { monite, t } = useComponentsContext();

  const { invalidate } = useInvalidateCounterpart(counterpartQueryKeys.list);

  const { setEntity } = useEntityCache<CounterpartResponse>(
    counterpartQueryKeys.detail
  );

  return useMutation<CounterpartResponse, Error, CounterpartUpdate>(
    ({ id, payload }) => monite.api.counterparts.update(id, payload),
    {
      onSuccess: (counterpart) => {
        setEntity(counterpart);
        invalidate();
        toast.success(
          t('counterparts:notifications.updateSuccess', {
            type: t('counterparts:titles.counterpart'),
            name: getCounterpartName(counterpart),
          })
        );
      },
      onError: () => {
        toast.error(
          t('counterparts:notifications.updateError', {
            type: t('counterparts:titles.counterpart'),
          })
        );
      },
    }
  );
};

export const useDeleteCounterpart = () => {
  const { monite, t } = useComponentsContext();

  const { invalidate } = useInvalidateCounterpart(counterpartQueryKeys.list);

  const { removeEntity } = useEntityCache<CounterpartResponse>(
    counterpartQueryKeys.detail
  );

  return useMutation<void, Error, CounterpartResponse, CounterpartResponse>(
    (counterpart) => monite.api.counterparts.delete(counterpart.id),
    {
      onSuccess: (_, counterpart) => {
        toast.success(
          t('counterparts:notifications.deleteSuccess', {
            type: t('counterparts:titles.counterpart'),
            name: getCounterpartName(counterpart),
          })
        );

        removeEntity(counterpart.id);
        invalidate();
      },
      onError: (_, counterpart) => {
        toast.error(
          t('counterparts:notifications.deleteError', {
            type: t('counterparts:titles.counterpart'),
            name: getCounterpartName(counterpart),
          })
        );
      },
    }
  );
};

export const useInvalidateCounterpart = (key = counterpartQueryKeys.all) =>
  useEntityListCache<CounterpartResponse>(key);
