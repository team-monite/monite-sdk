import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { NotificationsNone } from '@mui/icons-material';
import { Button } from '@mui/material';

type Props = {
  reminder: Reminder;
  updateDisabled: boolean;
  onUpdate?: () => void;
};

type Reminder =
  | components['schemas']['OverdueReminderResponse']
  | components['schemas']['PaymentReminderResponse'];

const isPaymentReminder = (
  details: Reminder
): details is components['schemas']['PaymentReminderResponse'] => {
  return (
    'term_1_reminder' in details ||
    'term_2_reminder' in details ||
    'term_final_reminder' in details
  );
};

export const ReminderDetails = ({
  reminder,
  updateDisabled,
  onUpdate,
}: Props) => {
  const { i18n } = useLingui();

  const cardTerms = isPaymentReminder(reminder)
    ? [
        {
          reminderTerm: reminder?.term_1_reminder
            ? t(i18n)`${reminder?.term_1_reminder.days_before} ${
                reminder?.term_1_reminder?.days_before === 1 ? 'day' : 'days'
              } before`
            : t(i18n)`No reminder`,
          termPeriodName: t(i18n)`Discount date 1`,
          id: 'payment-1',
        },
        {
          reminderTerm: reminder?.term_2_reminder
            ? t(i18n)`${reminder?.term_2_reminder.days_before} ${
                reminder?.term_2_reminder?.days_before === 1 ? 'day' : 'days'
              } before`
            : t(i18n)`No reminder`,
          termPeriodName: t(i18n)`Discount date 2`,
          id: 'payment-2',
        },
        {
          reminderTerm: reminder?.term_final_reminder
            ? t(i18n)`${reminder?.term_final_reminder.days_before} ${
                reminder?.term_final_reminder?.days_before === 1
                  ? 'day'
                  : 'days'
              } before`
            : t(i18n)`No reminder`,
          termPeriodName: t(i18n)`Due date`,
          id: 'payment-3',
        },
      ]
    : reminder?.terms?.map((term, index) => ({
        reminderTerm: t(i18n)`${term.days_after} ${
          term?.days_after === 1 ? 'day' : 'days'
        } after`,
        termPeriodName: t(i18n)`Due date`,
        id: `overdue-${index + 1}`,
      })) ?? [];

  return (
    <div className="mtw:flex mtw:flex-col mtw:gap-4 mtw:p-4 mtw:bg-neutral-95 mtw:rounded-md">
      <ul className="mtw:w-full mtw:list-none">
        {cardTerms?.map(({ termPeriodName, reminderTerm, id }, index, arr) => {
          const noReminderSet = reminderTerm === 'No reminder';

          return (
            <li
              key={id}
              className="mtw:flex mtw:items-start mtw:gap-2 mtw:w-full"
            >
              <div className="mtw:flex mtw:flex-col mtw:items-center mtw:gap-1 mtw:pt-1">
                <NotificationsNone
                  className={`${
                    noReminderSet
                      ? 'mtw:text-neutral-70'
                      : 'mtw:text-neutral-50'
                  } mtw:text-base!`}
                />

                {index !== arr.length - 1 && (
                  <div className="mtw:w-px mtw:h-[7px] mtw:bg-neutral-70" />
                )}
              </div>

              <div className="mtw:flex mtw:flex-1 mtw:justify-between mtw:py-0.5">
                <span
                  className={`mtw:text-sm mtw:font-medium ${
                    noReminderSet
                      ? 'mtw:text-neutral-70'
                      : 'mtw:text-neutral-50'
                  }`}
                >
                  {reminderTerm}
                </span>

                <span className="mtw:text-sm mtw:font-normal mtw:text-neutral-70">
                  {termPeriodName}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {onUpdate && (
        <Button
          variant="text"
          disabled={updateDisabled}
          onClick={(event) => {
            event.preventDefault();
            onUpdate();
          }}
          size="small"
          sx={{ width: 'fit-content' }}
        >
          {t(i18n)`Edit preset`}
        </Button>
      )}
    </div>
  );
};
