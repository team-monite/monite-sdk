import {
  ENTITY_ID_FOR_ABSENT_PERMISSIONS,
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_LOW_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import { entityUserByIdWithOwnerPermissionsFixture } from '@/mocks/entityUsers/entityUserByIdFixture';
import { createRenderWithClient } from '@/utils/test-utils';
import { MoniteSDK } from '@monite/sdk-api';
import { renderHook, waitFor } from '@testing-library/react';

import { useIsActionAllowed, usePermissions } from './usePermissions';

const getRandomToken = () => (Math.random() + 1).toString(36).substring(7);

describe('useRoles', () => {
  describe('# usePermissions', () => {
    test('should return all permissions for "payable" action when the user have all permissions', async () => {
      const { result } = renderHook(() => usePermissions('payable'), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([
        {
          action_name: 'read',
          permission: 'allowed',
        },
        {
          action_name: 'create',
          permission: 'allowed',
        },
        {
          action_name: 'update',
          permission: 'allowed',
        },
        {
          action_name: 'submit',
          permission: 'allowed',
        },
        {
          action_name: 'approve',
          permission: 'allowed',
        },
        {
          action_name: 'pay',
          permission: 'allowed',
        },
        {
          action_name: 'delete',
          permission: 'allowed',
        },
        {
          action_name: 'cancel',
          permission: 'allowed',
        },
      ]);
    });

    test('should return all permissions for "counterpart" action when the user have all permissions', async () => {
      const { result } = renderHook(() => usePermissions('counterpart'), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([
        {
          action_name: 'read',
          permission: 'allowed',
        },
        {
          action_name: 'create',
          permission: 'allowed',
        },
        {
          action_name: 'update',
          permission: 'allowed',
        },
        {
          action_name: 'delete',
          permission: 'allowed',
        },
      ]);
    });

    test('should return all not allowed permissions for "payable" action when the user have all permissions not_allowed', async () => {
      const monite = new MoniteSDK({
        fetchToken: () =>
          Promise.resolve({
            access_token: getRandomToken(),
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: ENTITY_ID_FOR_LOW_PERMISSIONS,
      });

      const { result } = renderHook(() => usePermissions('payable'), {
        wrapper: createRenderWithClient({ monite }),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([
        {
          action_name: 'read',
          permission: 'allowed',
        },
        {
          action_name: 'create',
          permission: 'not_allowed',
        },
        {
          action_name: 'update',
          permission: 'allowed',
        },
        {
          action_name: 'submit',
          permission: 'not_allowed',
        },
        {
          action_name: 'approve',
          permission: 'not_allowed',
        },
        {
          action_name: 'pay',
          permission: 'not_allowed',
        },
        {
          action_name: 'delete',
          permission: 'not_allowed',
        },
        {
          action_name: 'cancel',
          permission: 'not_allowed',
        },
      ]);
    });

    test('should return all permissions for "payable" action with "allowed_for_owner" status', async () => {
      const monite = new MoniteSDK({
        fetchToken: () =>
          Promise.resolve({
            access_token: getRandomToken(),
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: ENTITY_ID_FOR_OWNER_PERMISSIONS,
      });

      const { result } = renderHook(() => usePermissions('payable'), {
        wrapper: createRenderWithClient({ monite }),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([
        {
          action_name: 'read',
          permission: 'allowed_for_own',
        },
        {
          action_name: 'create',
          permission: 'allowed_for_own',
        },
        {
          action_name: 'update',
          permission: 'allowed_for_own',
        },
        {
          action_name: 'submit',
          permission: 'allowed_for_own',
        },
        {
          action_name: 'approve',
          permission: 'allowed_for_own',
        },
        {
          action_name: 'pay',
          permission: 'allowed_for_own',
        },
        {
          action_name: 'delete',
          permission: 'allowed_for_own',
        },
        {
          action_name: 'cancel',
          permission: 'allowed_for_own',
        },
      ]);
    });

    test('should return zero permissions for "payable" action when the user have not permissions at all', async () => {
      const monite = new MoniteSDK({
        fetchToken: () =>
          Promise.resolve({
            access_token: getRandomToken(),
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
      });

      const { result } = renderHook(() => usePermissions('payable'), {
        wrapper: createRenderWithClient({ monite }),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
    });

    test('should return zero permissions for "counterpart" action when the user have not permissions at all', async () => {
      const monite = new MoniteSDK({
        fetchToken: () =>
          Promise.resolve({
            access_token: getRandomToken(),
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
      });

      const { result } = renderHook(() => usePermissions('counterpart'), {
        wrapper: createRenderWithClient({ monite }),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
    });

    describe('# useIsActionAllowed', () => {
      test('should return "true" when the user have all permissions for "payable" action and ask READ permissions', async () => {
        const { result } = renderHook(
          () =>
            useIsActionAllowed({
              method: 'payable',
              action: 'read',
            }),
          {
            wrapper: createRenderWithClient(),
          }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(true);
      });

      test('should return "true" when the user have all permissions for "counterpart" action and ask READ permissions', async () => {
        const { result } = renderHook(
          () =>
            useIsActionAllowed({
              method: 'counterpart',
              action: 'read',
            }),
          {
            wrapper: createRenderWithClient(),
          }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(true);
      });

      test('should return "false" when the user have NOT permission for "payable" READ action', async () => {
        const monite = new MoniteSDK({
          fetchToken: () =>
            Promise.resolve({
              access_token: getRandomToken(),
              token_type: 'Bearer',
              expires_in: 3600,
            }),
          entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
        });

        const { result } = renderHook(
          () =>
            useIsActionAllowed({
              method: 'payable',
              action: 'read',
            }),
          {
            wrapper: createRenderWithClient({ monite }),
          }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(false);
      });

      test('should return "false" when the user have NOT permission for "counterpart" READ action', async () => {
        const monite = new MoniteSDK({
          fetchToken: () =>
            Promise.resolve({
              access_token: getRandomToken(),
              token_type: 'Bearer',
              expires_in: 3600,
            }),
          entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
        });

        const { result } = renderHook(
          () =>
            useIsActionAllowed({
              method: 'counterpart',
              action: 'read',
            }),
          {
            wrapper: createRenderWithClient({ monite }),
          }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(false);
      });

      test('should return "false" when the user have empty permission list for "payable" READ', async () => {
        const monite = new MoniteSDK({
          fetchToken: () =>
            Promise.resolve({
              access_token: getRandomToken(),
              token_type: 'Bearer',
              expires_in: 3600,
            }),
          entityId: ENTITY_ID_FOR_ABSENT_PERMISSIONS,
        });

        const { result } = renderHook(
          () =>
            useIsActionAllowed({
              method: 'payable',
              action: 'read',
            }),
          {
            wrapper: createRenderWithClient({ monite }),
          }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(false);
      });

      test('should return "false" when the user have empty permission list for "counterpart" READ', async () => {
        const monite = new MoniteSDK({
          fetchToken: () =>
            Promise.resolve({
              access_token: getRandomToken(),
              token_type: 'Bearer',
              expires_in: 3600,
            }),
          entityId: ENTITY_ID_FOR_ABSENT_PERMISSIONS,
        });

        const { result } = renderHook(
          () =>
            useIsActionAllowed({
              method: 'counterpart',
              action: 'read',
            }),
          {
            wrapper: createRenderWithClient({ monite }),
          }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(false);
      });

      test('should return "false" when the user IS EMPTY and "payable" returns ALLOWED_FOR_OWN status', async () => {
        const monite = new MoniteSDK({
          fetchToken: () =>
            Promise.resolve({
              access_token: getRandomToken(),
              token_type: 'Bearer',
              expires_in: 3600,
            }),
          entityId: ENTITY_ID_FOR_OWNER_PERMISSIONS,
        });

        const { result } = renderHook(
          () =>
            useIsActionAllowed({
              method: 'payable',
              action: 'read',
            }),
          {
            wrapper: createRenderWithClient({ monite }),
          }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(false);
      });

      test('should return "true" when the user IS the owner of "payable" but "payable" returns ALLOWED_FOR_OWN status', async () => {
        const monite = new MoniteSDK({
          fetchToken: () =>
            Promise.resolve({
              access_token: getRandomToken(),
              token_type: 'Bearer',
              expires_in: 3600,
            }),
          entityId: ENTITY_ID_FOR_OWNER_PERMISSIONS,
        });

        const { result } = renderHook(
          () =>
            useIsActionAllowed({
              method: 'payable',
              action: 'read',
              entityUserId: entityUserByIdWithOwnerPermissionsFixture.id,
            }),
          {
            wrapper: createRenderWithClient({ monite }),
          }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(true);
      });

      test('should return "false" when the user IS NOT the owner of "payable" but "payable" returns ALLOWED_FOR_OWN status', async () => {
        const monite = new MoniteSDK({
          fetchToken: () =>
            Promise.resolve({
              access_token: getRandomToken(),
              token_type: 'Bearer',
              expires_in: 3600,
            }),
          entityId: ENTITY_ID_FOR_OWNER_PERMISSIONS,
        });

        const { result } = renderHook(
          () =>
            useIsActionAllowed({
              method: 'payable',
              action: 'read',
              entityUserId: '5b4daced-6b9a-4707-83c6-08193d999fab',
            }),
          {
            wrapper: createRenderWithClient({ monite }),
          }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(false);
      });
    });
  });
});
