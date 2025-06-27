import { useId, useReducer, useState } from 'react';

import {
  ApprovalPolicyDetails,
  UserRoleDeleteDialog,
  UserRoleDetailsDialog,
  UserRoleEditDialog,
  UserRolesTable,
} from '@/components';
import { ApprovalPoliciesTable } from '@/components/approvalPolicies/ApprovalPoliciesTable';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useMenuButton } from '@/core/hooks';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { Button } from '@/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuSubContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubTrigger,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import { Dialog } from '@/ui/Dialog';
import { PageHeader } from '@/ui/PageHeader';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  Tab,
  Tabs,
} from '@mui/material';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

/**
 * ApprovalPolicies component
 *
 * This component renders the user roles & approval policies page. It includes a table of approval policies,
 * a dialog for creating new approval policies,
 * and a header with a button for opening the create dialog.
 */
export const RolesAndApprovalPolicies = () => (
  <MoniteScopedProviders>
    <RolesAndApprovalPoliciesBase />
  </MoniteScopedProviders>
);

enum PageTabEnum {
  Roles,
  Policies,
}

type RoleAction = {
  type:
    | 'OPEN_ROLE_DETAILS'
    | 'CLOSE_ROLE_DETAILS'
    | 'OPEN_ROLE_EDIT'
    | 'CLOSE_ROLE_EDIT'
    | 'OPEN_ROLE_CREATE'
    | 'OPEN_ROLE_DELETE'
    | 'CLOSE_ROLE_DELETE'
    | 'ROLE_DELETED';
  payload?: string;
};

type PolicyAction = {
  type: 'OPEN_POLICY_DETAILS' | 'CLOSE_POLICY_DETAILS' | 'OPEN_POLICY_CREATE';
  payload?: string;
};

type RolesPoliciesState = {
  isRoleDetailsDialogOpened: boolean;
  isRoleEditDialogOpened: boolean;
  isRoleDeleteDialogOpened: boolean;
  selectedUserRoleId?: string;
  isPolicyDetailsDialogOpened: boolean;
  selectedApprovalPolicyId?: string;
};

const initialState: RolesPoliciesState = {
  isRoleDetailsDialogOpened: false,
  isRoleEditDialogOpened: false,
  isRoleDeleteDialogOpened: false,
  selectedUserRoleId: undefined,
  isPolicyDetailsDialogOpened: false,
  selectedApprovalPolicyId: undefined,
};

const rolesPoliciesReducer = (
  state: RolesPoliciesState,
  action: RoleAction | PolicyAction
): RolesPoliciesState => {
  switch (action.type) {
    case 'OPEN_ROLE_DETAILS':
      return {
        ...state,
        selectedUserRoleId: action.payload,
        isRoleDetailsDialogOpened: true,
      };
    case 'CLOSE_ROLE_DETAILS':
      return { ...state, isRoleDetailsDialogOpened: false };
    case 'OPEN_ROLE_EDIT':
      return { ...state, isRoleEditDialogOpened: true };
    case 'CLOSE_ROLE_EDIT':
      return { ...state, isRoleEditDialogOpened: false };
    case 'OPEN_ROLE_DELETE':
      return { ...state, isRoleDeleteDialogOpened: true };
    case 'CLOSE_ROLE_DELETE':
      return { ...state, isRoleDeleteDialogOpened: false };
    case 'ROLE_DELETED':
      return {
        ...state,
        selectedUserRoleId: undefined,
        isRoleDeleteDialogOpened: false,
        isRoleEditDialogOpened: false,
        isRoleDetailsDialogOpened: false,
      };
    case 'OPEN_ROLE_CREATE':
      return {
        ...state,
        selectedUserRoleId: undefined,
        isRoleEditDialogOpened: true,
      };
    case 'OPEN_POLICY_DETAILS':
      return {
        ...state,
        selectedApprovalPolicyId: action.payload,
        isPolicyDetailsDialogOpened: true,
      };
    case 'CLOSE_POLICY_DETAILS':
      return { ...state, isPolicyDetailsDialogOpened: false };
    case 'OPEN_POLICY_CREATE':
      return {
        ...state,
        selectedApprovalPolicyId: undefined,
        isPolicyDetailsDialogOpened: true,
      };
    default:
      return state;
  }
};

