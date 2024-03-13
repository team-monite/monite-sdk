import { ENTITY_USERS_QUERY_ID } from '@/core/queries';
import { checkPermissionQueriesLoaded } from '@/utils/test-utils';
import { QueryClient } from '@tanstack/react-query';

describe('Test Utils', () => {
  describe('# checkPermissionQueriesLoaded(..)', () => {
    test('throw the error if QueryClient is empty', async () => {
      await expect(
        checkPermissionQueriesLoaded(new QueryClient())
      ).rejects.toThrow('Permissions query not exists');
    });

    test('resolve "true" if query state "success" for both of queries', async () => {
      const queryClient = new QueryClient();

      queryClient.setQueryData([ENTITY_USERS_QUERY_ID, 'my_role'], {
        dummy: true,
      });

      queryClient.setQueryData([ENTITY_USERS_QUERY_ID, 'me'], {
        dummy: true,
      });

      await expect(
        checkPermissionQueriesLoaded(queryClient)
      ).resolves.toBeUndefined();
    });

    test('throw error if query state of "me" query is not "success"', async () => {
      const queryClient = new QueryClient();

      queryClient.setQueryData([ENTITY_USERS_QUERY_ID, 'my_role'], {
        dummy: true,
      });

      await expect(
        checkPermissionQueriesLoaded(new QueryClient())
      ).rejects.toThrow('Permissions query not exists');
    });

    test('throw error if query state of "my_role" query is not "success"', async () => {
      const queryClient = new QueryClient();

      queryClient.setQueryData([ENTITY_USERS_QUERY_ID, 'me'], {
        dummy: true,
      });

      await expect(
        checkPermissionQueriesLoaded(new QueryClient())
      ).rejects.toThrow('Permissions query not exists');
    });
  });
});
