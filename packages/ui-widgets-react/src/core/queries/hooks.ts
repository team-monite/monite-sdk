import { useQueryClient } from 'react-query';
import { useCallback } from 'react';
import type { Updater } from '@tanstack/react-query-devtools/build/types/query-core/src/utils';

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
  key: () => string[]
) => {
  const queryClient = useQueryClient();

  const findById = useCallback(
    (id: string): TInput | undefined =>
      queryClient
        .getQueryData<TInput[]>(key())
        ?.find((entity) => entity.id === id),
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
      queryClient.setQueryData<Updater<TInput[], TInput[]>>(
        key(),
        (list: TInput[]) => list.filter((entity) => entity.id !== id)
      ),
    [queryClient, key]
  );

  const invalidate = useCallback(() => {
    (async () => await queryClient.invalidateQueries(key()))();
  }, [queryClient, key]);

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
