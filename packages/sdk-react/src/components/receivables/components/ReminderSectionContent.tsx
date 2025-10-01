import type { SectionGeneralProps } from '../InvoiceDetails/CreateReceivable/sections/types';
import { ReminderOverdue } from './ReminderOverdue';
import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { ReminderBeforeDueDate } from '@/components/receivables/components/ReminderBeforeDueDate';
import { useCounterpartById, useCounterpartContactList } from '@/core/queries';
import { useLingui } from '@lingui/react';
import { Alert } from '@mui/material';
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
  const { i18n } = useLingui();

  const { watch } = useFormContext<CreateReceivablesFormProps>();
  const counterpartId = watch('counterpart_id');

  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);
  const { data: counterpartContacts, isLoading: isCounterpartContactsLoading } =
    useCounterpartContactList(counterpartId);

  const counterpartDefaultContactEmail = counterpartContacts?.find((contact) => contact?.is_default)?.email;

  const validReminderEmail = 
    counterpartDefaultContactEmail ? 
    counterpartDefaultContactEmail : 
    counterpartContacts && counterpartContacts?.length > 0 ? 
    counterpartContacts?.[0]?.email : counterpart && 'organization' in counterpart ? counterpart?.organization?.email : undefined;

  const hasValidReminderEmail = Boolean(validReminderEmail);
  const hasValidReminderEmailLoading = isCounterpartLoading || isCounterpartContactsLoading;

  const shouldShowAlert = !hasValidReminderEmailLoading && Boolean(counterpartId) && (!hasValidReminderEmail || !counterpart?.reminders_enabled);

  return (
    <>
    {shouldShowAlert && (
      <Alert severity="warning">
        <div className="mtw:flex mtw:flex-col mtw:items-start mtw:gap-2">
          {!counterpart?.reminders_enabled && hasValidReminderEmail && (
            <span>
              {i18n._(
                `Payment reminders are disabled for this customer. Please enable them in the customer details or turn them off.`
              )}
            </span>
          )}
          {!hasValidReminderEmail && counterpart?.reminders_enabled && (
            <span>
              {i18n._(
                `No email address is added for the selected customer. Please add it to the customer details or turn off the reminders.`
              )}
            </span>
          )}
          
          {!hasValidReminderEmail && !counterpart?.reminders_enabled && (
            <span>
              {i18n._(
                `Reminders are disabled for this customer, and no email address has been added for it. Please update the details or turn off reminders.`
              )}
            </span>
          )}

          {handleEditCounterpartModal && (
            <button
              className="mtw:underline mtw:p-0 mtw:border-none mtw:outline-none mtw:hover:cursor-pointer mtw:transition-all mtw:hover:opacity-80"
              type="button"
              onClick={() => {
                if (handleEditProfileState) {
                  handleEditProfileState(true);
                }
                handleEditCounterpartModal(true);
              }}
            >
              {i18n._(`Edit customer`)}
            </button>
          )}
        </div>
      </Alert>
    )}

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

    {validReminderEmail && (
      <p className="mtw:text-muted-foreground mtw:text-sm mtw:font-medium">
        {i18n._(`Recipient email: ${validReminderEmail}`)}<br />
        {i18n._(`You can change it in the customer profile.`)}
      </p>
    )}
    </>
  );
};
