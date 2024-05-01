import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useDialog } from '@/components';
import { JSONFormatterInput } from '@/components/approvalPolicies/ApprovalPolicyDetails/JSONFormatterInput';
import { useApprovalPolicyDetails } from '@/components/approvalPolicies/ApprovalPolicyDetails/useApprovalPolicyDetails';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { yupResolver } from '@hookform/resolvers/yup';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ActionEnum, ApprovalPolicyResource } from '@monite/sdk-api';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Typography,
} from '@mui/material';

import * as yup from 'yup';

const getValidationSchema = (i18n: I18n) =>
  yup.object({
    name: yup
      .string()
      .label(i18n._(t(i18n)`Policy Name`))
      .max(255)
      .required(),
    description: yup
      .string()
      .label(i18n._(t(i18n)`Description`))
      .max(255)
      .required(),
    trigger: yup
      .string()
      .label(i18n._(t(i18n)`Trigger in Monite Script`))
      .required(),
    script: yup
      .string()
      .label(i18n._(t(i18n)`Script in Monite Script`))
      .required(),
  });

export interface ApprovalPolicyFormFields {
  name: string;
  description: string;
  trigger: string;
  script: string;
}

interface ApprovalPolicyDetailsFormProps {
  /** Approval policy to be edited */
  approvalPolicy?: ApprovalPolicyResource;

  /** Set the edit mode
   *
   * @param isEdit
   */
  onChangeEditMode: (isEdit: boolean) => void;

  /** Callback is fired when a policy is created and sync with server is successful
   *
   * @param id - the ID of the created policy
   */
  onCreated?: (id: string) => void;

  /** Callback is fired when a policy is updated and sync with server is successful
   *
   * @param id - the ID of the updated policy
   */
  onUpdated?: (id: string) => void;
}

export const ApprovalPolicyDetailsForm = (
  props: ApprovalPolicyDetailsFormProps
) => (
  <MoniteStyleProvider>
    <ApprovalPolicyDetailsFormBase {...props} />
  </MoniteStyleProvider>
);

export const ApprovalPolicyDetailsFormBase = ({
  approvalPolicy,
  onChangeEditMode,
  onCreated,
  onUpdated,
}: ApprovalPolicyDetailsFormProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const methods = useForm<ApprovalPolicyFormFields>({
    resolver: yupResolver(getValidationSchema(i18n)),
    defaultValues: {
      name: approvalPolicy?.name || '',
      description: approvalPolicy?.description || '',
      trigger: approvalPolicy?.trigger
        ? JSON.stringify(approvalPolicy.trigger || {}, null, 2)
        : '',
      script: approvalPolicy?.script
        ? JSON.stringify(approvalPolicy?.script || {}, null, 2)
        : '',
    },
  });
  const { control, handleSubmit, formState } = methods;

  const { createApprovalPolicy, isCreating, updateApprovalPolicy, isUpdating } =
    useApprovalPolicyDetails({
      onChangeEditMode,
      onCreated,
      onUpdated,
    });

  const isUpdate = !!approvalPolicy?.id;

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'approval_policy',
    action: ActionEnum.UPDATE,
    entityUserId: approvalPolicy?.created_by,
  });

  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3">
            {isUpdate
              ? t(i18n)`Update Approval Policy`
              : t(i18n)`Create Approval Policy`}
          </Typography>
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
            id="approvalPolicyForm"
            noValidate
            onSubmit={handleSubmit((values) => {
              const body = {
                name: values.name,
                description: values.description,
                trigger: JSON.parse(values.trigger),
                script: JSON.parse(
                  values.script.startsWith('[')
                    ? values.script
                    : `[${values.script}]`
                ),
              };

              isUpdate
                ? updateApprovalPolicy(approvalPolicy?.id || '', body)
                : createApprovalPolicy(body);
            })}
          >
            <Typography variant="subtitle2" mb={1}>
              {t(i18n)`Policy Name`}
            </Typography>
            <RHFTextField
              label={t(i18n)`Policy Name`}
              name="name"
              control={control}
              fullWidth
              required
            />
            <Typography variant="subtitle2" mt={2} mb={1}>
              {t(i18n)`Description`}
            </Typography>
            <RHFTextField
              label={t(i18n)`Description`}
              name="description"
              control={control}
              fullWidth
              required
              multiline
              rows={4}
            />
            <Typography
              variant="subtitle2"
              mt={2}
              mb={1}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {t(i18n)`Trigger in Monite Script`}
              <Link
                underline="none"
                rel="noopener noreferrer"
                href="https://docs.monite.com/docs/monitescript#trigger"
                target="_blank"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {t(i18n)`Go to Docs`}
                &nbsp;
                <OpenInNewIcon />
              </Link>
            </Typography>
            <JSONFormatterInput
              name="trigger"
              label={t(i18n)`Trigger in Monite Script`}
            />
            <Typography
              variant="subtitle2"
              mt={2}
              mb={1}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {t(i18n)`Script in Monite Script`}
              <Link
                underline="none"
                rel="noopener noreferrer"
                href="https://docs.monite.com/docs/monitescript#script"
                target="_blank"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {t(i18n)`Go to Docs`}
                &nbsp;
                <OpenInNewIcon />
              </Link>
            </Typography>
            <JSONFormatterInput
              name="script"
              label={t(i18n)`Script in Monite Script`}
            />
          </form>
        </FormProvider>
      </DialogContent>
      <Divider />
      <DialogActions>
        {dialogContext && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              isUpdate ? onChangeEditMode?.(false) : dialogContext.onClose?.();
            }}
          >
            {t(i18n)`Cancel`}
          </Button>
        )}
        <Button
          variant="outlined"
          type="submit"
          form="approvalPolicyForm"
          disabled={
            isCreating ||
            isUpdating ||
            (isUpdate && (!formState.isDirty || !isUpdateAllowed))
          }
        >
          {isUpdate ? t(i18n)`Update` : t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};
