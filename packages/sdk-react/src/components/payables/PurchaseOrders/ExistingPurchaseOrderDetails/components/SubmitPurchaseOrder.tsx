import { DeliveryMethod } from '../useExistingPurchaseOrderDetails';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Card, CardContent } from '@/ui/components/card';
import { Mail, ClipboardCheck } from 'lucide-react';
import { ReactNode } from 'react';

const DeliveryMethodView = ({
  icon,
  title,
  description,
  checked,
  disabled,
  deliveryMethod,
  setDeliveryMethod,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
}) => {
  return (
    <Card
      className={
        'mtw:max-w-[200px] mtw:transition-all mtw:rounded-xl mtw:border ' +
        (checked
          ? 'mtw:border-primary mtw:bg-primary/5 '
          : 'mtw:border-muted mtw:bg-muted/30 ') +
        (disabled ? 'mtw:opacity-50 mtw:cursor-not-allowed' : 'mtw:cursor-pointer')
      }
    >
      <CardContent onClick={() => !disabled && setDeliveryMethod(deliveryMethod)}>
        <div className="mtw:flex mtw:flex-col mtw:gap-2">
          <div className="mtw:flex mtw:items-center">
            <div className="mtw:flex mtw:items-center mtw:justify-center mtw:p-2 mtw:bg-primary/10 mtw:rounded-full">
              {icon}
            </div>
          </div>
          <div className="mtw:text-sm mtw:font-medium">{title}</div>
          <div className="mtw:text-sm mtw:text-muted-foreground">{description}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export interface SubmitPurchaseOrderProps {
  disabled: boolean;
  deliveryMethod: DeliveryMethod;
  onDeliveryMethodChanged: (method: DeliveryMethod) => void;
}

export const SubmitPurchaseOrder = ({
  disabled,
  deliveryMethod,
  onDeliveryMethodChanged,
}: SubmitPurchaseOrderProps) => {
  const { i18n } = useLingui();

  return (
    <div className="mtw:space-y-4">
      <div>
        <div className="mtw:mb-2 mtw:text-sm mtw:font-semibold">{t(i18n)`Submit purchase order`}</div>
        <div className="mtw:flex mtw:flex-row mtw:gap-2">
          <DeliveryMethodView
            deliveryMethod={DeliveryMethod.Email}
            setDeliveryMethod={onDeliveryMethodChanged}
            checked={deliveryMethod === DeliveryMethod.Email}
            title={t(i18n)`Issue and send`}
            description={t(i18n)`Issue purchase order and email it to vendor`}
            disabled={disabled}
            icon={<Mail className="mtw:text-primary" />}
          />
          <DeliveryMethodView
            deliveryMethod={DeliveryMethod.Download}
            setDeliveryMethod={onDeliveryMethodChanged}
            checked={deliveryMethod === DeliveryMethod.Download}
            title={t(i18n)`Issue only`}
            description={t(i18n)`Deliver purchase order later or download PDF`}
            disabled={true}
            icon={<ClipboardCheck className="mtw:text-primary" />}
          />
        </div>
      </div>
    </div>
  );
};
