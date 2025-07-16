import { ReactNode, useMemo } from 'react';

import { components } from '@/api/schema';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import {
  type Rules,
  useApprovalPolicyScript,
} from '../../useApprovalPolicyScript';
import { Role } from '../ApprovalPolicyView/Role';
import { User } from '../ApprovalPolicyView/User';

type Rule = {
  single_user?: components['schemas']['EntityUserResponse'];
  users_from_list?: components['schemas']['EntityUserResponse'][];
  roles_from_list?: components['schemas']['RoleResponse'][];
  approval_chain?: components['schemas']['EntityUserResponse'][];
};

interface RulesTableProps {
  rules: Rule;
  usersFromListCount?: string | number;
  rolesFromListCount?: string | number;
  onAddRule: () => void;
  onEditRule: (ruleKey: keyof Rules) => void;
  onDeleteRule: (ruleKey: keyof Rules) => void;
}

export const RulesTable = ({
  rules,
  usersFromListCount,
  rolesFromListCount,
  onAddRule,
  onEditRule,
  onDeleteRule,
}: RulesTableProps) => {
  const { i18n } = useLingui();
  const { getRuleLabel } = useApprovalPolicyScript({});

  const rulesList = useMemo(() => {
    return (Object.keys(rules) as Array<keyof Rules>).map((ruleKey) => {
      let ruleLabel: string | undefined;
      let ruleValue: ReactNode;

      switch (ruleKey) {
        case 'users_from_list':
          ruleLabel = getRuleLabel(
            ruleKey,
            (typeof usersFromListCount === 'string'
              ? parseInt(usersFromListCount)
              : usersFromListCount) || 0
          );
          break;
        case 'roles_from_list':
          ruleLabel = getRuleLabel(
            ruleKey,
            typeof rolesFromListCount === 'string'
              ? parseInt(rolesFromListCount)
              : rolesFromListCount || 0
          );
          break;
        default:
          ruleLabel = getRuleLabel(ruleKey);
      }

      switch (ruleKey) {
        case 'single_user':
          ruleValue = (
            <Stack
              direction="column"
              spacing={0.5}
              sx={{
                overflow: 'hidden',
              }}
            >
              {rules.single_user?.id && (
                <User
                  key={rules.single_user?.id}
                  userId={rules.single_user?.id}
                />
              )}
            </Stack>
          );
          break;
        case 'users_from_list':
          ruleValue = (
            <Stack
              direction="column"
              spacing={0.5}
              sx={{
                overflow: 'hidden',
              }}
            >
              {rules?.users_from_list?.map((user) => (
                <User key={user.id} userId={user.id} />
              ))}
            </Stack>
          );
          break;
        case 'roles_from_list':
          ruleValue = (
            <Stack
              direction="row"
              gap={1}
              flexWrap="wrap"
              useFlexGap
              sx={{
                '& > *': {
                  flexShrink: 0,
                },
              }}
            >
              {rules.roles_from_list?.map((role) => (
                <Role key={role.id} roleId={role.id} />
              ))}
            </Stack>
          );
          break;
        case 'approval_chain':
          ruleValue = (
            <Stack
              direction="column"
              spacing={0.5}
              sx={{
                overflow: 'hidden',
              }}
            >
              {rules?.approval_chain?.map((user) => (
                <User key={user.id} userId={user.id} />
              ))}
            </Stack>
          );
          break;
      }

      return {
        key: ruleKey,
        label: ruleLabel,
        value: ruleValue,
      };
    });
  }, [rules, usersFromListCount, getRuleLabel, rolesFromListCount]);

  return (
    <Paper variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t(i18n)`Condition`}</TableCell>
            <TableCell>{t(i18n)`Criteria`}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rulesList.length > 0 ? (
            rulesList.map((rule) => (
              <TableRow
                key={rule.label}
                hover
                sx={{
                  '&.MuiTableRow-root': { cursor: 'pointer' },
                }}
                onClick={() => onEditRule(rule.key)}
              >
                <TableCell>{rule.label}</TableCell>
                <TableCell>{rule.value}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label={t(i18n)`Delete trigger`}
                    onClick={(e) => {
                      e.stopPropagation();

                      onDeleteRule(rule.key);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>{t(i18n)`No rules`}</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={3}>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={onAddRule}
                disabled={
                  Boolean(rules.single_user) &&
                  (rules.users_from_list?.length ?? 0) > 0 &&
                  (rules.roles_from_list?.length ?? 0) > 0 &&
                  (rules.approval_chain?.length ?? 0) > 0
                }
              >
                {t(i18n)`Add new rule`}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};
