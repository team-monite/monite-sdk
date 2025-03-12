import React, { FC } from 'react';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import {
  useForm,
  UseFormGetValues,
} from 'react-hook-form';
import { toast } from 'react-hot-toast';

import type { CounterpartOrganizationRootResponse } from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  useMe,
  useMyEntity,
  useReceivableById,
  useReceivableContacts,
  useCounterpartById,
} from '@/core/queries';
import {
  useIssueReceivableById,
  useReceivableEmailPreview,
  useSendReceivableById,
} from '@/core/queries/useReceivables';
import { CenteredContentBox } from '@/ui/box';
import { IconWrapper } from '@/ui/iconWrapper';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';

import { 
  getEmailInvoiceDetailsSchema,
} from './EmailInvoiceDetails.form';
import {
  type ControlProps,
  Form,
  FormContent,
} from './EmailInvoiceDetails.form.components';
import { getDefaultContact } from './helpers/contacts';

interface EmailInvoiceDetailsProps {
  invoiceId: string;
  onClose: () => void;
}

interface EmailInvoiceFormProps extends EmailInvoiceDetailsProps {
  subject: string;
  body: string;
  to: string;
  isLoading: boolean;
}

export const EmailInvoiceDetails: FC<EmailInvoiceDetailsProps> = (props) => {
  const { i18n } = useLingui();
  const { data: me, isLoading: isLoadingUser } = useMe();
  const { data: receivable, isLoading: isLoadingReceivable } =
    useReceivableById(props.invoiceId);
  const { data: contacts, isLoading: isLoadingContacts } =
    useReceivableContacts(props.invoiceId);
  const { entityName, isLoading: isLoadingEntity } = useMyEntity();
  const { data: counterpart } = useCounterpartById(receivable?.counterpart_id);

  const defaultContact = getDefaultContact(
    contacts,
    counterpart as CounterpartOrganizationRootResponse
  );

  const to = defaultContact?.email ?? '';

  const body =
    defaultContact && me
      ? t(i18n)`Hi ${defaultContact.first_name},

          Please find the invoice attached as discussed.

          Kind Regards,
          ${me.first_name}`
      : t(i18n)`Please find the invoice attached as discussed.

          Kind Regards,
          ${me?.first_name ?? ''}`;

  const subject =
    receivable && entityName
      ? receivable.document_id
        ? t(i18n)`Invoice ${receivable.document_id} from ${entityName}`
        : t(i18n)`Invoice from ${entityName}`
      : '';
  const isLoading =
    isLoadingContacts ||
    isLoadingReceivable ||
    isLoadingUser ||
    isLoadingEntity;

  return (
    <MoniteScopedProviders>
      <EmailInvoiceDetailsBase
        {...props}
        to={to}
        body={body}
        subject={subject}
        isLoading={isLoading}
      />
    </MoniteScopedProviders>
  );
};

