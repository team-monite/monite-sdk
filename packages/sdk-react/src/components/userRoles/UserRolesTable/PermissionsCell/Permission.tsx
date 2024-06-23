'use client';

import React from 'react';

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

interface PermissionProps {
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

const StyledPermission = styled('span')`
  display: inline-block;
  font-weight: 600;
  width: 14px;
  text-align: center;
`;

const StyledActivePermission = styled(StyledPermission)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const StyledInactivePermission = styled(StyledPermission)(({ theme }) => ({
  color: theme.palette.grey[500],
}));

export const Permission = ({ actions }: PermissionProps) => {
  const { i18n } = useLingui();
  const normalizedActions = normalizeActions(actions);
  const sortedActions = [...normalizedActions].sort((a, b) => {
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
  });

  const renderAction = (action: ActionSchema | PayableActionSchema) => {
    if (!action.action_name) return { element: null, tooltip: null };

    if (
      action.permission === PermissionEnum.ALLOWED ||
      action.permission === PermissionEnum.ALLOWED_FOR_OWN
    ) {
      return {
        element: (
          <StyledActivePermission key={action.action_name}>
            {ACTION_TO_LATTER_MAP[action.action_name]}
          </StyledActivePermission>
        ),
        tooltip: (
          <p key={action.action_name}>
            {`[${ACTION_TO_LATTER_MAP[action.action_name]}] ${
              getActionToLabelMap(i18n)[action.action_name]
            } — ${t(i18n)`Allowed`}`}
          </p>
        ),
      };
    } else if (action.permission === PermissionEnum.NOT_ALLOWED) {
      return {
        element: (
          <StyledInactivePermission key={action.action_name}>
            -
          </StyledInactivePermission>
        ),
        tooltip: (
          <p key={action.action_name}>
            {`[${ACTION_TO_LATTER_MAP[action.action_name]}] ${
              getActionToLabelMap(i18n)[action.action_name]
            } — ${t(i18n)`NOT allowed`}`}
          </p>
        ),
      };
    }

    return {
      element: <StyledPermission key={action.action_name}> </StyledPermission>,
      tooltip: null,
    };
  };

  const actionsToRender = sortedActions
    .map(renderAction)
    .filter(({ element }) => element);
  const renderedActions = actionsToRender.map(({ element }) => element);
  const renderedActionsTooltip = actionsToRender.map(({ tooltip }) => tooltip);

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
