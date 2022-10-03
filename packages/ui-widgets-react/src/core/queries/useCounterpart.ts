import { useMutation, useQuery, useQueryClient } from 'react-query';
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
import { Updater } from '@tanstack/react-query-devtools/build/types/query-core/src/utils';

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
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<
    CounterpartBankAccountResponse,
    Error,
    CounterpartBankAccount
  >((bank) => monite.api.counterparts.createBankAccount(counterpartId, bank), {
    onSuccess: async (bank) => {
      queryClient.setQueryData(
        [COUNTERPARTS_BANKS_QUERY, { id: bank.id }],
        bank
      );

      queryClient.setQueryData<
        Updater<
          CounterpartBankAccountResponse[],
          CounterpartBankAccountResponse[]
        >
      >(
        [COUNTERPARTS_BANKS_QUERY],
        (banks: CounterpartBankAccountResponse[]) => [...banks, bank]
      );

      await queryClient.invalidateQueries([COUNTERPARTS_QUERY]);

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
  const queryClient = useQueryClient();

  return useQuery<CounterpartBankAccountResponse | undefined, Error>(
    [COUNTERPARTS_BANKS_QUERY, { id: bankId }],
    () => {
      if (!bankId) return undefined;

      const existedBank = queryClient
        .getQueryData<CounterpartBankAccountResponse[]>(
          COUNTERPARTS_BANKS_QUERY
        )
        ?.find((bank) => bank.id === bankId);

      if (existedBank) {
        return queryClient.setQueryData(
          [COUNTERPARTS_BANKS_QUERY, { id: existedBank.id }],
          existedBank
        );
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
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<
    CounterpartBankAccountResponse,
    Error,
    CounterpartBankUpdate
  >(
    ({ bankId, payload }) =>
      monite.api.counterparts.updateBankAccount(counterpartId, bankId, payload),
    {
      onSuccess: async (bank) => {
        queryClient.setQueryData<
          Updater<
            CounterpartBankAccountResponse[],
            CounterpartBankAccountResponse[]
          >
        >(
          [COUNTERPARTS_BANKS_QUERY],
          (banks: CounterpartBankAccountResponse[]) =>
            banks.map((oldBank) => (oldBank.id === bank.id ? bank : oldBank))
        );

        queryClient.setQueryData(
          [COUNTERPARTS_BANKS_QUERY, { id: bank.id }],
          bank
        );

        await queryClient.invalidateQueries([COUNTERPARTS_QUERY]);

        toast.success('Bank was updated');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useDeleteCounterpartBank = (counterpartId: string) => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<void, Error, string>(
    (bankId) =>
      monite.api.counterparts.deleteBankAccount(counterpartId, bankId),
    {
      onSuccess: (_, bankId) => {
        queryClient.setQueryData<
          Updater<
            CounterpartBankAccountResponse[],
            CounterpartBankAccountResponse[]
          >
        >(
          [COUNTERPARTS_BANKS_QUERY],
          (banks: CounterpartBankAccountResponse[]) =>
            banks.filter((bank) => bank.id !== bankId)
        );

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
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<
    CounterpartContactResponse,
    Error,
    CreateCounterpartContactPayload
  >(
    (contact) => monite.api.counterparts.createContact(counterpartId, contact),
    {
      onSuccess: async (contact) => {
        queryClient.setQueryData(
          [COUNTERPARTS_CONTACTS_QUERY, { id: contact.id }],
          contact
        );

        queryClient.setQueryData<
          Updater<CounterpartContactResponse[], CounterpartContactResponse[]>
        >(
          [COUNTERPARTS_CONTACTS_QUERY],
          (contacts: CounterpartContactResponse[]) => [...contacts, contact]
        );

        await queryClient.invalidateQueries([COUNTERPARTS_QUERY]);

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
  const queryClient = useQueryClient();

  return useQuery<CounterpartContactResponse | undefined, Error>(
    [COUNTERPARTS_CONTACTS_QUERY, { id: contactId }],
    () => {
      if (!contactId) return undefined;

      const existedContact = queryClient
        .getQueryData<CounterpartContactResponse[]>(COUNTERPARTS_CONTACTS_QUERY)
        ?.find((contact) => contact.id === contactId);

      if (existedContact) {
        return queryClient.setQueryData(
          [COUNTERPARTS_CONTACTS_QUERY, { id: existedContact.id }],
          existedContact
        );
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
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<
    CounterpartContactResponse,
    Error,
    CounterpartContactUpdate
  >(
    ({ contactId, payload }) =>
      monite.api.counterparts.updateContact(counterpartId, contactId, payload),
    {
      onSuccess: async (contact) => {
        queryClient.setQueryData<
          Updater<CounterpartContactResponse[], CounterpartContactResponse[]>
        >(
          [COUNTERPARTS_CONTACTS_QUERY],
          (contacts: CounterpartContactResponse[]) =>
            contacts.map((oldContact) =>
              oldContact.id === contact.id ? contact : oldContact
            )
        );

        queryClient.setQueryData(
          [COUNTERPARTS_CONTACTS_QUERY, { id: contact.id }],
          contact
        );

        await queryClient.invalidateQueries([COUNTERPARTS_QUERY]);

        toast.success('Contact was updated');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useDeleteCounterpartContact = (counterpartId: string) => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<void, Error, string>(
    (contactId) =>
      monite.api.counterparts.deleteContact(counterpartId, contactId),
    {
      onSuccess: (_, contactId) => {
        queryClient.setQueryData<
          Updater<CounterpartContactResponse[], CounterpartContactResponse[]>
        >(
          [COUNTERPARTS_CONTACTS_QUERY],
          (contacts: CounterpartContactResponse[]) =>
            contacts.filter((contact) => contact.id !== contactId)
        );

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
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<CounterpartResponse, Error, CounterpartCreatePayload>(
    (body) => monite.api.counterparts.create(body),
    {
      onSuccess: async (counterpart) => {
        queryClient.setQueryData(
          [COUNTERPARTS_QUERY, { id: counterpart.id }],
          counterpart
        );

        await queryClient.invalidateQueries([COUNTERPARTS_QUERY]);

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
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<CounterpartResponse, Error, CounterpartUpdate>(
    ({ id, counterpart }) => monite.api.counterparts.update(id, counterpart),
    {
      onSuccess: async (counterpart) => {
        queryClient.setQueryData(
          [COUNTERPARTS_QUERY, { id: counterpart.id }],
          counterpart
        );
        await queryClient.invalidateQueries([COUNTERPARTS_QUERY]);
        toast.success('Updated');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useDeleteCounterpart = () => {
  const queryClient = useQueryClient();
  const { monite, t } = useComponentsContext();

  return useMutation(
    (counterpart: CounterpartResponse) =>
      monite.api.counterparts.delete(counterpart.id),
    {
      onSuccess: async (_, counterpart) => {
        toast(
          t('counterparts:confirmDialogue.successNotification', {
            name: getName(counterpart),
          })
        );

        await queryClient.invalidateQueries([COUNTERPARTS_QUERY]);
      },
      onError: (_, counterpart) => {
        toast.error(
          t('counterparts:confirmDialogue.errorNotification', {
            name: getName(counterpart),
          })
        );
      },
    }
  );
};
