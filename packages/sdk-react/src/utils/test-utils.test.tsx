import { ENTITY_USERS_QUERY_ID } from '@/core/queries';
import { loadedPermissionsValidator } from '@/utils/test-utils';
import { QueryClient } from '@tanstack/react-query';

describe('Test Utils', () => {
  describe('# loadedPermissionsValidator(..)', () => {
    test('throw the error if QueryClient is empty', async () => {
      await expect(
        loadedPermissionsValidator(new QueryClient())
      ).rejects.toThrow('Permissions not loaded');
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
        loadedPermissionsValidator(queryClient)
      ).resolves.toBeUndefined();
    });

    test('throw error if query state of "me" query is not "success"', async () => {
      const queryClient = new QueryClient();

      queryClient.setQueryData([ENTITY_USERS_QUERY_ID, 'my_role'], {
        dummy: true,
      });

      await expect(
        loadedPermissionsValidator(new QueryClient())
      ).rejects.toThrow('Permissions not loaded');
    });

    test('throw error if query state of "my_role" query is not "success"', async () => {
      const queryClient = new QueryClient();

      queryClient.setQueryData([ENTITY_USERS_QUERY_ID, 'me'], {
        dummy: true,
      });

      await expect(
        loadedPermissionsValidator(new QueryClient())
      ).rejects.toThrow('Permissions not loaded');
    });
  });
});
