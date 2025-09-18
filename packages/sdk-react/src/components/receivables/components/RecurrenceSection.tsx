import { RecurrenceFormContent } from './RecurrenceFormContent';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Switch } from '@mui/material';

interface RecurrenceSectionProps {
  isRecurrenceEnabled: boolean;
  toggleRecurrence: () => void;
}

export const RecurrenceSection = ({
  isRecurrenceEnabled,
  toggleRecurrence,
}: RecurrenceSectionProps) => {
  const { i18n } = useLingui();

  return (
    <section className="mtw:flex mtw:flex-col mtw:gap-6 mtw:pb-10">
      <div className="mtw:flex mtw:items-center mtw:gap-3">
        <h3 className="mtw:text-base mtw:font-medium ">{t(
          i18n
        )`Make recurring`}</h3>

        <Switch
          checked={isRecurrenceEnabled}
          onChange={() => {
            toggleRecurrence();
          }}
          color="primary"
          aria-label={t(i18n)`Payment reminders`}
        />
      </div>

      {isRecurrenceEnabled && (
        <>
          <p className="mtw:text-sm mtw:font-normal mtw:leading-5 mtw:text-foreground">
            {t(
              i18n
            )`When you set up the recurrence all future invoices will be issued based on this invoice template. After that you won't be able to change the invoice template.`}
          </p>

          <RecurrenceFormContent />

          <p className="mtw:text-sm mtw:font-normal mtw:leading-5 mtw:text-muted-foreground">
            {t(
              i18n
            )`The first invoice is to be issued on the nearest date that matches the settings.`}
          </p>
        </>
      )}
    </section>
  );
};
