import { ReactNode, useId, useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useDialog } from '@/components';
import { AutocompleteUsers } from '@/components/approvalPolicies/ApprovalPolicyDetails/ApprovalPolicyForm/AutocompleteUsers';
import { User } from '@/components/approvalPolicies/ApprovalPolicyDetails/ApprovalPolicyView/User';
import {
  useApprovalPolicyTrigger,
  ApprovalPoliciesTriggerKey,
} from '@/components/approvalPolicies/useApprovalPolicyTrigger';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Breadcrumbs,
  DialogTitle,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  DialogActions,
} from '@mui/material';

interface ApprovalPolicyFormProps {
  /** Approval policy to be updated */
  approvalPolicy: components['schemas']['ApprovalPolicyResource'];

  /** Callback is fired when Edit button is clicked */
  setIsEdit: (isEdit: boolean) => void;
}

export interface FormValues {
  name: string;
  description: string;
  triggerType: ApprovalPoliciesTriggerKey;
  triggers: {
    was_created_by_user_id: components['schemas']['EntityUserResponse'][];
  };
}

export const ApprovalPolicyForm = ({
  approvalPolicy,
  setIsEdit,
}: ApprovalPolicyFormProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { api, queryClient } = useMoniteContext();
  const formId = `Monite-Form-approvalPolicyBuilder-${useId()}`;
  const { triggers, getTriggerName, getTriggerLabel } =
    useApprovalPolicyTrigger({
      approvalPolicy,
    });
  const [triggerInEdit, setTriggerInEdit] =
    useState<ApprovalPoliciesTriggerKey | null>(null);

  const { data: users } = api.entityUsers.getEntityUsers.useQuery({
    query: {
      id__in: Array.isArray(triggers.was_created_by_user_id)
        ? triggers.was_created_by_user_id
        : [],
    },
  });

  const updateMutation =
    api.approvalPolicies.patchApprovalPoliciesId.useMutation(undefined, {
      onSuccess: async (updatedApprovalPolicy) => {
        await Promise.all([
          api.approvalPolicies.getApprovalPolicies.invalidateQueries(
            queryClient
          ),
          api.approvalPolicies.getApprovalPoliciesId.invalidateQueries(
            {
              parameters: {
                path: { approval_policy_id: updatedApprovalPolicy.id },
              },
            },
            queryClient
          ),
        ]);
        toast.success(t(i18n)`Approval policy updated`);
      },

      onError: async () => {
        toast.error(t(i18n)`Error updating approval policy`);
      },
    });

  const updateApprovalPolicy = async (
    id: string,
    values: components['schemas']['ApprovalPolicyUpdate']
  ) => {
    const response = await updateMutation.mutateAsync({
      path: {
        approval_policy_id: id,
      },
      body: values,
    });

    if (response) {
      setIsEdit(false);
      // onUpdated?.(response.id);
      // onChangeEditMode(false);
    }

    return response;
  };

  const methods = useForm<FormValues>({
    defaultValues: {
      name: approvalPolicy?.name || '',
      description: approvalPolicy?.description || '',
      triggers: {
        was_created_by_user_id: [],
      },
    },
  });
  const { control, handleSubmit, setValue, getValues, reset } = methods;

  const triggersList = Object.keys(getValues('triggers')).map((triggerKey) => {
    const triggerLabel = getTriggerLabel(triggerKey);
    let triggerValue: ReactNode;

    switch (triggerKey) {
      case 'was_created_by_user_id':
        triggerValue = (
          <Stack gap={1}>
            {getValues('triggers')['was_created_by_user_id'].map((user) => (
              <User key={user.id} userId={user.id} />
            ))}
          </Stack>
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
  });

  useEffect(() => {
    if (users?.data) {
      reset({
        triggers: {
          was_created_by_user_id:
            users?.data.filter((user) =>
              triggers.was_created_by_user_id?.includes(user.id)
            ) || [],
        },
      });
    }
  }, [users?.data, reset, triggers.was_created_by_user_id]);

  useEffect(() => {
    if (triggerInEdit) {
      setValue('triggerType', triggerInEdit);
    }
  }, [setValue, triggerInEdit]);

  return (
    <>
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          {triggerInEdit ? (
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setValue(
                    'triggers.was_created_by_user_id',
                    users?.data.filter((user) =>
                      triggers.was_created_by_user_id?.includes(user.id)
                    ) || []
                  );
                  setTriggerInEdit(null);
                }}
              >
                {t(i18n)`Edit Approval Policy`}
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                {t(i18n)`Edit Condition`}
              </Typography>
            </Breadcrumbs>
          ) : (
            <Typography variant="h3" sx={{ wordBreak: 'break-word' }}>
              {t(i18n)`Edit Approval Policy`}
            </Typography>
          )}
          {dialogContext?.isDialogContent && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={dialogContext.onClose}
              aria-label={t(i18n)`Close approval policy details`}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <FormProvider {...methods}>
          <form
            id={formId}
            noValidate
            onSubmit={handleSubmit((values) => {
              const body = {
                name: values.name,
                description: values.description,
                trigger: {
                  all: [
                    "{event_name == 'submitted_for_approval'}",
                    {
                      operator: 'in',
                      left_operand: {
                        name: 'invoice.was_created_by_user_id',
                      },
                      right_operand: values.triggers.was_created_by_user_id.map(
                        (user) => user.id
                      ),
                    },
                  ],
                },
                // TODO: remove this script after demo
                script: [
                  {
                    call: 'ApprovalRequests.request_approval_by_users',
                    params: {
                      user_ids: ['84cd3950-417b-4018-811e-6f19064b44e8'],
                      required_approval_count: 1,
                    },
                  },
                ],
              };

              // @ts-expect-error - `trigger` is not covered by the schema
              updateApprovalPolicy(approvalPolicy.id, body);
            })}
          >
            <Stack gap={3}>
              {triggerInEdit && (
                <>
                  <RHFTextField
                    label={t(i18n)`Condition type`}
                    name="triggerType"
                    control={control}
                    fullWidth
                    required
                    select
                    value={triggerInEdit}
                    disabled={Boolean(triggerInEdit)}
                  >
                    <MenuItem value="amount">
                      {getTriggerName('amount')}
                    </MenuItem>
                    <MenuItem value="counterpart_id">
                      {getTriggerName('counterpart_id')}
                    </MenuItem>
                    <MenuItem value="currency">
                      {getTriggerName('currency')}
                    </MenuItem>
                    <MenuItem value="was_created_by_user_id">
                      {getTriggerName('was_created_by_user_id')}
                    </MenuItem>
                    <MenuItem value="tags">{getTriggerName('tags')}</MenuItem>
                  </RHFTextField>
                </>
              )}
              {triggerInEdit === 'was_created_by_user_id' && (
                <AutocompleteUsers control={control} label={t(i18n)`Users`} />
              )}
              {!triggerInEdit && (
                <>
                  <RHFTextField
                    label={t(i18n)`Policy Name`}
                    name="name"
                    control={control}
                    fullWidth
                    required
                  />
                  <RHFTextField
                    label={t(i18n)`Description`}
                    name="description"
                    control={control}
                    fullWidth
                    required
                    multiline
                    rows={4}
                  />
                  <Box>
                    <Typography variant="h5" mt={4} mb={1}>
                      {t(i18n)`Conditions`}
                    </Typography>
                    <Typography variant="body1" mb={1}>
                      <Trans>
                        Policy will be applied if document matches{' '}
                        <strong>ALL</strong> of the following conditions:
                      </Trans>
                    </Typography>
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
                                onClick={() => setTriggerInEdit(trigger.key)}
                              >
                                <TableCell>{trigger.label}</TableCell>
                                <TableCell>{trigger.value}</TableCell>
                                <TableCell>
                                  <IconButton
                                    aria-label={t(i18n)`Delete trigger`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log('delete trigger');
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3}>
                                {t(i18n)`No conditions`}
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell colSpan={3}>
                              <Button startIcon={<AddCircleOutlineIcon />}>
                                {t(i18n)`Add new condition`}
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Paper>
                  </Box>
                </>
              )}
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
      <Divider />
      <DialogActions>
        {triggerInEdit ? (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setValue(
                  'triggers.was_created_by_user_id',
                  users?.data.filter((user) =>
                    triggers.was_created_by_user_id?.includes(user.id)
                  ) || []
                );
                setTriggerInEdit(null);
              }}
            >{t(i18n)`Cancel`}</Button>
            <Button
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                setTriggerInEdit(null);
              }}
            >{t(i18n)`Update`}</Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setIsEdit(false);
              }}
            >
              {t(i18n)`Cancel`}
            </Button>
            <Button
              variant="contained"
              type="submit"
              form={formId}
              disabled={updateMutation.isPending}
            >{t(i18n)`Save`}</Button>
          </>
        )}
      </DialogActions>
    </>
  );
};
