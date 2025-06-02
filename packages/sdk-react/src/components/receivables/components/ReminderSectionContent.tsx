import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { ReminderBeforeDueDate } from '@/components/receivables/components';
import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCounterpartById } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert } from '@mui/material';

import type { SectionGeneralProps } from '../InvoiceDetails/CreateReceivable/sections/Section.types';
import { ReminderOverdue } from './ReminderOverdue';

interface ReminderSectionProps extends SectionGeneralProps {
  onCreateReminder: (type: 'payment' | 'overdue') => void;
  onUpdatePaymentReminder: () => void;
  onUpdateOverdueReminder: () => void;
  handleEditCounterpartModal?: (isOpen: boolean) => void;
}

export const ReminderSectionContent = ({
  disabled,
  onUpdateOverdueReminder,
  onUpdatePaymentReminder,
  onCreateReminder,
  handleEditCounterpartModal,
}: ReminderSectionProps) => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const { watch, resetField } = useFormContext<CreateReceivablesFormProps>();
  const counterpartId = watch('counterpart_id');

  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);

  const {
    data: hasCounterpartDefaultContactEmail,
    isLoading: isCounterpartDefaultContactEmailLoading,
  } = api.counterparts.getCounterpartsIdContacts.useQuery(
    {
      path: { counterpart_id: counterpartId ?? '' },
    },
    {
      enabled: Boolean(counterpart?.type === 'organization'),
      select: (data) =>
        Boolean(data.data.find((contact) => contact.is_default)?.email),
    }
  );

  const hasValidReminderEmail =
    counterpart && 'individual' in counterpart
      ? Boolean(counterpart.individual.email)
      : hasCounterpartDefaultContactEmail;

  const hasValidReminderEmailLoading =
    isCounterpartLoading || isCounterpartDefaultContactEmailLoading;

  const shouldShowAlert =
    !hasValidReminderEmailLoading &&
    (!hasValidReminderEmail || !counterpart?.reminders_enabled);

  useEffect(() => {
    if (
      !hasValidReminderEmailLoading &&
      !hasValidReminderEmail &&
      !counterpart?.reminders_enabled
    ) {
      resetField('payment_reminder_id');
      resetField('overdue_reminder_id');
    }
  }, [
    counterpart?.reminders_enabled,
    hasValidReminderEmail,
    hasValidReminderEmailLoading,
    resetField,
  ]);

  return shouldShowAlert ? (
    <Alert severity="warning">
      <div className="mtw:flex mtw:flex-col mtw:items-start mtw:gap-2">
        {!counterpart?.reminders_enabled && (
          <span>
            {t(
              i18n
            )`Reminders are disabled for this customer. You can enable them in the customer's details.`}
          </span>
        )}
        {!hasValidReminderEmail && (
          <span>
            {t(
              i18n
            )`There's no default email address added for the selected customer. Please, add it to send reminders.`}
          </span>
        )}

        {handleEditCounterpartModal && (
          <button
            className="mtw:underline mtw:p-0 mtw:border-none mtw:outline-none mtw:hover:cursor-pointer mtw:transition-all mtw:hover:opacity-80"
            type="button"
            onClick={() => handleEditCounterpartModal(true)}
          >
            {t(i18n)`Edit customer's profile`}
          </button>
        )}
      </div>
    </Alert>
  ) : (
    <div className="mtw:flex mtw:gap-6 mtw:space-between mtw:w-full">
      <ReminderBeforeDueDate
        handleCreate={onCreateReminder}
        onUpdatePaymentReminder={onUpdatePaymentReminder}
        disabled={
          disabled || !hasValidReminderEmail || !counterpart?.reminders_enabled
        }
      />

      <ReminderOverdue
        handleCreate={onCreateReminder}
        onUpdateOverdueReminder={onUpdateOverdueReminder}
        disabled={
          disabled || !hasValidReminderEmail || !counterpart?.reminders_enabled
        }
      />
    </div>
  );
};
