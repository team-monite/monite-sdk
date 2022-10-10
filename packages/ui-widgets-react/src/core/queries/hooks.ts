import { useQueryClient } from 'react-query';
import { useCallback } from 'react';
import type { Updater } from '@tanstack/react-query-devtools/build/types/query-core/src/utils';

type EntityType = { id: string };

export const useEntityCache = <TInput extends EntityType>(key: string) => {
  const queryClient = useQueryClient();

  const getEntity = useCallback(
    (id: string): TInput | undefined =>
      queryClient.getQueryData<TInput>([key, { id }]),
    [queryClient, key]
  );

  const setEntity = useCallback(
    (entity: TInput) =>
      queryClient.setQueryData([key, { id: entity.id }], entity),
    [queryClient, key]
  );

  const removeEntity = useCallback(
    (id: string) => queryClient.removeQueries([key, { id }]),
    [queryClient, key]
  );

  return {
    getEntity,
    setEntity,
    removeEntity,
  };
};

export const useEntityListCache = <TInput extends EntityType>(key: string) => {
  const queryClient = useQueryClient();
  const { setEntity, removeEntity } = useEntityCache(key);

  const findById = useCallback(
    (id: string): TInput | undefined =>
      queryClient
        .getQueryData<TInput[]>([key])
        ?.find((entity) => entity.id === id),
    [queryClient, key]
  );

  const add = useCallback(
    (entity: TInput) => {
      setEntity(entity);

      return queryClient.setQueryData<Updater<TInput[], TInput[]>>(
        [key],
        (list: TInput[]) => (list ? [...list, entity] : [entity])
      );
    },
    [queryClient, key]
  );

  const update = useCallback(
    (entity: TInput) => {
      setEntity(entity);

      return queryClient.setQueryData<Updater<TInput[], TInput[]>>(
        [key],
        (list: TInput[]) =>
          list?.map((old) => (old.id === entity.id ? entity : old))
      );
    },
    [queryClient, key]
  );

  const remove = useCallback(
    (id: string) => {
      removeEntity(id);

      return queryClient.setQueryData<Updater<TInput[], TInput[]>>(
        [key],
        (list: TInput[]) => list.filter((entity) => entity.id !== id)
      );
    },
    [queryClient, key]
  );

  const invalidate = useCallback(
    () => async () =>
      await queryClient.invalidateQueries([key], {
        exact: true,
      }),
    [queryClient, key]
  );

  return {
    findById,
    add,
    update,
    remove,
    invalidate,
  };
};
