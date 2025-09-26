import { DefaultEmail } from '@/components/counterparts/CounterpartDetails/CounterpartView/CounterpartOrganizationView/CounterpartOrganizationView';
import type { CounterpartOrganizationRootResponse } from '@/components/receivables/types';
import {
  getDefaultContact,
  getContactList,
} from '@/components/receivables/utils/contacts';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCounterpartById, useCounterpartContactList } from '@/core/queries';
import { Card, CardContent } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Label } from '@/ui/components/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/ui/components/select';
import { Textarea } from '@/ui/components/textarea';
import { LoadingSpinner } from '@/ui/loading/LoadingSpinner';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import type {
  PropsWithChildren,
  CSSProperties,
  ReactNode,
  FormEvent,
} from 'react';
import { Control, Controller } from 'react-hook-form';

export interface FormProps {
  formName: string;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
  handleIssueAndSend: (e: FormEvent) => void;
}

export const EmailPurchaseOrderForm = ({
  formName,
  style,
  className,
  children,
  handleIssueAndSend,
}: PropsWithChildren<FormProps>) => {
  return (
    <form
      id={formName}
      noValidate
      onSubmit={handleIssueAndSend}
      style={style}
      className={className}
    >
      {children}
    </form>
  );
};

export interface EmailPurchaseOrderControlProps {
  subject: string;
  body: string;
  to: string;
}

interface RecipientSelectorProps {
  purchaseOrderId: string;
  control: Control<EmailPurchaseOrderControlProps>;
}

const RecipientSelector = ({
  purchaseOrderId,
  control,
}: RecipientSelectorProps) => {
  const { i18n } = useLingui();
  const { api, entityId } = useMoniteContext();
  const { data: purchaseOrder } =
    api.payablePurchaseOrders.getPayablePurchaseOrdersId.useQuery({
      path: { purchase_order_id: purchaseOrderId },
      header: { 'x-monite-entity-id': entityId },
    });
  const { data: counterpart } = useCounterpartById(
    purchaseOrder?.counterpart_id
  );
  const { data: contacts, isLoading } = useCounterpartContactList(
    purchaseOrder?.counterpart_id
  );

  if (isLoading)
    return (
      <div className="mtw:flex mtw:items-center mtw:justify-center">
        <LoadingSpinner />
      </div>
    );

  const defaultContact = getDefaultContact(
    contacts,
    counterpart as CounterpartOrganizationRootResponse
  );

  return (
    <Controller<EmailPurchaseOrderControlProps>
      name="to"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="mtw:w-full">
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="mtw:w-full mtw:border-none mtw:bg-transparent mtw:p-1 mtw:text-base mtw:font-normal mtw:text-[#292929] mtw:leading-6 focus:mtw:ring-0 focus:mtw:outline-none">
              <SelectValue placeholder={t(i18n)`Select recipient`} />
            </SelectTrigger>
            <SelectContent>
              {getContactList(contacts, defaultContact).map((contact) => (
                <SelectItem key={contact.id} value={contact.email ?? ''}>
                  <DefaultEmail
                    email={contact.email ?? ''}
                    isDefault={contact.is_default}
                  />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <p className="mtw:text-xs mtw:text-red-600 mtw:mt-1">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};

interface EmailPurchaseOrderFormContentProps {
  purchaseOrderId: string;
  control: Control<EmailPurchaseOrderControlProps>;
  isDisabled: boolean;
}

export const EmailPurchaseOrderFormContent = ({
  purchaseOrderId,
  control,
  isDisabled,
}: EmailPurchaseOrderFormContentProps) => {
  const { i18n } = useLingui();

  return (
    <>
      {/* To Field */}
      <Card
        className="mtw:mb-6 mtw:border-[#dedede] mtw:rounded-lg mtw:shadow-none mtw:py-0"
        style={{ paddingTop: 0, paddingBottom: 0 }}
      >
        <CardContent className="mtw:px-6 mtw:py-2">
          <div className="mtw:flex mtw:items-center mtw:gap-4">
            <Label className="mtw:min-w-[52px] mtw:text-sm mtw:font-medium mtw:text-[rgba(0,0,0,0.56)] mtw:leading-5">{t(
              i18n
            )`To`}</Label>
            <RecipientSelector
              purchaseOrderId={purchaseOrderId}
              control={control}
            />
          </div>
        </CardContent>
      </Card>

      {/* Subject and Body Card */}
      <Card
        className="mtw:border-[rgba(0,0,0,0.13)] mtw:rounded-lg mtw:shadow-none mtw:min-h-[320px] mtw:flex mtw:flex-col"
        style={{ paddingTop: 0, paddingBottom: 0 }}
      >
        {/* Subject Section */}
        <CardContent className="mtw:px-6 mtw:py-2 mtw:border-b mtw:border-b-[#f2f2f2]">
          <div className="mtw:flex mtw:items-center mtw:gap-4">
            <Label className="mtw:min-w-[52px] mtw:text-sm mtw:font-medium mtw:text-[rgba(0,0,0,0.56)] mtw:leading-5">{t(
              i18n
            )`Subject`}</Label>
            <Controller<EmailPurchaseOrderControlProps>
              name="subject"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="mtw:w-full">
                  <Input
                    id={field.name}
                    className="mtw:w-full mtw:border-none mtw:bg-transparent mtw:p-1 mtw:text-base mtw:font-normal mtw:text-[#292929] mtw:leading-6 focus:mtw:ring-0 focus:mtw:outline-none"
                    {...field}
                    disabled={isDisabled}
                    aria-invalid={Boolean(error)}
                  />
                  {error && (
                    <p className="mtw:text-xs mtw:text-red-600 mtw:mt-1">
                      {error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </CardContent>

        {/* Body Section */}
        <CardContent className="mtw:py-0 mtw:flex mtw:flex-col">
          <Controller<EmailPurchaseOrderControlProps>
            name="body"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div className="mtw:flex mtw:flex-col">
                <Textarea
                  id={field.name}
                  className="mtw:min-h-[200px] mtw:border-none mtw:bg-transparent mtw:p-0 mtw:text-base mtw:font-normal mtw:text-[#292929] mtw:leading-6 mtw:resize-y focus:mtw:ring-0 focus:mtw:outline-none"
                  {...field}
                  disabled={isDisabled}
                  aria-invalid={Boolean(error)}
                />
                {error && (
                  <p className="mtw:text-xs mtw:text-red-600 mtw:mt-1">
                    {error.message}
                  </p>
                )}
              </div>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
};
