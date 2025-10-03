import {
  EmailPurchaseOrderForm,
  EmailPurchaseOrderFormContent,
} from './EmailPurchaseOrderDetails.form.components';
import { PreviewPurchaseOrderEmail } from './PreviewPurchaseOrderEmail';
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
import { CenteredContentBox } from '@/ui/box';
import { cn } from '@/ui/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/ui/components/dialog';
import { LoadingSpinner } from '@/ui/loading';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

enum FormPresentation {
  Edit = 'form',
  Preview = 'preview',
}

interface EmailPurchaseOrderDetailsProps {
  purchaseOrderId: string;
  isOpen: boolean;
  mode: 'issue_and_send' | 'send';
  onClose: () => void;
  onSendEmail?: (purchaseOrderId: string) => void;
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

  const { control, handleSubmit, reset, getValues, trigger } =
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

  const [presentation, setPresentation] = useState<FormPresentation>(
    FormPresentation.Edit
  );

  const handleIssueAndSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const sendEmail = sendMutation.mutate;

      handleSubmit(async (values) => {
        const emailParams = {
          body_text: values.body,
          subject_text: values.subject,
        };

        sendEmail(emailParams, {
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
            const messageFromError =
              error instanceof Error ? error.message : undefined;
            const apiErrorMessage =
              typeof error === 'object' &&
              error !== null &&
              'error' in error &&
              typeof (error as { error?: { message?: string } }).error
                ?.message === 'string'
                ? (error as { error?: { message?: string } }).error?.message
                : undefined;
            const errorMessage =
              apiErrorMessage ||
              messageFromError ||
              t(i18n)`Failed to send purchase order`;
            toast.error(errorMessage);
          },
        });
      })(e);
    },
    [
      i18n,
      purchaseOrderId,
      sendMutation.mutate,
      mode,
      handleSubmit,
      onClose,
      onSendEmail,
    ]
  );

  const isDisabled = sendMutation.isPending;

  const className = 'Monite-EmailPurchaseOrderDetails';

  const isPreview = presentation === FormPresentation.Preview;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        fullScreen
        showCloseButton={false}
        className={cn(
          className + '-Content',
          'mtw:p-0 mtw:flex mtw:flex-col mtw:gap-0'
        )}
      >
        <DialogTitle className={className + '-Title mtw:p-4 mtw:shrink-0'}>
          <div className="mtw:flex mtw:items-center mtw:justify-between mtw:w-full">
            <div className="mtw:flex mtw:items-center mtw:gap-2">
              {!isPreview && (
                <>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    disabled={isDisabled}
                    className="mtw:flex mtw:items-center mtw:gap-2"
                  >
                    <ArrowLeft className="mtw:w-4 mtw:h-4" />
                    {t(i18n)`Back`}
                  </Button>
                  <h3 className="mtw:text-lg mtw:font-semibold">{t(i18n)`Compose email`}</h3>
                </>
              )}
              {isPreview && (
                <Button
                  variant="ghost"
                  onClick={() => setPresentation(FormPresentation.Edit)}
                  className="mtw:flex mtw:items-center mtw:gap-2"
                  aria-label={t(i18n)`Back to edit`}
                  disabled={isDisabled}
                >
                  <ArrowLeft className="mtw:w-4 mtw:h-4" />
                  {t(i18n)`Back to edit`}
                </Button>
              )}
            </div>
            <div className="mtw:flex mtw:items-center mtw:gap-2">
              {presentation === FormPresentation.Edit && (
              <Button
                variant="outline"
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
                variant="default"
                type="submit"
                form={formName}
                disabled={isDisabled || isLoading}
              >
                {isIssued ? t(i18n)`Send` : t(i18n)`Issue and Send`}
              </Button>
            </div>
          </div>
        </DialogTitle>
        <div className={cn(
          'mtw:flex mtw:flex-col mtw:flex-1 mtw:overflow-auto',
          isPreview ? 'mtw:p-0' : 'mtw:p-8'
        )}>
          <EmailPurchaseOrderForm
            formName={formName}
            handleIssueAndSend={handleIssueAndSend}
            className="mtw:flex mtw:flex-col mtw:flex-1 mtw:min-h-0 mtw:w-full"
          >
            {isLoading ? (
              <CenteredContentBox className="Monite-LoadingPage">
                <LoadingSpinner />
              </CenteredContentBox>
            ) : presentation === FormPresentation.Edit ? (
              <EmailPurchaseOrderFormContent
                purchaseOrderId={purchaseOrderId}
                control={control}
                isDisabled={isDisabled}
              />
            ) : (
              <PreviewPurchaseOrderEmail
                purchaseOrderId={purchaseOrderId}
                subject={getValues('subject')}
                body={getValues('body')}
              />
            )}
          </EmailPurchaseOrderForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};
