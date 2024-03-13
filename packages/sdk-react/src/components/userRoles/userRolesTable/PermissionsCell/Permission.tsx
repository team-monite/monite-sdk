import { ReactElement, useMemo } from 'react';

import {
  ACTION_TO_LATTER_MAP,
  actionOrder,
  getActionToLabelMap,
} from '@/components/userRoles/consts';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ActionSchema,
  PayableActionSchema,
  PermissionEnum,
} from '@monite/sdk-api';
import { styled, Tooltip } from '@mui/material';

interface Props {
  /**
   *
   * @param actions - The actions data for the role to be displayed.
   */
  actions: ActionSchema[] | PayableActionSchema[];
}

const normalizeActions = (actions: (ActionSchema | PayableActionSchema)[]) => {
  return (Object.keys(actionOrder) as Array<keyof typeof actionOrder>).map(
    (actionName) => {
      const existingAction = actions.find(
        (action) => action.action_name === actionName
      );

      return (
        existingAction || {
          action_name: actionName,
          permission: undefined,
        }
      );
    }
  );
};

const StyledPermission = styled('span')(({ theme }) => ({
  display: 'inline-block',
  fontWeight: 600,
  width: 14,
  textAlign: 'center',
}));

const StyledActivePermission = styled(StyledPermission)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const StyledInactivePermission = styled(StyledPermission)(({ theme }) => ({
  color: theme.palette.grey[500],
}));

/**
 * @function Permission
 * @description This is the component for rendering the permissions actions of each action in a tooltip.
 * The permissions are represented by different styled spans based on the permission type.
 * The actions are normalized and sorted before rendering.
 */
export const Permission = ({ actions }: Props) => {
  const { i18n } = useLingui();
  const normalizedActions = useMemo(() => normalizeActions(actions), [actions]);
  const sortedActions = useMemo(
    () =>
      normalizedActions.sort((a, b) => {
        if (a.action_name === undefined && b.action_name === undefined) {
          return 0;
        }

        const aOrder = a.action_name ? actionOrder[a.action_name] : undefined;
        const bOrder = b.action_name ? actionOrder[b.action_name] : undefined;

        if (aOrder === undefined) {
          return 1;
        }
        if (bOrder === undefined) {
          return -1;
        }

        return aOrder - bOrder;
      }),
    [normalizedActions]
  );
  const renderedActions: ReactElement[] = [];
  const renderedActionsTooltip: ReactElement[] = [];

  sortedActions.forEach((action) => {
    if (action.action_name) {
      /** Current UI doesn't reflect the difference between ALLOWED and ALLOWED_FOR_OWN.
       * It will be improved in further iterations
       */
      if (
        action.permission === PermissionEnum.ALLOWED ||
        action.permission === PermissionEnum.ALLOWED_FOR_OWN
      ) {
        renderedActions.push(
          <StyledActivePermission key={action.action_name}>
            {ACTION_TO_LATTER_MAP[action.action_name]}
          </StyledActivePermission>
        );
        renderedActionsTooltip.push(
          <p key={action.action_name}>
            {`[${ACTION_TO_LATTER_MAP[action.action_name]}] ${
              getActionToLabelMap(i18n)[action.action_name]
            } — ${t(i18n)`Allowed`}`}
          </p>
        );
      } else if (action.permission === PermissionEnum.NOT_ALLOWED) {
        renderedActions.push(
          <StyledInactivePermission key={action.action_name}>
            -
          </StyledInactivePermission>
        );
        renderedActionsTooltip.push(
          <p key={action.action_name}>
            {`[${ACTION_TO_LATTER_MAP[action.action_name]}] ${
              getActionToLabelMap(i18n)[action.action_name]
            } — ${t(i18n)`NOT allowed`}`}
          </p>
        );
      } else {
        renderedActions.push(
          <StyledPermission key={action.action_name}> </StyledPermission>
        );
      }
    }
  });

  return (
    <Tooltip
      arrow
      title={
        renderedActionsTooltip.length ? (
          <span>{renderedActionsTooltip}</span>
        ) : null
      }
    >
      <span>{renderedActions}</span>
    </Tooltip>
  );
};
