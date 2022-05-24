import {
  ENTITY_ID_FOR_ABSENT_PERMISSIONS,
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_LOW_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import { createRenderWithClient } from '@/utils/test-utils';
import { ActionEnum } from '@/utils/types';
import { MoniteSDK, PayableActionEnum, PermissionEnum } from '@monite/sdk-api';
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
          action_name: PayableActionEnum.READ,
          permission: PermissionEnum.ALLOWED,
        },
        {
          action_name: PayableActionEnum.CREATE,
          permission: PermissionEnum.ALLOWED,
        },
        {
          action_name: PayableActionEnum.UPDATE,
          permission: PermissionEnum.ALLOWED,
        },
        {
          action_name: PayableActionEnum.SUBMIT,
          permission: PermissionEnum.ALLOWED,
        },
        {
          action_name: PayableActionEnum.APPROVE,
          permission: PermissionEnum.ALLOWED,
        },
        {
          action_name: PayableActionEnum.PAY,
          permission: PermissionEnum.ALLOWED,
        },
        {
          action_name: PayableActionEnum.DELETE,
          permission: PermissionEnum.ALLOWED,
        },
        {
          action_name: PayableActionEnum.CANCEL,
          permission: PermissionEnum.ALLOWED,
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
          action_name: ActionEnum.READ,
          permission: PermissionEnum.ALLOWED,
        },
        {
          action_name: ActionEnum.CREATE,
          permission: PermissionEnum.ALLOWED,
        },
        {
          action_name: ActionEnum.UPDATE,
          permission: PermissionEnum.ALLOWED,
        },
        {
          action_name: ActionEnum.DELETE,
          permission: PermissionEnum.ALLOWED,
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
          action_name: PayableActionEnum.READ,
          permission: PermissionEnum.ALLOWED,
        },
        {
          action_name: PayableActionEnum.CREATE,
          permission: PermissionEnum.NOT_ALLOWED,
        },
        {
          action_name: PayableActionEnum.UPDATE,
          permission: PermissionEnum.ALLOWED,
        },
        {
          action_name: PayableActionEnum.SUBMIT,
          permission: PermissionEnum.NOT_ALLOWED,
        },
        {
          action_name: PayableActionEnum.APPROVE,
          permission: PermissionEnum.NOT_ALLOWED,
        },
        {
          action_name: PayableActionEnum.PAY,
          permission: PermissionEnum.NOT_ALLOWED,
        },
        {
          action_name: PayableActionEnum.DELETE,
          permission: PermissionEnum.NOT_ALLOWED,
        },
        {
          action_name: PayableActionEnum.CANCEL,
          permission: PermissionEnum.NOT_ALLOWED,
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
          action_name: PayableActionEnum.READ,
          permission: PermissionEnum.ALLOWED_FOR_OWN,
        },
        {
          action_name: PayableActionEnum.CREATE,
          permission: PermissionEnum.ALLOWED_FOR_OWN,
        },
        {
          action_name: PayableActionEnum.UPDATE,
          permission: PermissionEnum.ALLOWED_FOR_OWN,
        },
        {
          action_name: PayableActionEnum.SUBMIT,
          permission: PermissionEnum.ALLOWED_FOR_OWN,
        },
        {
          action_name: PayableActionEnum.APPROVE,
          permission: PermissionEnum.ALLOWED_FOR_OWN,
        },
        {
          action_name: PayableActionEnum.PAY,
          permission: PermissionEnum.ALLOWED_FOR_OWN,
        },
        {
          action_name: PayableActionEnum.DELETE,
          permission: PermissionEnum.ALLOWED_FOR_OWN,
        },
        {
          action_name: PayableActionEnum.CANCEL,
          permission: PermissionEnum.ALLOWED_FOR_OWN,
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
              action: PayableActionEnum.READ,
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
              action: ActionEnum.READ,
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
              action: PayableActionEnum.READ,
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
              action: ActionEnum.READ,
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
              action: PayableActionEnum.READ,
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
              action: ActionEnum.READ,
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
          headers: {
            // @ts-expect-error We need to nullish entity id from `entity_users/me` request
            'x-monite-entity-user-id': null,
          },
        });

        const { result } = renderHook(
          () =>
            useIsActionAllowed({
              method: 'payable',
              action: PayableActionEnum.READ,
            }),
          {
            wrapper: createRenderWithClient({ monite }),
          }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(false);
      });

      test('should return "true" when the user IS the owner of "payable" but "payable" returns ALLOWED_FOR_OWN status', async () => {
        const entityUserId = '5b4daced-6b9a-4707-83c6-08193d999fab';

        const monite = new MoniteSDK({
          fetchToken: () =>
            Promise.resolve({
              access_token: getRandomToken(),
              token_type: 'Bearer',
              expires_in: 3600,
            }),
          entityId: ENTITY_ID_FOR_OWNER_PERMISSIONS,
          headers: {
            /** This user is the owner of the first Payable */
            'x-monite-entity-user-id': entityUserId,
          },
        });

        const { result } = renderHook(
          () =>
            useIsActionAllowed({
              method: 'payable',
              action: PayableActionEnum.READ,
              entityUserId,
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
          headers: {
            /** This user IS NOT the owner of the first Payable */
            'x-monite-entity-user-id': 'not-owner',
          },
        });

        const { result } = renderHook(
          () =>
            useIsActionAllowed({
              method: 'payable',
              action: PayableActionEnum.READ,
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
