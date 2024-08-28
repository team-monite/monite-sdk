import { ReactNode, useId, useState, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useDialog } from '@/components';
import { User } from '@/components/approvalPolicies/ApprovalPolicyDetails/ApprovalPolicyView/User';
import {
  useApprovalPolicyScript,
  ApprovalPoliciesScriptTypes,
} from '@/components/approvalPolicies/useApprovalPolicyScript';
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

import { ConditionsTable } from '../ConditionsTable';
import { AutocompleteCounterparts } from './AutocompleteCounterparts';
import { AutocompleteTags } from './AutocompleteTags';
import { AutocompleteUsers } from './AutocompleteUsers';

interface ApprovalPolicyFormProps {
  /** Approval policy to be updated */
  approvalPolicy?: components['schemas']['ApprovalPolicyResource'];

  /** Callback is fired when Edit button is clicked */
  setIsEdit: (isEdit: boolean) => void;

  /** Callback is fired when a policy is created and sync with server is successful */
  onCreated?: (id: string) => void;
}

export interface FormValues {
  name: string;
  description: string;
  triggerType: ApprovalPoliciesTriggerKey | null;
  triggers: {
    was_created_by_user_id: components['schemas']['EntityUserResponse'][];
    tags: components['schemas']['TagReadSchema'][];
    counterpart_id: components['schemas']['CounterpartResponse'][];
  };
  scriptType: ApprovalPoliciesScriptTypes;
  script: {
    params?: {
      users?: components['schemas']['EntityUserResponse'][];
      requiredApprovalCount: number | string;
    };
  };
}

