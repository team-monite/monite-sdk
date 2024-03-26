import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import type { Updater } from '@tanstack/react-query';

type EntityType = { id: string };

export const useEntityCache = <TInput extends EntityType>(
  key: (id?: string) => (string | undefined)[]
) => {
  const queryClient = useQueryClient();

  const setEntity = useCallback(
    (entity: TInput) => {
      queryClient.setQueryData(key(entity.id), entity);
    },
    [queryClient, key]
  );

  const removeEntity = useCallback(
    (id: string) => queryClient.removeQueries(key(id)),
    [queryClient, key]
  );

  return {
    setEntity,
    removeEntity,
  };
};

export const useEntityListCache = <TInput extends EntityType>(
  key: (listId?: string) => string[]
) => {
  const queryClient = useQueryClient();

  const findById = useCallback(
    (id: string): TInput | undefined => {
      const queryData = queryClient.getQueryData<TInput[]>(key());

      return queryData?.find((entity) => entity.id === id);
    },
    [queryClient, key]
  );

  const add = useCallback(
    (entity: TInput) => {
      return queryClient.setQueryData<Updater<TInput[], TInput[]>>(
        key(),
        (list: TInput[]) => (list ? [...list, entity] : [entity])
      );
    },
    [queryClient, key]
  );

  const update = useCallback(
    (entity: TInput) =>
      queryClient.setQueryData<Updater<TInput[], TInput[]>>(
        key(),
        (list: TInput[]) =>
          list?.map((old) => (old.id === entity.id ? entity : old))
      ),
    [queryClient, key]
  );

  const remove = useCallback(
    (id: string) =>
      /**
       * If there is no items in cache
       * (
       *  the user uses only *Details component,
       *  but don't use *List component
       * )
       *  then there will be no items in cache
       *
       * @see {@link https://tanstack.com/query/v4/docs/react/reference/QueryClient#queryclientsetquerydata} React Query `setQueryData` documentation
       */
      queryClient.setQueryData<TInput[] | undefined>(key(), (list) => {
        if (!list) {
          return undefined;
        }

        return list.filter((entity) => entity.id !== id);
      }),
    [queryClient, key]
  );

  const invalidate = useCallback(
    (listId?: string) => {
      if (listId) {
        (async () => await queryClient.invalidateQueries(key(listId)))();
        return;
      }

      (async () => await queryClient.invalidateQueries(key()))();
    },
    [queryClient, key]
  );

  const destroy = useCallback(
    () => queryClient.removeQueries(key()),
    [queryClient, key]
  );

  return {
    findById,
    add,
    update,
    remove,
    invalidate,
    destroy,
  };
};
