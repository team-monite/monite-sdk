import { CreatePurchaseOrderFormProps } from '../validation';
import { RHFDatePicker } from '@/ui/RHF/RHFDatePicker/RHFDatePicker';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFormContext } from 'react-hook-form';

interface PurchaseOrderTermsSummaryProps {
  disabled?: boolean;
}

export const FullfillmentSummary = ({
  disabled,
}: PurchaseOrderTermsSummaryProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreatePurchaseOrderFormProps>();

  return (
    <div className="mtw:flex mtw:flex-col mtw:gap-2">
      <div className="mtw:mb-4">
        <RHFDatePicker
          control={control}
          name="expiry_date"
          label={t(i18n)`Expiry date`}
          disabled={disabled}
          minDate={new Date()}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
      </div>
    </div>
  );
};