export const ApprovalPolicyForm = ({
  approvalPolicy,
  setIsEdit,
  onCreated,
}: ApprovalPolicyFormProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { api, queryClient } = useMoniteContext();
  const isEdit = !!approvalPolicy;

  const formId = `Monite-Form-approvalPolicyBuilder-${useId()}`;

  const { triggers, getTriggerName } = useApprovalPolicyTrigger({
    approvalPolicy,
  });
  const { script } = useApprovalPolicyScript({ approvalPolicy });

  const [isAddingTrigger, setIsAddingTrigger] = useState<boolean>(false);
  const [triggerInEdit, setTriggerInEdit] =
    useState<ApprovalPoliciesTriggerKey | null>(null);
  const [prevTriggerValues, setPrevTriggerValues] = useState<
    FormValues['triggers'] | null
  >(null);
  const [scriptInEdit, setScriptInEdit] =
    useState<ApprovalPoliciesScriptTypes | null>(null);

  const { data: usersForTriggers } = api.entityUsers.getEntityUsers.useQuery(
    {
      query: {
        id__in: Array.isArray(triggers?.was_created_by_user_id)
          ? triggers.was_created_by_user_id
          : [],
      },
    },
    {
      enabled: Boolean(triggers?.was_created_by_user_id?.length),
    }
  );
  const { data: tagsForTriggers } = api.tags.getTags.useQuery(
    {
      query: {
        id__in: Array.isArray(triggers?.tags) ? triggers.tags : [],
      },
    },
    {
      enabled: Boolean(triggers?.tags?.length),
    }
  );
  const { data: counterpartsForTriggers } =
    api.counterparts.getCounterparts.useQuery(
      {
        query: {
          id__in: Array.isArray(triggers?.counterpart_id)
            ? triggers.counterpart_id
            : [],
        },
      },
      {
        enabled: Boolean(triggers?.counterpart_id?.length),
      }
    );
  const { data: usersForScript } = api.entityUsers.getEntityUsers.useQuery(
    {
      query: {
        id__in: Array.isArray(script?.params.user_ids)
          ? script.params.user_ids
          : [],
      },
    },
    {
      enabled: Boolean(script?.params?.user_ids?.length),
    }
  );

  const createMutation = api.approvalPolicies.postApprovalPolicies.useMutation(
    {},
    {
      onSuccess: async (createdApprovalPolicy) => {
        await Promise.all([
          api.approvalPolicies.getApprovalPolicies.invalidateQueries(
            queryClient
          ),
          api.approvalPolicies.getApprovalPoliciesId.invalidateQueries(
            {
              parameters: {
                path: { approval_policy_id: createdApprovalPolicy.id },
              },
            },
            queryClient
          ),
        ]);
        toast.success(t(i18n)`Approval policy created`);
      },

      onError: async () => {
        toast.error(t(i18n)`Error creating approval policy`);
      },
    }
  );
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

  const createApprovalPolicy = async (
    values: components['schemas']['ApprovalPolicyCreate']
  ) => {
    const response = await createMutation.mutateAsync(values);

    if (response) {
      setIsEdit(false);
      onCreated?.(response.id);

      return response;
    }
  };
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
    }

    return response;
  };

  const methods = useForm<FormValues>({
    defaultValues: {
      name: approvalPolicy?.name || '',
      description: approvalPolicy?.description || '',
      triggers: {},
      script: {},
    },
  });
  const { control, handleSubmit, setValue, getValues, watch } = methods;
  const currentTriggers = watch('triggers');
  const currentTriggerType = watch('triggerType');
  const currentScript = watch('script');
  const currentScriptType = watch('scriptType');
  const currentRequiredApprovalCount = watch(
    'script.params.requiredApprovalCount'
  );

  const approvalFlow = useMemo(() => {
    const currentUsers = currentScript.params?.users;

    if (!script.params) return null;

    let approvalFlowLabel: string;
    let approvalFlowValue: ReactNode;

    switch (isEdit ? script.type : currentScriptType) {
      case 'ApprovalRequests.request_approval_by_users':
        approvalFlowLabel =
          currentRequiredApprovalCount === '1'
            ? t(i18n)`Any user from the list`
            : t(i18n)`Any ${currentRequiredApprovalCount} users from the list`;
        approvalFlowValue = (
          <Stack gap={1}>
            {currentUsers?.map((user) => (
              <User key={user.id} userId={user.id} />
            ))}
          </Stack>
        );
        return {
          key: currentScriptType,
          label: approvalFlowLabel,
          value: approvalFlowValue,
        };
      default:
        break;
    }
  }, [
    currentScript,
    currentScriptType,
    currentRequiredApprovalCount,
    i18n,
    isEdit,
    script.params,
    script.type,
  ]);

  useEffect(() => {
    if (!isEdit) return;

    if (usersForTriggers?.data && usersForTriggers?.data.length > 0) {
      setValue(
        'triggers.was_created_by_user_id',
        usersForTriggers?.data.filter((user) =>
          triggers.was_created_by_user_id?.includes(user.id)
        ) || []
      );
    }

    if (tagsForTriggers?.data && tagsForTriggers?.data.length > 0) {
      setValue(
        'triggers.tags',
        tagsForTriggers?.data.filter((tag) =>
          triggers.tags?.includes(tag.id)
        ) || []
      );
    }

    if (
      counterpartsForTriggers?.data &&
      counterpartsForTriggers?.data.length > 0
    ) {
      setValue(
        'triggers.counterpart_id',
        counterpartsForTriggers?.data.filter((counterpart) =>
          triggers.counterpart_id?.includes(counterpart.id)
        ) || []
      );
    }

    if (usersForScript?.data && usersForScript?.data.length > 0) {
      setValue('script.params', {
        users: usersForScript?.data.filter((user) =>
          script.params.user_ids?.includes(user.id)
        ),
        requiredApprovalCount: script.params.required_approval_count || '1',
      });
    }
  }, [
    usersForTriggers?.data,
    tagsForTriggers?.data,
    usersForScript?.data,
    triggers.was_created_by_user_id,
    script.params.required_approval_count,
    script.params.user_ids,
    isEdit,
    triggers.tags,
    setValue,
    counterpartsForTriggers?.data,
    triggers.counterpart_id,
  ]);

  useEffect(() => {
    if (triggerInEdit) {
      setValue('triggerType', triggerInEdit);
    }
  }, [setValue, triggerInEdit]);

  useEffect(() => {
    if (scriptInEdit) {
      setValue('scriptType', scriptInEdit);
    }
  }, [setValue, scriptInEdit]);

  const resetFormTriggerOrScript = () => {
    if (!isAddingTrigger && triggerInEdit === 'was_created_by_user_id') {
      setValue(
        'triggers.was_created_by_user_id',
        prevTriggerValues?.was_created_by_user_id || []
      );
    }

    if (!isAddingTrigger && triggerInEdit === 'tags') {
      setValue('triggers.tags', prevTriggerValues?.tags || []);
    }

    if (!isAddingTrigger && triggerInEdit === 'counterpart_id') {
      setValue(
        'triggers.counterpart_id',
        prevTriggerValues?.counterpart_id || []
      );
    }

    if (isAddingTrigger && prevTriggerValues) {
      setValue('triggers', prevTriggerValues);
    }

    // TODO add reset for scripts with prev values
    if (scriptInEdit) {
      setValue(
        'script.params.users',
        usersForScript?.data.filter((user) =>
          script.params.user_ids?.includes(user.id)
        ) || []
      );
      setValue(
        'script.params.requiredApprovalCount',
        script.params.required_approval_count || 1
      );
    }

    setTriggerInEdit(null);
    setScriptInEdit(null);
    setIsAddingTrigger(false);
    setPrevTriggerValues(null);
    setValue('triggerType', null);
  };

  return (
    <>
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          {triggerInEdit || isAddingTrigger ? (
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ cursor: 'pointer' }}
                onClick={resetFormTriggerOrScript}
              >
                {t(i18n)`Edit Approval Policy`}
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                {isAddingTrigger
                  ? t(i18n)`Add Condition`
                  : t(i18n)`Edit Condition`}
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
                    ...(values.triggers.was_created_by_user_id?.length > 0
                      ? [
                          {
                            operator: 'in',
                            left_operand: {
                              name: 'invoice.was_created_by_user_id',
                            },
                            right_operand:
                              values.triggers.was_created_by_user_id.map(
                                (user) => user.id
                              ),
                          },
                        ]
                      : []),
                    ...(values.triggers.tags?.length > 0
                      ? [
                          {
                            operator: 'in',
                            left_operand: {
                              name: 'invoice.tags',
                            },
                            right_operand: values.triggers.tags.map(
                              (tag) => tag.id
                            ),
                          },
                        ]
                      : []),
                    ...(values.triggers.counterpart_id?.length > 0
                      ? [
                          {
                            operator: 'in',
                            left_operand: {
                              name: 'invoice.counterpart_id',
                            },
                            right_operand: values.triggers.counterpart_id.map(
                              (counterpart) => counterpart.id
                            ),
                          },
                        ]
                      : []),
                  ],
                },
                // TODO: remove this script after demo
                script: [
                  {
                    call: 'ApprovalRequests.request_approval_by_users',
                    params: {
                      user_ids:
                        values.script.params?.users?.map((user) => user.id) ||
                        [],
                      required_approval_count:
                        values.script?.params?.requiredApprovalCount || '1',
                    },
                  },
                ],
              };
              isEdit
                ? // @ts-expect-error - `trigger` is not covered by the schema
                  updateApprovalPolicy(approvalPolicy.id, body)
                : // @ts-expect-error - `trigger` is not covered by the schema
                  createApprovalPolicy(body);
            })}
          >
            <Stack gap={3}>
              {(triggerInEdit || isAddingTrigger) && (
                <RHFTextField
                  label={t(i18n)`Condition type`}
                  name="triggerType"
                  control={control}
                  fullWidth
                  required
                  select
                  value={triggerInEdit || undefined}
                  disabled={Boolean(triggerInEdit)}
                >
                  {/*<MenuItem value="amount">{getTriggerName('amount')}</MenuItem>*/}
                  {/*<MenuItem value="currency">*/}
                  {/*  {getTriggerName('currency')}*/}
                  {/*</MenuItem>*/}
                  {(!prevTriggerValues?.counterpart_id ||
                    triggerInEdit === 'counterpart_id') && (
                    <MenuItem value="counterpart_id">
                      {getTriggerName('counterpart_id')}
                    </MenuItem>
                  )}
                  {(!prevTriggerValues?.was_created_by_user_id ||
                    triggerInEdit === 'was_created_by_user_id') && (
                    <MenuItem value="was_created_by_user_id">
                      {getTriggerName('was_created_by_user_id')}
                    </MenuItem>
                  )}
                  {(!prevTriggerValues?.tags || triggerInEdit === 'tags') && (
                    <MenuItem value="tags">{getTriggerName('tags')}</MenuItem>
                  )}
                </RHFTextField>
              )}
              {scriptInEdit && (
                <RHFTextField
                  label={t(i18n)`Approval flow`}
                  name="scriptType"
                  control={control}
                  fullWidth
                  required
                  select
                  value={scriptInEdit}
                  disabled={Boolean(isEdit && scriptInEdit)}
                >
                  {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
                  <MenuItem value="ApprovalRequests.request_approval_by_users">
                    {t(i18n)`User from the list - Any`}
                  </MenuItem>
                </RHFTextField>
              )}
              {(triggerInEdit === 'was_created_by_user_id' ||
                (isAddingTrigger &&
                  currentTriggerType === 'was_created_by_user_id')) && (
                <AutocompleteUsers
                  control={control}
                  name="triggers.was_created_by_user_id"
                  label={t(i18n)`Users`}
                />
              )}
              {(triggerInEdit === 'tags' ||
                (isAddingTrigger && currentTriggerType === 'tags')) && (
                <AutocompleteTags
                  control={control}
                  name="triggers.tags"
                  label={t(i18n)`Tags`}
                />
              )}
              {(triggerInEdit === 'counterpart_id' ||
                (isAddingTrigger &&
                  currentTriggerType === 'counterpart_id')) && (
                <AutocompleteCounterparts
                  control={control}
                  name="triggers.counterpart_id"
                  label={t(i18n)`Counterparts`}
                />
              )}
              {scriptInEdit ===
                'ApprovalRequests.request_approval_by_users' && (
                <>
                  <AutocompleteUsers
                    control={control}
                    name="script.params.users"
                    label={t(i18n)`Users allowed to approve`}
                  />
                  <RHFTextField
                    control={control}
                    label={t(i18n)`Minimum number of approvals required`}
                    name="script.params.requiredApprovalCount"
                    type="number"
                  />
                </>
              )}
              {!triggerInEdit && !scriptInEdit && !isAddingTrigger && (
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
                    <ConditionsTable
                      triggers={currentTriggers}
                      onAddTrigger={() => {
                        setIsAddingTrigger(true);
                        setPrevTriggerValues({
                          ...getValues('triggers'),
                        });
                      }}
                      onEditTrigger={(triggerKey) => {
                        setTriggerInEdit(triggerKey);
                        setPrevTriggerValues({
                          ...getValues('triggers'),
                        });
                      }}
                      onDeleteTrigger={(triggerKey) => {
                        const updatedTriggers = {
                          ...currentTriggers,
                        };

                        delete updatedTriggers[triggerKey];

                        setValue('triggers', updatedTriggers);
                      }}
                    />
                    <Typography variant="h5" mt={4} mb={1}>
                      {t(i18n)`Approval flow`}
                    </Typography>
                    <Paper variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>{t(i18n)`Approval type`}</TableCell>
                            <TableCell>{t(i18n)`Users or Roles`}</TableCell>
                            <TableCell />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {approvalFlow ? (
                            <TableRow
                              key={approvalFlow.label}
                              hover
                              sx={{
                                '&.MuiTableRow-root': { cursor: 'pointer' },
                              }}
                              onClick={() =>
                                setScriptInEdit(
                                  approvalFlow.key ||
                                    'ApprovalRequests.request_approval_by_users'
                                )
                              }
                            >
                              <TableCell>{approvalFlow.label}</TableCell>
                              <TableCell>{approvalFlow.value}</TableCell>
                              <TableCell>
                                <IconButton
                                  aria-label={t(i18n)`Delete rule`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('delete trigger');
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3}>
                                {t(i18n)`No rules`}
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell colSpan={3}>
                              <Button
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={() =>
                                  setScriptInEdit(
                                    // eslint-disable-next-line lingui/no-unlocalized-strings
                                    'ApprovalRequests.request_approval_by_users'
                                  )
                                }
                              >
                                {t(i18n)`Add new rule`}
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
        {triggerInEdit || scriptInEdit || isAddingTrigger ? (
          <>
            <Button variant="outlined" onClick={resetFormTriggerOrScript}>{t(
              i18n
            )`Cancel`}</Button>
            <Button
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                setTriggerInEdit(null);
                setScriptInEdit(null);
                setIsAddingTrigger(false);
                setValue('triggerType', null);
              }}
            >
              {triggerInEdit ? t(i18n)`Update` : t(i18n)`Add`}
            </Button>
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
