import { ReactNode, useMemo } from 'react';

import { components } from '@/api';
import { User } from '@/components/approvalPolicies/ApprovalPolicyDetails/ApprovalPolicyView/User';
import { CounterpartsAutocompleteOptionProps } from '@/components/counterparts/components';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Chip,
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
  useApprovalPolicyTrigger,
  AmountTuple,
} from '../../useApprovalPolicyTrigger';

type Triggers = {
  was_created_by_user_id?: components['schemas']['EntityUserResponse'][];
  tags?: components['schemas']['TagReadSchema'][];
  counterpart_id?: CounterpartsAutocompleteOptionProps[];
  amount?: {
    currency: components['schemas']['CurrencyEnum'];
    value: AmountTuple[];
  };
};

interface ConditionsTableProps {
  triggers: Triggers;
  onAddTrigger: () => void;
  onEditTrigger: (triggerKey: keyof Triggers) => void;
  onDeleteTrigger: (triggerKey: keyof Triggers) => void;
}

export const ConditionsTable = ({
  triggers,
  onAddTrigger,
  onEditTrigger,
  onDeleteTrigger,
}: ConditionsTableProps) => {
  const { i18n } = useLingui();
  const { getTriggerLabel, getAmountLabel } = useApprovalPolicyTrigger({});

  const triggersList = useMemo(() => {
    return (Object.keys(triggers) as Array<keyof Triggers>).map(
      (triggerKey) => {
        const triggerLabel = getTriggerLabel(triggerKey);
        let triggerValue: ReactNode;

        switch (triggerKey) {
          case 'was_created_by_user_id':
            triggerValue = (
              <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                {triggers.was_created_by_user_id?.map((user) => (
                  <User key={user.id} userId={user.id} />
                ))}
              </Stack>
            );
            break;
          case 'tags':
            triggerValue = (
              <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                {triggers.tags?.map((tag) => (
                  <Chip key={tag.id} label={tag.name} />
                ))}
              </Stack>
            );
            break;
          case 'counterpart_id':
            triggerValue = (
              <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                {triggers.counterpart_id?.map((counterpart) => {
                  return (
                    <Chip key={counterpart.id} label={counterpart.label} />
                  );
                })}
              </Stack>
            );
            break;
          case 'amount':
            triggerValue = (
              <p>
                {getAmountLabel(
                  triggers.amount?.value ?? [],
                  triggers.amount?.currency ?? 'EUR'
                )}
              </p>
            );
            break;
          default:
            triggerValue = triggerKey;
            break;
        }

        return {
          key: triggerKey,
          label: triggerLabel,
          value: triggerValue,
        };
      }
    );
  }, [triggers, getTriggerLabel, getAmountLabel]);

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
          {triggersList.length > 0 ? (
            triggersList.map((trigger) => (
              <TableRow
                key={trigger.label}
                hover
                sx={{
                  '&.MuiTableRow-root': { cursor: 'pointer' },
                }}
                onClick={() => onEditTrigger(trigger.key)}
              >
                <TableCell>{trigger.label}</TableCell>
                <TableCell>{trigger.value}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label={t(i18n)`Delete trigger`}
                    onClick={(e) => {
                      e.stopPropagation();

                      onDeleteTrigger(trigger.key);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>{t(i18n)`No conditions`}</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={3}>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={onAddTrigger}
                disabled={Boolean(
                  triggers?.was_created_by_user_id?.length &&
                    triggers?.tags?.length &&
                    triggers?.counterpart_id?.length &&
                    triggers?.amount?.value?.length
                )}
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
