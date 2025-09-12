import {
  EmailPurchaseOrderForm,
  EmailPurchaseOrderFormContent,
} from './EmailPurchaseOrderDetails.form.components';
import { useSendPurchaseOrderById } from './hooks/useSendPurchaseOrderById';
import {
  EmailPurchaseOrderFormValues,
  getEmailPurchaseOrderSchema,
} from './validation';
import type { CounterpartOrganizationRootResponse } from '@/components/receivables/types';
import { getDefaultContact } from '@/components/receivables/utils/contacts';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCounterpartById, useCounterpartContactList } from '@/core/queries';
import { useMe } from '@/core/queries';
import { Dialog } from '@/ui/Dialog';
import { CenteredContentBox } from '@/ui/box';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import { useCallback, useEffect, useId, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface EmailPurchaseOrderDetailsProps {
  purchaseOrderId: string;
  onClose: () => void;
  onSendEmail?: (purchaseOrderId: string) => void;
  isOpen: boolean;
  mode: 'issue_and_send' | 'send';
}

interface EmailPurchaseOrderFormProps extends EmailPurchaseOrderDetailsProps {
  subject: string;
  body: string;
  to: string;
  isLoading: boolean;
  isIssued?: boolean;
}

export const EmailPurchaseOrderDetails = (
  props: EmailPurchaseOrderDetailsProps
) => {
  const { i18n } = useLingui();
  const { data: me } = useMe();
  const { api, entityId } = useMoniteContext();

  const { data: purchaseOrder, isLoading: isLoadingPurchaseOrder } =
    api.payablePurchaseOrders.getPayablePurchaseOrdersId.useQuery({
      path: { purchase_order_id: props.purchaseOrderId },
      header: { 'x-monite-entity-id': entityId },
    });

  const { data: contacts, isLoading: isLoadingContacts } =
    useCounterpartContactList(purchaseOrder?.counterpart_id);
  const { data: counterpart } = useCounterpartById(
    purchaseOrder?.counterpart_id
  );

  const defaultContact = getDefaultContact(
    contacts,
    counterpart as CounterpartOrganizationRootResponse
  );

  const to = defaultContact?.email ?? '';

  const body = defaultContact
    ? t(i18n)`Greetings ${defaultContact.first_name},

Please find the purchase order attached to this letter.

Kind Regards,
${me?.email}`
    : t(i18n)`Please find the purchase order attached to this letter.

Kind Regards`;

  const subject = purchaseOrder ? t(i18n)`Purchase Order from Monite` : '';

  const isLoading = isLoadingContacts || isLoadingPurchaseOrder;

  return (
    <MoniteScopedProviders>
      <EmailPurchaseOrderDetailsBase
        {...props}
        to={to}
        body={body}
        subject={subject}
        isLoading={isLoading}
        isIssued={purchaseOrder?.status !== 'draft'}
        isOpen={props.isOpen}
      />
    </MoniteScopedProviders>
  );
};

export const EmailPurchaseOrderDetailsBase = ({
  purchaseOrderId,
  subject,
  body,
  to,
  isLoading,
  isIssued,
  isOpen,
  mode,
  onClose,
  onSendEmail,
}: EmailPurchaseOrderFormProps) => {
  const { i18n } = useLingui();
  const { entityId } = useMoniteContext();

  const { control, handleSubmit, reset } =
    useForm<EmailPurchaseOrderFormValues>({
      resolver: zodResolver(getEmailPurchaseOrderSchema(i18n)),
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

  const sendMutation = useSendPurchaseOrderById(purchaseOrderId);

  const formName = `Monite-Form-emailPurchaseOrderDetails-${useId()}`;

  const handleIssueAndSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const sendEmail = sendMutation.mutate;

      handleSubmit(async (values) => {
        const emailParams = {
          body_text: values.body,
          subject_text: values.subject,
        };

        sendEmail(
          {
            path: { purchase_order_id: purchaseOrderId },
            body: emailParams,
            header: { 'x-monite-entity-id': entityId },
          },
          {
            onSuccess: () => {
              toast.success(
                mode === 'issue_and_send'
                  ? t(i18n)`Purchase order issued and sent successfully`
                  : t(i18n)`Purchase order sent successfully`
              );
              onSendEmail?.(purchaseOrderId);
              onClose();
            },
            onError: (error) => {
              const errorMessage =
                (error as any)?.message ||
                (error as any)?.error?.message ||
                t(i18n)`Failed to send purchase order`;
              toast.error(errorMessage);
            },
          }
        );
      })(e);
    },
    [
      handleSubmit,
      i18n,
      purchaseOrderId,
      entityId,
      onClose,
      onSendEmail,
      sendMutation.mutate,
      mode,
    ]
  );

  const isDisabled = sendMutation.isPending;

  const className = 'Monite-EmailPurchaseOrderDetails';

  return (
    <Dialog open={isOpen} fullScreen onClose={onClose}>
      <DialogTitle className={className + '-Title'}>
        <Toolbar>
          <Grid container>
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={onClose}
                  startIcon={<ArrowBackIcon />}
                  disabled={isDisabled}
                  data-testid="back-button"
                >{t(i18n)`Back`}</Button>
                <Typography variant="h3">{t(i18n)`Compose email`}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="end"
                spacing={2}
              >
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
          mt: 4,
          p: '0 32px 32px 32px',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <EmailPurchaseOrderForm
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
            <EmailPurchaseOrderFormContent
              purchaseOrderId={purchaseOrderId}
              control={control}
              isDisabled={isDisabled}
            />
          )}
        </EmailPurchaseOrderForm>
      </DialogContent>
    </Dialog>
  );
};
