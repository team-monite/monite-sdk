import type { SectionGeneralProps } from '../InvoiceDetails/CreateReceivable/sections/types';
import { type CreateReceivablesFormProps } from '../InvoiceDetails/CreateReceivable/validation';
import { ReminderSectionContent } from '@/components/receivables/components/ReminderSectionContent';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Switch } from '@mui/material';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface ReminderSectionProps extends SectionGeneralProps {
  onCreateReminder: (type: 'payment' | 'overdue') => void;
  onUpdatePaymentReminder: () => void;
  onUpdateOverdueReminder: () => void;
  handleEditCounterpartModal?: (isOpen: boolean) => void;
}

export const RemindersSection = (props: ReminderSectionProps) => {
  const { i18n } = useLingui();
  const { watch, setValue } = useFormContext<CreateReceivablesFormProps>();
  const dueDateId = watch('payment_reminder_id');
  const overdueId = watch('overdue_reminder_id');
  const [showReminders, setShowReminders] = useState(
    Boolean(dueDateId || overdueId)
  );

  return (
    <section className="mtw:flex mtw:flex-col mtw:gap-6 mtw:pb-10">
      <div className="mtw:flex mtw:items-center mtw:gap-4">
        <h3 className="mtw:text-base mtw:font-medium ">{t(
          i18n
        )`Payment reminders`}</h3>

        <Switch
          checked={showReminders}
          onChange={(e) => {
            if (!e.target.checked) {
              setValue('payment_reminder_id', '');
              setValue('overdue_reminder_id', '');
            }
            setShowReminders(e.target.checked);
          }}
          color="primary"
          aria-label={t(i18n)`Payment reminders`}
        />
      </div>

      {showReminders && <ReminderSectionContent {...props} />}
    </section>
  );
};
