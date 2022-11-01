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
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';
import { getCounterpartName } from 'components/counterparts/helpers';
import { useEntityCache, useEntityListCache } from './hooks';

type CounterpartUpdate = {
  id: string;
  counterpart: CounterpartUpdatePayload;
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
  const { monite } = useComponentsContext();

  return useQuery<CounterpartBankAccountResponse[], Error>(
    counterpartQueryKeys.bankList(),
    () =>
      !!counterpartId
        ? monite.api.counterparts
            .getBankAccounts(counterpartId)
            .then((response) => response.data)
        : [],
    {
      onError: (error) => {
        toast.error(error.message);
      },
      enabled: !!counterpartId,
    }
  );
};

export const useCreateCounterpartBank = (counterpartId: string) => {
  const { monite } = useComponentsContext();

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
      toast.success('Bank was created');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useCounterpartBankById = (
  counterpartId: string,
  bankId?: string
) => {
  const { monite } = useComponentsContext();

  const { findById } = useEntityListCache<CounterpartBankAccountResponse>(
    counterpartQueryKeys.bankList
  );

  return useQuery<CounterpartBankAccountResponse | undefined, Error>(
    counterpartQueryKeys.bankDetail(bankId),
    () => {
      if (!bankId) return undefined;

      const existedBank = findById(bankId);

      if (existedBank) {
        return existedBank;
      }

      return monite.api.counterparts.getBankAccountById(counterpartId, bankId);
    },
    {
      enabled: !!bankId,
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useUpdateCounterpartBank = (counterpartId: string) => {
  const { monite } = useComponentsContext();

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
        toast.success('Bank was updated');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useDeleteCounterpartBank = (counterpartId: string) => {
  const { monite } = useComponentsContext();

  const { remove } = useEntityListCache<CounterpartBankAccountResponse>(
    counterpartQueryKeys.bankList
  );

  return useMutation<void, Error, string>(
    (bankId) =>
      monite.api.counterparts.deleteBankAccount(counterpartId, bankId),
    {
      onSuccess: (_, bankId) => {
        remove(bankId);
        toast.success('Bank was deleted');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useCounterpartContactList = (counterpartId?: string) => {
  const { monite } = useComponentsContext();

  return useQuery<CounterpartContactResponse[], Error>(
    counterpartQueryKeys.contactList(),
    () =>
      counterpartId ? monite.api.counterparts.getContacts(counterpartId) : [],
    {
      onError: (error) => {
        toast.error(error.message);
      },
      enabled: !!counterpartId,
    }
  );
};

export const useCreateCounterpartContact = (counterpartId: string) => {
  const { monite } = useComponentsContext();

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
        toast.success('Contact was created');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useCounterpartContactById = (
  counterpartId: string,
  contactId?: string
) => {
  const { monite } = useComponentsContext();

  const { findById } = useEntityListCache<CounterpartContactResponse>(
    counterpartQueryKeys.contactList
  );

  return useQuery<CounterpartContactResponse | undefined, Error>(
    counterpartQueryKeys.contactDetail(contactId),
    () => {
      if (!contactId) return undefined;

      const existedContact = findById(contactId);

      if (existedContact) {
        return existedContact;
      }

      return monite.api.counterparts.getContactById(counterpartId, contactId);
    },
    {
      enabled: !!contactId,
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useUpdateCounterpartContact = (counterpartId: string) => {
  const { monite } = useComponentsContext();

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
        toast.success('Contact was updated');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useDeleteCounterpartContact = (counterpartId: string) => {
  const { monite } = useComponentsContext();

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
        toast.success('Contact was deleted');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useCounterpartList = (
  ...args: Parameters<CounterpartsService['getList']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<CounterpartPaginationResponse, Error>(
    counterpartQueryKeys.list(),
    () => monite.api.counterparts.getList(...args),
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useCreateCounterpart = () => {
  const { monite } = useComponentsContext();

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
        toast.success('Created');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useCounterpartById = (id?: string) => {
  const { monite } = useComponentsContext();

  return useQuery<CounterpartResponse | undefined, Error>(
    counterpartQueryKeys.detail(id),
    () => (id ? monite.api.counterparts.getById(id) : undefined),
    {
      enabled: !!id,
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useUpdateCounterpart = () => {
  const { monite } = useComponentsContext();

  const { invalidate } = useInvalidateCounterpart(counterpartQueryKeys.list);

  const { setEntity } = useEntityCache<CounterpartResponse>(
    counterpartQueryKeys.detail
  );

  return useMutation<CounterpartResponse, Error, CounterpartUpdate>(
    ({ id, counterpart }) => monite.api.counterparts.update(id, counterpart),
    {
      onSuccess: (counterpart) => {
        setEntity(counterpart);
        invalidate();
        toast.success('Updated');
      },
      onError: (error) => {
        toast.error(error.message);
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
        toast(
          t('counterparts:confirmDeleteDialogue.successNotification', {
            type: counterpart.type,
            name: getCounterpartName(counterpart),
          })
        );

        removeEntity(counterpart.id);
        invalidate();
      },
      onError: (_, counterpart) => {
        toast.error(
          t('counterparts:confirmDeleteDialogue.errorNotification', {
            type: counterpart.type,
            name: getCounterpartName(counterpart),
          })
        );
      },
    }
  );
};

export const useInvalidateCounterpart = (key = counterpartQueryKeys.all) =>
  useEntityListCache<CounterpartResponse>(key);
