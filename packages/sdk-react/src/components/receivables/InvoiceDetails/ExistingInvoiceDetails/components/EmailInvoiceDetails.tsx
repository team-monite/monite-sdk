import { BaseSyntheticEvent, useCallback, useId, useState } from 'react';
import {
  Control,
  Controller,
  FormState,
  useForm,
  UseFormGetValues,
} from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useFormPersist } from '@/core/hooks/useFormPersist';
import {
  useIssueReceivableById,
  useReceivableEmailPreview,
  useSendReceivableById,
} from '@/core/queries/useReceivables';
import i18n from '@/mocks/i18n';
import { CenteredContentBox } from '@/ui/box';
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
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

import { getEmailInvoiceDetailsSchema } from './EmailInvoiceDetails.form';

interface EmailInvoiceDetailsProps {
  invoiceId: string;
  onClose: () => void;
}

export const EmailInvoiceDetails = (props: EmailInvoiceDetailsProps) => (
  <MoniteScopedProviders>
    <EmailInvoiceDetailsBase {...props} />
  </MoniteScopedProviders>
);

const EmailInvoiceDetailsBase = ({
  invoiceId,
  onClose,
}: EmailInvoiceDetailsProps) => {
  const { i18n } = useLingui();
  const { monite, api } = useMoniteContext();
  const { control, handleSubmit, formState, getValues, setValue, trigger } =
    useForm({
      resolver: yupResolver(getEmailInvoiceDetailsSchema(i18n)),
      defaultValues: {
        subject: '',
        body: '',
      },
    });
  useFormPersist(`Monite-InvoiceEmail-${invoiceId}`, getValues, setValue);
  const sendMutation = useSendReceivableById(invoiceId);
  const issueMutation = useIssueReceivableById(invoiceId);

  const createPaymentLinkMutation =
    api.paymentLinks.postPaymentLinks.useMutation({});

  const { data: paymentMethods } =
    api.entities.getEntitiesIdPaymentMethods.useQuery({
      path: { entity_id: monite.entityId },
    });

  const [presentation, setPresentation] = useState<FormPresentation>(
    FormPresentation.Edit
  );

  const formName = `Monite-Form-emailInvoiceDetails-${useId()}`;

  const handleIssueAndSend = useCallback(
    (e: BaseSyntheticEvent) => {
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

        /**
         * We can't create a payment link if no payment methods are available.
         * As an MVP approach, we should show a message to the user and prevent the email from being sent.
         */
        if (availablePaymentMethods.length === 0) {
          toast.error(
            t(
              i18n
            )`No active payment methods available. The email will be sent without a payment link`
          );
        } else {
          await issue(undefined);

          /**
           * We need to create a payment link for the invoice before sending the email.
           * Otherwise, the recipient won't be able to pay the invoice.
           *
           * The link will be automatically attached to the email because we provide `object` field
           *  with the invoice id and type.
           *
           * For more information, you could check Monite API documentation:
           * @see {@link https://docs.monite.com/docs/payment-links#22-payment-link-for-a-receivable}
           */
          await createPaymentLink({
            recipient: {
              id: monite.entityId,
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

        /**
         * If `payment methods` available, we should create a payment link.
         * If not, we should send the email without a payment link.
         */
        sendEmail(
          {
            body_text: values.body,
            subject_text: values.subject,
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
      monite.entityId,
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
                {presentation == FormPresentation.Preview && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => {
                      setPresentation(FormPresentation.Edit);
                    }}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
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
                    disabled={isDisabled}
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
                  disabled={isDisabled}
                >{t(i18n)`Issue and send`}</Button>
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>
      </DialogTitle>
      <DialogContent className={className + '-Content'} sx={{ mt: 4 }}>
        {presentation == FormPresentation.Edit && (
          <Form
            formName={formName}
            handleIssueAndSend={handleIssueAndSend}
            formState={formState}
            control={control}
            isDisabled={isDisabled}
          />
        )}
        {presentation == FormPresentation.Preview && (
          <Preview invoiceId={invoiceId} getValues={getValues} />
        )}
      </DialogContent>
    </>
  );
};

const Form = ({
  formName,
  handleIssueAndSend,
  formState,
  control,
  isDisabled,
}: {
  formName: string;
  handleIssueAndSend: (e: BaseSyntheticEvent) => void;
  formState: FormState<{ subject: string; body: string }>;
  control: Control<{ subject: string; body: string }>;
  isDisabled: boolean;
}) => {
  return (
    <form id={formName} noValidate onSubmit={handleIssueAndSend}>
      <Stack spacing={3}>
        <Stack spacing={2}>
          <Typography
            variant="subtitle2"
            color={formState.errors.subject ? 'error' : 'text.primary'}
          >{t(i18n)`Subject`}</Typography>
          <Controller
            name="subject"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                id={field.name}
                variant="outlined"
                fullWidth
                error={Boolean(error)}
                helperText={error?.message}
                required
                {...field}
                disabled={isDisabled}
              />
            )}
          />
        </Stack>
        <Stack>
          <Typography
            variant="subtitle2"
            color={formState.errors.body ? 'error' : 'text.primary'}
          >{t(i18n)`Body`}</Typography>
          <Controller
            name="body"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                id={field.name}
                variant="outlined"
                fullWidth
                error={Boolean(error)}
                helperText={error?.message}
                required
                multiline
                rows={8}
                {...field}
                disabled={isDisabled}
              />
            )}
          />
        </Stack>
      </Stack>
    </form>
  );
};

const Preview = ({
  invoiceId,
  getValues,
}: {
  invoiceId: string;
  getValues: UseFormGetValues<{ subject: string; body: string }>;
}) => {
  const { subject, body } = getValues();
  const { isLoading, preview, error, refresh } = useReceivableEmailPreview(
    invoiceId,
    subject,
    body
  );

  return (
    <>
      {isLoading && (
        <CenteredContentBox className="Monite-LoadingPage">
          <CircularProgress />
        </CenteredContentBox>
      )}
      {!isLoading && preview && (
        <iframe
          srcDoc={preview}
          style={{ width: '100%', height: '100%', border: 0 }}
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
    </>
  );
};

enum FormPresentation {
  Edit = 'form',
  Preview = 'preview',
}
