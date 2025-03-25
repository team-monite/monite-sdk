import { useReducer } from 'react';

import {
  Dialog,
  PageHeader,
  UserRoleDetailsDialog,
  UserRoleEditDialog,
} from '@/components';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button } from '@mui/material';

import { UserRolesTable } from './UserRolesTable';

export const UserRoles = () => (
  <MoniteScopedProviders>
    <UserRolesBase />
  </MoniteScopedProviders>
);

type UserRolesAction = {
  type:
    | 'OPEN_DETAILS'
    | 'CLOSE_DETAILS'
    | 'OPEN_EDIT'
    | 'CLOSE_EDIT'
    | 'OPEN_CREATE';
  payload?: string;
};

type UserRolesState = {
  isDetailsDialogOpened: boolean;
  isEditDialogOpened: boolean;
  selectedUserRoleId?: string;
};

const initialState: UserRolesState = {
  isDetailsDialogOpened: false,
  isEditDialogOpened: false,
  selectedUserRoleId: undefined,
};

const userRolesReducer = (
  state: UserRolesState,
  action: UserRolesAction
): UserRolesState => {
  switch (action.type) {
    case 'OPEN_DETAILS':
      return {
        ...state,
        selectedUserRoleId: action.payload,
        isDetailsDialogOpened: true,
      };
    case 'CLOSE_DETAILS':
      return { ...state, isDetailsDialogOpened: false };
    case 'OPEN_EDIT':
      return { ...state, isEditDialogOpened: true };
    case 'CLOSE_EDIT':
      return { ...state, isEditDialogOpened: false };
    case 'OPEN_CREATE':
      return {
        ...state,
        selectedUserRoleId: undefined,
        isEditDialogOpened: true,
      };

    default:
      return state;
  }
};

const UserRolesBase = () => {
  const { i18n } = useLingui();
  const [state, dispatch] = useReducer(userRolesReducer, initialState);
  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'role',
      action: 'read',
      entityUserId: user?.id,
    });
  const { data: isCreateAllowed, isLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'role',
      action: 'create',
      entityUserId: user?.id,
    });

  return (
    <>
      <PageHeader
        title={t(i18n)`User Roles`}
        extra={
          <Button
            variant="contained"
            color="primary"
            disabled={isCreateAllowedLoading || !isCreateAllowed}
            onClick={() => dispatch({ type: 'OPEN_CREATE' })}
          >
            {t(i18n)`Create New`}
          </Button>
        }
      />

      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && (
        <UserRolesTable
          onRowClick={(id: string) =>
            dispatch({
              type: 'OPEN_DETAILS',
              payload: id,
            })
          }
          handleCreateNew={() => dispatch({ type: 'OPEN_CREATE' })}
        />
      )}

      <Dialog
        open={state.isDetailsDialogOpened}
        alignDialog="right"
        onClose={() => dispatch({ type: 'CLOSE_DETAILS' })}
      >
        <UserRoleDetailsDialog
          id={state.selectedUserRoleId}
          onClickEditRole={() => dispatch({ type: 'OPEN_EDIT' })}
        />
      </Dialog>

      <Dialog
        fullScreen
        open={state.isEditDialogOpened}
        onClose={() => dispatch({ type: 'CLOSE_EDIT' })}
      >
        <UserRoleEditDialog
          id={state.selectedUserRoleId}
          onCreated={() => dispatch({ type: 'CLOSE_EDIT' })}
          onUpdated={() => dispatch({ type: 'CLOSE_EDIT' })}
        />
      </Dialog>
    </>
  );
};
