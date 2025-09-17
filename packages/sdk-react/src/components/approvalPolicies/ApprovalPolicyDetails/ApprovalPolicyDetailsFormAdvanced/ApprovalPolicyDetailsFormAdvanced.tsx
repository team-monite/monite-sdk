import { components } from '@/api';
import { JSONFormatterInput } from '@/components/approvalPolicies/ApprovalPolicyDetails/JSONFormatterInput';
import { useApprovalPolicyDetails } from '@/components/approvalPolicies/ApprovalPolicyDetails/useApprovalPolicyDetails';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { useDialog } from '@/ui/Dialog';
import { RHFTextField } from '@/ui/RHF/RHFTextField';
import { IconWrapper } from '@/ui/iconWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  Typography,
} from '@mui/material';
import { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const getValidationSchema = (i18n: I18n) =>
  z.object({
    name: z
      .string()
      .max(255, t(i18n)`Policy name cannot exceed 255 characters`)
      .min(1, t(i18n)`Policy name is required`),
    description: z
      .string()
      .max(255, t(i18n)`Description cannot exceed 255 characters`)
      .min(1, t(i18n)`Description is required`),
    trigger: z
      .string()
      .min(1, t(i18n)`Trigger in Monite Script is required`),
    script: z.string().min(1, t(i18n)`Script in Monite Script is required`),
    priority: z.number().min(1, t(i18n)`Priority is required`),
  });

export interface ApprovalPolicyFormFields {
  name: string;
  description: string;
  trigger: string;
  script: string;
  priority: number;
}

interface ApprovalPolicyDetailsFormProps {
  /** Approval policy to be edited */
  approvalPolicy?: components['schemas']['ApprovalPolicyResource'];

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

export const ApprovalPolicyDetailsFormAdvanced = (
  props: ApprovalPolicyDetailsFormProps
) => (
  <MoniteScopedProviders>
    <ApprovalPolicyDetailsFormAdvancedBase {...props} />
  </MoniteScopedProviders>
);

export const ApprovalPolicyDetailsFormAdvancedBase = ({
  approvalPolicy,
  onChangeEditMode,
  onCreated,
  onUpdated,
}: ApprovalPolicyDetailsFormProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const methods = useForm<ApprovalPolicyFormFields>({
    resolver: zodResolver(getValidationSchema(i18n)),
    defaultValues: {
      name: approvalPolicy?.name || '',
      description: approvalPolicy?.description || '',
      trigger: approvalPolicy?.trigger
        ? JSON.stringify(approvalPolicy.trigger, null, 2)
        : '',
      script: approvalPolicy?.script
        ? JSON.stringify(approvalPolicy?.script, null, 2)
        : '',
      priority: approvalPolicy?.priority,
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
    action: 'update',
    entityUserId: approvalPolicy?.created_by,
  });

  const formName = `Monite-Form-approvalPolicyDetails-${useId()}`;

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
            <IconWrapper
              edge="start"
              color="inherit"
              onClick={dialogContext.onClose}
              aria-label={t(i18n)`Close approval policy details`}
            >
              <CloseIcon />
            </IconWrapper>
          )}
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <FormProvider {...methods}>
          <form
            id={formName}
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
                priority: values.priority,
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
            <Typography variant="subtitle2" mt={2} mb={1}>
              {t(i18n)`Priority`}
            </Typography>
            <RHFTextField
              label={t(i18n)`Priority`}
              name="priority"
              control={control}
              type="number"
              required
              sx={{ maxWidth: 200 }}
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
          form={formName}
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
