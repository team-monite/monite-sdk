import {
  ApiError,
  HTTPValidationError,
  OptionalPersonRequest,
  PersonRequest,
  PersonResponse,
  PersonsResponse,
} from '@monite/sdk-api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';
import type { ErrorType } from './types';

export type PersonUpdateType = { id: string; payload: OptionalPersonRequest };

export const PERSON_QUERY = 'persons';

export const personQueryKeys = {
  all: () => [PERSON_QUERY],
  detail: (personId?: string) =>
    personId
      ? [...personQueryKeys.all(), 'detail', personId]
      : [...personQueryKeys.all(), 'detail'],
};

export const usePersonList = () => {
  const { monite } = useMoniteContext();

  return useQuery<PersonsResponse, ErrorType>({
    queryKey: personQueryKeys.all(),

    queryFn: () => monite.api.persons.getAll(),
  });
};

export const useUpdatePerson = () => {
  const { monite } = useMoniteContext();

  return useMutation<PersonResponse, ErrorType, PersonUpdateType>({
    mutationFn: ({ id, payload }) => monite.api.persons.update(id, payload),
  });
};

export const useDeletePerson = () => {
  const { monite } = useMoniteContext();

  return useMutation<void, ErrorType, string>({
    mutationFn: (personId) => monite.api.persons.delete(personId),
  });
};