const EmailInvoiceDetailsBase: FC<EmailInvoiceFormProps> = ({
  invoiceId,
  subject,
  body,
  to,
  isLoading,
  onClose,
}) => {
  const { i18n } = useLingui();
  const { api, entityId } = useMoniteContext();

  const { control, handleSubmit, getValues, trigger, reset } = useForm({
    resolver: yupResolver(getEmailInvoiceDetailsSchema(i18n)),
    defaultValues: useMemo(
      () => ({
        subject,
        body,
        to,
      }),
      [subject, body, to]
    ),
  });

  useEffect(() => {
    reset({ subject, body, to });
  }, [body, reset, subject, to]);

  const sendMutation = useSendReceivableById(invoiceId);
  const issueMutation = useIssueReceivableById(invoiceId);

  const createPaymentLinkMutation =
    api.paymentLinks.postPaymentLinks.useMutation({});

  const { data: paymentMethods } =
    api.entities.getEntitiesIdPaymentMethods.useQuery({
      path: { entity_id: entityId },
    });

  const [presentation, setPresentation] = useState<FormPresentation>(
    FormPresentation.Edit
  );

  const formName = `Monite-Form-emailInvoiceDetails-${useId()}`;

  const handleIssueAndSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const createPaymentLink = createPaymentLinkMutation.mutateAsync;
      const issue = issueMutation.mutateAsync;
      const sendEmail = sendMutation.mutate;

      handleSubmit(async (values) => {
        const availablePaymentMethods = paymentMethods
          ? paymentMethods.data.filter(
              ({ status, direction }) =>
                status === 'active' && direction === 'receive'
            )
          : [];

        if (availablePaymentMethods.length === 0) {
          toast.error(
            t(
              i18n
            )`No active payment methods available. The email will be sent without a payment link`
          );
        } else {
          await issue(undefined);

          await createPaymentLink({
            recipient: {
              id: entityId,
              type: 'entity',
            },
            payment_methods: availablePaymentMethods.map(
              (method) => method.type
            ),
            object: {
              id: invoiceId,
              type: 'receivable',
            },
          });
        }

        sendEmail(
          {
            body_text: values.body,
            subject_text: values.subject,
            recipients: values.to
              ? {
                  to: [values.to],
                }
              : undefined,
          },
          {
            onSuccess: onClose,
          }
        );
      })(e);
    },
    [
      createPaymentLinkMutation.mutateAsync,
      issueMutation.mutateAsync,
      handleSubmit,
      i18n,
      invoiceId,
      entityId,
      onClose,
      paymentMethods,
      sendMutation.mutate,
    ]
  );

  const isDisabled =
    issueMutation.isPending ||
    sendMutation.isPending ||
    createPaymentLinkMutation.isPending;

  const className = 'Monite-EmailInvoiceDetails';

  const isPreview = presentation == FormPresentation.Preview;
  return (
    <>
      <DialogTitle className={className + '-Title'}>
        <Toolbar>
          <Grid container>
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {presentation == FormPresentation.Edit && (
                  <>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={onClose}
                      startIcon={<ArrowBackIcon />}
                      disabled={isDisabled}
                    >{t(i18n)`Back`}</Button>
                    <Typography variant="h3">{t(
                      i18n
                    )`Compose email`}</Typography>
                  </>
                )}
                {isPreview && (
                  <IconWrapper
                    edge="start"
                    color="inherit"
                    onClick={() => {
                      setPresentation(FormPresentation.Edit);
                    }}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconWrapper>
                )}
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="end"
                spacing={2}
              >
                {presentation == FormPresentation.Edit && (
                  <Button
                    variant="outlined"
                    color="primary"
                    type="button"
                    form={formName}
                    disabled={isDisabled || isLoading}
                    onClick={async () => {
                      const isValid = await trigger();
                      if (isValid) setPresentation(FormPresentation.Preview);
                    }}
                  >{t(i18n)`Preview email`}</Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  form={formName}
                  disabled={isDisabled || isLoading}
                >{t(i18n)`Issue and send`}</Button>
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>
      </DialogTitle>
      <DialogContent
        className={className + '-Content'}
        sx={{
          mt: isPreview ? 0 : 4,
          p: isPreview ? 0 : '0 32px 32px 32px',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Form
          formName={formName}
          handleIssueAndSend={handleIssueAndSend}
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            width: '100%',
          }}
        >
          {isLoading ? (
            <CenteredContentBox className="Monite-LoadingPage">
              <CircularProgress />
            </CenteredContentBox>
          ) : (
            presentation == FormPresentation.Edit && (
              <FormContent
                invoiceId={invoiceId}
                control={control}
                isDisabled={isDisabled}
              />
            )
          )}
          {isPreview && <Preview invoiceId={invoiceId} getValues={getValues} />}
        </Form>
      </DialogContent>
    </>
  );
};

interface PreviewProps {
  invoiceId: string;
  getValues: UseFormGetValues<ControlProps>;
}

const Preview: FC<PreviewProps> = ({
  invoiceId,
  getValues,
}) => {
  const { i18n } = useLingui();
  const { subject, body } = getValues();
  const { isLoading, preview, error, refresh } = useReceivableEmailPreview(
    invoiceId,
    subject,
    body
  );

  return (
    <Box sx={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      overflow: 'hidden'
    }}>
      {isLoading && (
        <CenteredContentBox className="Monite-LoadingPage">
          <CircularProgress />
        </CenteredContentBox>
      )}
      {!isLoading && preview && (
        <iframe
          srcDoc={preview}
          style={{
            width: '100%',
            height: '100%',
            border: 0,
            flex: 1,
          }}
        ></iframe>
      )}
      {!isLoading && error && (
        <CenteredContentBox className="Monite-LoadingPage">
          <Stack alignItems="center" gap={2}>
            <ErrorOutlineIcon color="error" />
            <Stack gap={0.5} alignItems="center">
              <Typography variant="body1" fontWeight="bold">{t(
                i18n
              )`Failed to generate email preview`}</Typography>
              <Stack alignItems="center">
                <Typography variant="body2">{t(
                  i18n
                )`Please try to reload.`}</Typography>
                <Typography variant="body2">{t(
                  i18n
                )`If the error recurs, contact support, please.`}</Typography>
              </Stack>
              <Button
                variant="text"
                onClick={refresh}
                startIcon={<RefreshIcon />}
              >{t(i18n)`Reload`}</Button>
            </Stack>
          </Stack>
        </CenteredContentBox>
      )}
    </Box>
  );
};

enum FormPresentation {
  Edit = 'form',
  Preview = 'preview',
}
