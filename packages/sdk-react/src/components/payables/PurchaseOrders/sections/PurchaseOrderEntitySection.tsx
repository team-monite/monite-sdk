import type { SectionGeneralProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/types';
import { CreatePurchaseOrderFormProps } from '../validation';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/components/form';
import { Textarea } from '@/ui/components/textarea';
import { cn } from '@/ui/lib/utils';
import { useFormContext } from 'react-hook-form';

interface EntitySectionProps extends SectionGeneralProps {
  visibleFields?: {
    isMessageShown?: boolean;
  };
}

export const EntitySection = ({
  disabled,
  visibleFields,
}: EntitySectionProps) => {
  const { i18n } = useLingui();
  const form = useFormContext<CreatePurchaseOrderFormProps>();
  const { control } = form;

  if (!visibleFields?.isMessageShown) {
    return null;
  }

  return (
    <section className="mtw:space-y-6">
      <Form {...form}>
        <FormField
          control={control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mtw:text-sm mtw:font-medium mtw:text-foreground">
                {t(i18n)`Message`}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={disabled}
                  className={cn('mtw:min-h-[120px]', disabled && 'mtw:opacity-70')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </section>
  );
};
