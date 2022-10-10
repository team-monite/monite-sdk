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
import { getName } from 'components/counterparts/helpers';
import { useEntityCache, useEntityListCache } from './hooks';

const COUNTERPARTS_QUERY = 'counterparts';
const COUNTERPARTS_CONTACTS_QUERY = 'counterpartContacts';
const COUNTERPARTS_BANKS_QUERY = 'counterpartBanks';

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

export const useCounterpartBankList = (counterpartId?: string) => {
  const { monite } = useComponentsContext();

  return useQuery<CounterpartBankAccountResponse[] | undefined, Error>(
    [COUNTERPARTS_BANKS_QUERY],
    () =>
      !!counterpartId
        ? monite.api.counterparts.getBankAccounts(counterpartId)
        : undefined,
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
    COUNTERPARTS_BANKS_QUERY
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
  const { findById, update } =
    useEntityListCache<CounterpartBankAccountResponse>(
      COUNTERPARTS_BANKS_QUERY
    );

  return useQuery<CounterpartBankAccountResponse | undefined, Error>(
    [COUNTERPARTS_BANKS_QUERY, { id: bankId }],
    () => {
      if (!bankId) return undefined;

      const existedBank = findById(bankId);

      if (existedBank) {
        update(existedBank);
        return undefined;
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
    COUNTERPARTS_BANKS_QUERY
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
    COUNTERPARTS_BANKS_QUERY
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

  return useQuery<CounterpartContactResponse[] | undefined, Error>(
    [COUNTERPARTS_CONTACTS_QUERY],
    () =>
      counterpartId
        ? monite.api.counterparts.getContacts(counterpartId)
        : undefined,
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
    COUNTERPARTS_BANKS_QUERY
  );

  return useMutation<
    CounterpartContactResponse,
    Error,
    CreateCounterpartContactPayload
  >(
    (contact) => monite.api.counterparts.createContact(counterpartId, contact),
    {
      onSuccess: async (contact) => {
        add(contact);
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
  const { findById, update } = useEntityListCache<CounterpartContactResponse>(
    COUNTERPARTS_BANKS_QUERY
  );

  return useQuery<CounterpartContactResponse | undefined, Error>(
    [COUNTERPARTS_CONTACTS_QUERY, { id: contactId }],
    () => {
      if (!contactId) return undefined;

      const existedContact = findById(contactId);

      if (existedContact) {
        update(existedContact);
        return undefined;
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
    COUNTERPARTS_CONTACTS_QUERY
  );

  return useMutation<
    CounterpartContactResponse,
    Error,
    CounterpartContactUpdate
  >(
    ({ contactId, payload }) =>
      monite.api.counterparts.updateContact(counterpartId, contactId, payload),
    {
      onSuccess: async (contact) => {
        update(contact);
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
    COUNTERPARTS_CONTACTS_QUERY
  );

  return useMutation<void, Error, string>(
    (contactId) =>
      monite.api.counterparts.deleteContact(counterpartId, contactId),
    {
      onSuccess: (_, contactId) => {
        remove(contactId);
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
    [COUNTERPARTS_QUERY],
    () => {
      return monite.api.counterparts.getList(...args);
    },
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useCreateCounterpart = () => {
  const { monite } = useComponentsContext();
  const { invalidate } =
    useEntityListCache<CounterpartResponse>(COUNTERPARTS_QUERY);
  const { setEntity } = useEntityCache<CounterpartResponse>(COUNTERPARTS_QUERY);

  return useMutation<CounterpartResponse, Error, CounterpartCreatePayload>(
    (body) => monite.api.counterparts.create(body),
    {
      onSuccess: async (counterpart) => {
        setEntity(counterpart);
        await invalidate();
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
    [COUNTERPARTS_QUERY, { id }],
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
  const { invalidate } =
    useEntityListCache<CounterpartResponse>(COUNTERPARTS_QUERY);
  const { setEntity } = useEntityCache<CounterpartResponse>(COUNTERPARTS_QUERY);

  return useMutation<CounterpartResponse, Error, CounterpartUpdate>(
    ({ id, counterpart }) => monite.api.counterparts.update(id, counterpart),
    {
      onSuccess: async (counterpart) => {
        setEntity(counterpart);
        await invalidate();
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
  const { invalidate } =
    useEntityListCache<CounterpartResponse>(COUNTERPARTS_QUERY);
  const { getEntity, removeEntity } =
    useEntityCache<CounterpartResponse>(COUNTERPARTS_QUERY);

  return useMutation<void, Error, string, CounterpartResponse>(
    (id) => monite.api.counterparts.delete(id),
    {
      onMutate: (id) => getEntity(id),
      onSuccess: async (_, id, counterpart) => {
        toast(
          counterpart
            ? t('counterparts:confirmDialogue.successNotification', {
                name: getName(counterpart),
              })
            : ''
        );

        removeEntity(id);

        await invalidate();
      },
      onError: (_, __, counterpart) => {
        toast.error(
          counterpart
            ? t('counterparts:confirmDialogue.errorNotification', {
                name: getName(counterpart),
              })
            : ''
        );
      },
    }
  );
};
