import { PURCHASE_ORDER_CONSTANTS } from '../consts';
import { PurchaseOrderFormData } from '../schemas';
import { calculateExpiryDate } from '../utils/calculations';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/components/form';
import { Input } from '@/ui/components/input';
import { Textarea } from '@/ui/components/textarea';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export const PurchaseOrderDetailsSection = () => {
  const { i18n } = useLingui();
  const form = useFormContext<PurchaseOrderFormData>();
  const { control, watch, setValue } = form;

  const defaultValidForDays = PURCHASE_ORDER_CONSTANTS.DEFAULT_VALID_FOR_DAYS;
  const validForDays =
    watch('valid_for_days') === undefined || watch('valid_for_days') === null
      ? defaultValidForDays
      : watch('valid_for_days');

  useEffect(() => {
    if (validForDays === undefined || validForDays === null) {
      setValue('valid_for_days', defaultValidForDays);
    }
  }, [validForDays, setValue, defaultValidForDays]);

  const expiryDateLabel = useMemo(() => {
    if (!validForDays || Number.isNaN(validForDays)) return null;

    const expiresOn = calculateExpiryDate(validForDays);

    return i18n.date(expiresOn, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  }, [i18n, validForDays]);

  return (
    <section className="mtw:w-full mtw:space-y-6">
      <header className="mtw:space-y-1">
        <p className="mtw:text-xs mtw:uppercase mtw:tracking-[0.12em] mtw:text-muted-foreground">
          {t(i18n)`Section`}
        </p>
        <h2 className="mtw:text-[20px] mtw:font-semibold mtw:leading-7">
          {t(i18n)`Terms`}
        </h2>
      </header>

      <Form {...form}>
        <div className="mtw:grid mtw:grid-cols-1 mtw:gap-6">
          <FormField
            control={control}
            name="valid_for_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mtw:text-sm mtw:font-medium mtw:text-foreground">
                  {t(i18n)`Validity period`}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    inputMode="numeric"
                    min={PURCHASE_ORDER_CONSTANTS.MIN_VALID_DAYS}
                    max={PURCHASE_ORDER_CONSTANTS.MAX_VALID_DAYS}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value ? Number(value) : undefined);
                    }}
                    className="mtw:max-w-[200px]"
                    placeholder={String(defaultValidForDays)}
                  />
                </FormControl>
                <FormDescription>
                  {expiryDateLabel
                    ? t(i18n)`Expires on ${expiryDateLabel}`
                    : t(i18n)`Enter how many days the offer remains valid`}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mtw:text-sm mtw:font-medium mtw:text-foreground">
                  {t(i18n)`Message to vendor`}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="mtw:min-h-[120px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </section>
  );
};
