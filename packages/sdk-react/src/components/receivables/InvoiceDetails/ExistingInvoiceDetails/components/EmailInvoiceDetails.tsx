import { Form, FormContent } from './EmailInvoiceDetails.form.components';
import { PreviewEmail } from '@/components/receivables/components/PreviewEmail';
import { useIssueReceivableById } from '@/components/receivables/hooks/useIssueReceivableById';
import { useSendReceivableById } from '@/components/receivables/hooks/useSendReceivableById';
import type { CounterpartOrganizationRootResponse } from '@/components/receivables/types';
import { getDefaultContact } from '@/components/receivables/utils/contacts';
import {
  EmailInvoiceDetailsFormValues,
  getEmailInvoiceDetailsSchema,
} from '@/components/receivables/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  useMe,
  useMyEntity,
  useCounterpartById,
  useCounterpartContactList,
} from '@/core/queries';
import { useGetReceivableById } from '@/core/queries/useGetReceivableById';
import { Dialog } from '@/ui/Dialog';
import { CenteredContentBox } from '@/ui/box';
import { IconWrapper } from '@/ui/iconWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface EmailInvoiceDetailsProps {
  invoiceId: string;
  onClose: () => void;
  onSendEmail?: (invoiceId: string) => void;
  isOpen: boolean;
}

interface EmailInvoiceFormProps extends EmailInvoiceDetailsProps {
  subject: string;
  body: string;
  to: string;
  isLoading: boolean;
  isIssued?: boolean;
}

export const EmailInvoiceDetails = (props: EmailInvoiceDetailsProps) => {
  const { i18n } = useLingui();
  const { data: me, isLoading: isLoadingUser } = useMe();
  const { data: receivable, isLoading: isLoadingReceivable } =
    useGetReceivableById(props.invoiceId);
  const { entityName, isLoading: isLoadingEntity } = useMyEntity();
  const { data: contacts, isLoading: isLoadingContacts } =
    useCounterpartContactList(receivable?.counterpart_id);
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
        isIssued={receivable?.status !== 'draft'}
        isOpen={props.isOpen}
      />
    </MoniteScopedProviders>
  );
};

export const EmailInvoiceDetailsBase = ({
  invoiceId,
  subject,
  body,
  to,
  isLoading,
  isIssued,
  onClose,
  onSendEmail,
  isOpen,
}: EmailInvoiceFormProps) => {
  const { i18n } = useLingui();
  const { api, entityId } = useMoniteContext();

  const { control, handleSubmit, getValues, trigger, reset } =
    useForm<EmailInvoiceDetailsFormValues>({
      resolver: zodResolver(getEmailInvoiceDetailsSchema(i18n)),
      defaultValues: useMemo(
        () => ({
          subject,
          body,
          to,
        }),
        [subject, body, to]
      ),
    });

  const { subject: emailSubject, body: emailBody } = getValues();

  useEffect(() => {
    reset({ subject, body, to });
  }, [body, reset, subject, to]);

  // Use the same storage key for all invoices to avoid overloading the localStorage with dozens of saved form states
  // TODO: Form persistance disabled as requested by Joao on Sep 5
  // useFormPersist(`Monite-EmailInvoiceDetails-FormState`, getValues, setValue);
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
           *  with the invoice id and type
           *
           * For more information, you could check Monite API documentation:
           * @see {@link https://docs.monite.com/docs/payment-links#22-payment-link-for-a-receivable}
           */
          await createPaymentLink({
            recipient: { id: entityId, type: 'entity' },
            payment_methods: availablePaymentMethods.map(
              (method) => method.type
            ),
            object: { id: invoiceId, type: 'receivable' },
          });
        }

        const emailParams = {
          body_text: values.body,
          subject_text: values.subject,
          recipients: values.to ? { to: [values.to] } : undefined,
        };

        // TODO: provide support for multiple recipients, cc and bcc fields
        /**
         * If `payment methods` available, we should create a payment link.
         * If not, we should send the email without a payment link.
         */
        sendEmail(emailParams, {
          onSuccess: () => {
            onSendEmail?.(invoiceId);
            onClose();
          },
        });
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
      onSendEmail,
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
    <Dialog open={isOpen} fullScreen onClose={onClose}>
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
                      data-testid="back-button"
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
                    aria-label={t(i18n)`Back to edit`}
                    data-testid="close-preview-button"
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
                    data-testid="preview-button"
                  >{t(i18n)`Preview email`}</Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  form={formName}
                  disabled={isDisabled || isLoading}
                  data-testid="issue-and-send-button"
                >
                  {isIssued ? t(i18n)`Send` : t(i18n)`Issue and Send`}
                </Button>
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
          {isPreview && (
            <PreviewEmail
              invoiceId={invoiceId}
              body={emailBody}
              subject={emailSubject}
            />
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

enum FormPresentation {
  Edit = 'form',
  Preview = 'preview',
}