const RolesAndApprovalPoliciesBase = () => {
  const { i18n } = useLingui();

  const [activeTab, setActiveTab] = useState<PageTabEnum>(PageTabEnum.Roles);
  const [open, setOpen] = useState(false);

  const [state, dispatch] = useReducer(rolesPoliciesReducer, initialState);
  const { root } = useRootElements();

  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadPolicyAllowed, isLoading: isReadPolicyAllowedLoading } =
    useIsActionAllowed({
      method: 'approval_policy',
      action: 'read',
      entityUserId: user?.id,
    });
  const {
    data: isCreatePolicyAllowed,
    isLoading: isCreatePolicyAllowedLoading,
  } = useIsActionAllowed({
    method: 'approval_policy',
    action: 'create',
    entityUserId: user?.id,
  });

  // The following code duplicates state found in UserRoles.tsx and ApprovalPolicies.tsx
  const { data: isReadRoleAllowed, isLoading: isReadRoleAllowedLoading } =
    useIsActionAllowed({
      method: 'role',
      action: 'read',
      entityUserId: user?.id,
    });
  const { data: isCreateRoleAllowed, isLoading: isCreateRoleAllowedLoading } =
    useIsActionAllowed({
      method: 'role',
      action: 'create',
      entityUserId: user?.id,
    });

  const isRolesTab = activeTab == PageTabEnum.Roles;
  const isLoadingPermissions =
    isReadPolicyAllowedLoading ||
    isCreatePolicyAllowedLoading ||
    isReadRoleAllowedLoading ||
    isCreateRoleAllowedLoading;

  const isAccessRestricted =
    (isRolesTab && !isReadRoleAllowed && !isReadRoleAllowedLoading) ||
    (!isRolesTab && !isReadPolicyAllowed && !isReadPolicyAllowedLoading);
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const tabIdPrefix = `ReceivablesTable-Tab-${useId()}-`;
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const tabPanelIdPrefix = `ReceivablesTable-TabPanel-${useId()}-`;
  const className = 'Monite-RolesAndPoliciesTable';

  return (
    <>
      <PageHeader
        title={
          <>
            {t(i18n)`Roles & Approvals`}
            {isLoadingPermissions && (
              <CircularProgress size="0.7em" color="secondary" sx={{ ml: 1 }} />
            )}
          </>
        }
        extra={
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                disabled={!isCreateRoleAllowed && !isCreatePolicyAllowed}
              >
                {t(i18n)`Create new`}
                {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mtw:w-56" align="end">
              <DropdownMenuItem
                disabled={!isCreateRoleAllowed}
                onClick={() => {
                  setActiveTab(PageTabEnum.Roles);
                  dispatch({ type: 'OPEN_ROLE_CREATE' });
                }}
              >
                {t(i18n)`User role`}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!isCreatePolicyAllowed}
                onClick={() => {
                  setActiveTab(PageTabEnum.Policies);
                  dispatch({ type: 'OPEN_POLICY_CREATE' });
                }}
              >
                {t(i18n)`Approval policy`}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <Box
        className={classNames(
          ScopedCssBaselineContainerClassName,
          className + '-Tabs'
        )}
      >
        <Tabs
          value={activeTab}
          variant="standard"
          aria-label={t(i18n)`Receivables tabs`}
          onChange={(_, value) => setActiveTab(value)}
        >
          <Tab
            id={`${tabIdPrefix}-${PageTabEnum.Roles}`}
            aria-controls={`${tabPanelIdPrefix}-${PageTabEnum.Roles}`}
            label={t(i18n)`User roles`}
            value={PageTabEnum.Roles}
          />

          <Tab
            id={`${tabIdPrefix}-${PageTabEnum.Policies}`}
            aria-controls={`${tabPanelIdPrefix}-${PageTabEnum.Policies}`}
            label={t(i18n)`Approval policies`}
            value={PageTabEnum.Policies}
          />
        </Tabs>
      </Box>

      {isAccessRestricted && <AccessRestriction />}
      {!isRolesTab && isReadPolicyAllowed && (
        <ApprovalPoliciesTable
          onRowClick={(approvalPolicy) =>
            dispatch({
              type: 'OPEN_POLICY_DETAILS',
              payload: approvalPolicy.id,
            })
          }
          onCreateClick={() => dispatch({ type: 'OPEN_POLICY_CREATE' })}
        />
      )}
      {isRolesTab && isReadRoleAllowed && (
        <UserRolesTable
          onRowClick={(id: string) =>
            dispatch({ type: 'OPEN_ROLE_DETAILS', payload: id })
          }
          handleCreateNew={() => dispatch({ type: 'OPEN_ROLE_CREATE' })}
        />
      )}

      <Dialog
        open={state.isPolicyDetailsDialogOpened}
        alignDialog="right"
        onClose={() => dispatch({ type: 'CLOSE_POLICY_DETAILS' })}
      >
        <ApprovalPolicyDetails id={state.selectedApprovalPolicyId} />
      </Dialog>

      <Dialog
        open={state.isRoleDetailsDialogOpened}
        alignDialog="right"
        onClose={() => dispatch({ type: 'CLOSE_ROLE_DETAILS' })}
      >
        <UserRoleDetailsDialog
          id={state.selectedUserRoleId}
          onClickEditRole={() => dispatch({ type: 'OPEN_ROLE_EDIT' })}
          onClickDeleteRole={() => dispatch({ type: 'OPEN_ROLE_DELETE' })}
        />
      </Dialog>

      <Dialog
        fullScreen
        open={state.isRoleEditDialogOpened}
        onClose={() => dispatch({ type: 'CLOSE_ROLE_EDIT' })}
      >
        <UserRoleEditDialog
          id={state.selectedUserRoleId}
          onCreated={() => dispatch({ type: 'CLOSE_ROLE_EDIT' })}
          onUpdated={() => dispatch({ type: 'CLOSE_ROLE_EDIT' })}
          onClickDeleteRole={() => dispatch({ type: 'OPEN_ROLE_DELETE' })}
        />
      </Dialog>

      <Dialog
        open={state.isRoleDeleteDialogOpened}
        onClose={() => dispatch({ type: 'CLOSE_ROLE_DELETE' })}
        fullWidth
        maxWidth="sm"
      >
        <UserRoleDeleteDialog
          id={state.selectedUserRoleId}
          onDeleted={() => dispatch({ type: 'ROLE_DELETED' })}
        />
      </Dialog>
    </>
  );
};
