import type { SectionGeneralProps } from '../InvoiceDetails/CreateReceivable/sections/types';
import { ReminderOverdue } from './ReminderOverdue';
import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { ReminderBeforeDueDate } from '@/components/receivables/components/ReminderBeforeDueDate';
// import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCounterpartById } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert } from '@mui/material';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

interface ReminderSectionProps extends SectionGeneralProps {
  onCreateReminder: (type: 'payment' | 'overdue') => void;
  onUpdatePaymentReminder: () => void;
  onUpdateOverdueReminder: () => void;
  handleEditCounterpartModal?: (isOpen: boolean) => void;
  handleEditProfileState?: (isOpen: boolean) => void;
}

export const ReminderSectionContent = ({
  disabled,
  onUpdateOverdueReminder,
  onUpdatePaymentReminder,
  onCreateReminder,
  handleEditCounterpartModal,
  handleEditProfileState,
}: ReminderSectionProps) => {
  // const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const { watch, setValue } = useFormContext<CreateReceivablesFormProps>();
  const counterpartId = watch('counterpart_id');
  const paymentReminderId = watch('payment_reminder_id');
  const overdueReminderId = watch('overdue_reminder_id');

  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);

  // const {
  //   data: hasCounterpartDefaultContactEmail,
  //   isLoading: isCounterpartDefaultContactEmailLoading,
  // } = api.counterparts.getCounterpartsIdContacts.useQuery(
  //   {
  //     path: { counterpart_id: counterpartId ?? '' },
  //   },
  //   {
  //     enabled: Boolean(counterpart?.type === 'organization'),
  //     select: (data) =>
  //       Boolean(data.data.find((contact) => contact.is_default)?.email),
  //   }
  // );

  // const hasValidReminderEmail =
  //   counterpart && 'individual' in counterpart
  //     ? Boolean(counterpart.individual.email)
  //     : hasCounterpartDefaultContactEmail;

  const hasValidReminderEmailLoading = isCounterpartLoading;
    // isCounterpartLoading || isCounterpartDefaultContactEmailLoading;

  const shouldShowAlert =
    !hasValidReminderEmailLoading && !counterpart?.reminders_enabled;
    // (!hasValidReminderEmail || !counterpart?.reminders_enabled);

  useEffect(() => {
    if (shouldShowAlert && paymentReminderId) {
      setValue('payment_reminder_id', '');
    }

    if (shouldShowAlert && overdueReminderId) {
      setValue('overdue_reminder_id', '');
    }
  }, [shouldShowAlert, paymentReminderId, overdueReminderId, setValue]);

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
        {/* TODO: uncomment when BE fix is addressed */}
        {/* {!hasValidReminderEmail && (
          <span>
            {t(
              i18n
            )`There's no default email address added for the selected customer. Please, add it to send reminders.`}
          </span>
        )} */}

        {handleEditCounterpartModal && (
          <button
            className="mtw:underline mtw:p-0 mtw:border-none mtw:outline-none mtw:hover:cursor-pointer mtw:transition-all mtw:hover:opacity-80"
            type="button"
            onClick={() => {
              if (handleEditProfileState && !counterpart?.reminders_enabled) {
                handleEditProfileState(true);
              }
              handleEditCounterpartModal(true);
            }}
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
        disabled={disabled || isCounterpartLoading}
      />

      <ReminderOverdue
        handleCreate={onCreateReminder}
        onUpdateOverdueReminder={onUpdateOverdueReminder}
        disabled={disabled || isCounterpartLoading}
      />
    </div>
  );
};
