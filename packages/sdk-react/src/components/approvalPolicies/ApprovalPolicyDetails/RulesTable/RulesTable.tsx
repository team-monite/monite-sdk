import React, { ReactNode, useMemo } from 'react';

import { Role } from '@/components/approvalPolicies/ApprovalPolicyDetails/ApprovalPolicyView/Role';
import { User } from '@/components/approvalPolicies/ApprovalPolicyDetails/ApprovalPolicyView/User';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { useApprovalPolicyScript, Rules } from '../../useApprovalPolicyScript';
import { FormValues } from '../ApprovalPolicyForm';

interface RulesTableProps {
  rules: FormValues['rules'];
  onAddRule: () => void;
  onEditRule: (ruleKey: keyof FormValues['rules']) => void;
  onDeleteRule: (ruleKey: keyof FormValues['rules']) => void;
}

export const RulesTable = ({
  rules,
  onAddRule,
  onEditRule,
  onDeleteRule,
}: RulesTableProps) => {
  const { i18n } = useLingui();
  const { getRuleLabel } = useApprovalPolicyScript({});

  const rulesList = useMemo(() => {
    return (Object.keys(rules) as Array<keyof Rules>).map((ruleKey) => {
      const ruleLabel = getRuleLabel(ruleKey);
      let ruleValue: ReactNode;

      switch (ruleKey) {
        case 'single_user':
          ruleValue = (
            <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
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
            <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
              {rules?.users_from_list?.map((user) => (
                <User key={user.id} userId={user.id} />
              ))}
            </Stack>
          );
          break;
        case 'roles_from_list':
          ruleValue = (
            <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
              {rules.roles_from_list?.map((role) => (
                <Role key={role.id} roleId={role.id} />
              ))}
            </Stack>
          );
          break;
        case 'approval_chain':
          ruleValue = (
            <List>
              {rules?.approval_chain?.map((user) => (
                <ListItem>
                  <User key={user.id} userId={user.id} />
                </ListItem>
              ))}
            </List>
          );
          break;
      }

      return {
        key: ruleKey,
        label: ruleLabel,
        value: ruleValue,
      };
    });
  }, [rules, getRuleLabel]);

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
                {t(i18n)`Add new condition`}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};
