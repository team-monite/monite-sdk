import { AccordionContent, AccordionTrigger } from '@/ui/components/accordion';
import { Badge } from '@/ui/components/badge';
import { Button } from '@/ui/components/button';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { Bell, Calendar } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import { useGetOverdueReminderById, useGetPaymentReminderById } from '../hooks';
import { useState } from 'react';
import { PreviewEmail } from './PreviewEmail';
import { Dialog, DialogContent, DialogDescription } from '@/ui/components/dialog';
import { getDefaultContact } from '../utils/contacts';
import { useCounterpartById, useCounterpartContactList } from '@/core/queries/useCounterpart';
import { CounterpartOrganizationRootResponse } from '../types';

const TermItem = ({
  term,
  isLastTerm,
  invoiceId,
}: {
  term: { body: string, subject: string, reminderTerm: string; id: string };
  isLastTerm: boolean;
  invoiceId: string;
}) => {
  const { i18n } = useLingui();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <li className="mtw:flex mtw:gap-1 mtw:items-center mtw:justify-between">
      <div className="mtw:flex mtw:items-center mtw:gap-3">
        <div
          className={twMerge(
            'mtw:flex mtw:flex-col mtw:gap-1',
            isLastTerm
              ? 'mtw:pt-0'
              : 'mtw:pt-2 mtw:justify-end mtw:items-center'
          )}
        >
          <Bell className="mtw:size-4" />
          {!isLastTerm && (
            <div className="mtw:w-px mtw:h-1.5 mtw:bg-neutral-80" />
          )}
        </div>
        <span className="mtw:text-neutral-10 mtw:text-sm mtw:font-normal mtw:leading-5">
          {term.reminderTerm}
        </span>
      </div>
      <Button variant="link" onClick={() => setIsPreviewOpen(true)}>{t(i18n)`View email`}</Button>

      {isPreviewOpen && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent fullScreen>
            <PreviewEmail invoiceId={invoiceId} body={term.body} subject={term.subject} />
            <DialogDescription hidden>{t(i18n)`Email preview`}</DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </li>
  );
};

export const InvoiceDetailsOverviewReminders = ({
  paymentReminderId,
  overdueReminderId,
  invoiceId,
  counterpartId,
}: {
  paymentReminderId?: string;
  overdueReminderId?: string;
  invoiceId: string;
  counterpartId: string;
}) => {
  const { i18n } = useLingui();
  const { data: contacts } = useCounterpartContactList(counterpartId);
  const { data: counterpart } = useCounterpartById(counterpartId);
  const { data: paymentReminder } =
    useGetPaymentReminderById(paymentReminderId);
  const { data: overdueReminder } =
    useGetOverdueReminderById(overdueReminderId);

  const defaultContact = getDefaultContact(
    contacts,
    counterpart as CounterpartOrganizationRootResponse
  );

  const paymentTerms = [
    ...(paymentReminder?.term_1_reminder
      ? [
          {
            body: paymentReminder?.term_1_reminder?.body,
            subject: paymentReminder?.term_1_reminder?.subject,
            reminderTerm: t(i18n)`${
              paymentReminder?.term_1_reminder.days_before
            } ${
              paymentReminder?.term_1_reminder?.days_before === 1
                ? 'day'
                : 'days'
            } before`,
            id: 'payment-1',
          },
        ]
      : []),
    ...(paymentReminder?.term_2_reminder
      ? [
          {
            body: paymentReminder?.term_2_reminder?.body,
            subject: paymentReminder?.term_2_reminder?.subject,
            reminderTerm: t(i18n)`${
              paymentReminder?.term_2_reminder.days_before
            } ${
              paymentReminder?.term_2_reminder?.days_before === 1
                ? 'day'
                : 'days'
            } before`,
            id: 'payment-2',
          },
        ]
      : []),
    ...(paymentReminder?.term_final_reminder
      ? [
          {
            body: paymentReminder?.term_final_reminder?.body,
            subject: paymentReminder?.term_final_reminder?.subject,
            reminderTerm: t(i18n)`${
              paymentReminder?.term_final_reminder.days_before
            } ${
              paymentReminder?.term_final_reminder?.days_before === 1
                ? 'day'
                : 'days'
            } before`,
            id: 'payment-3',
          },
        ]
      : []),
  ];

  const overdueTerms =
    overdueReminder?.terms?.map((term, index) => ({
      body: term?.body,
      subject: term?.subject,
      reminderTerm: t(i18n)`${term.days_after} ${
        term?.days_after === 1 ? 'day' : 'days'
      } after`,
      id: `overdue-${index + 1}`,
    })) ?? [];

  return (
    <>
      <AccordionTrigger className="mtw:hover:no-underline mtw:group">
        <span className="mtw:flex mtw:items-center mtw:gap-3">
          <span className="mtw:group-hover:underline">
            {t(i18n)`Reminder emails`}
          </span>
          {paymentTerms?.length + overdueTerms?.length > 0 && (
            <Badge
              variant="secondary"
              className="mtw:h-5 mtw:min-w-5 mtw:rounded-full mtw:px-1 mtw:tabular-nums"
            >
              {paymentTerms?.length + overdueTerms?.length}
            </Badge>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent className="mtw:flex mtw:gap-6">
          <div className="mtw:flex mtw:flex-col mtw:gap-0.5 mtw:flex-1">
            <h3 className="mtw:text-neutral-10 mtw:text-sm mtw:font-medium mtw:leading-5">
              {t(i18n)`Recipients`}
            </h3>
            <span className="mtw:text-sm mtw:font-normal mtw:leading-5">{defaultContact?.email ?? '-'}</span>
          </div>

          <div className="mtw:flex mtw:flex-col mtw:flex-1">
            <h3 className="mtw:text-neutral-10 mtw:text-sm mtw:font-medium mtw:leading-5">
              {t(i18n)`Scheduled reminders`}
            </h3>
            <ul>
              {paymentTerms?.length > 0 &&
                paymentTerms.map((term, index) => (
                  <TermItem
                    key={term.id}
                    term={term}
                    isLastTerm={
                      overdueTerms.length > 0
                        ? false
                        : index === paymentTerms.length - 1
                    }
                    invoiceId={invoiceId}
                  />
                ))}

              {overdueTerms.length > 0 && (
                <li className="mtw:flex mtw:gap-1 mtw:items-center mtw:justify-between">
                  <div className="mtw:flex mtw:items-center mtw:gap-3">
                    <div className="mtw:flex mtw:flex-col mtw:justify-end mtw:items-center mtw:gap-1 mtw:pt-2">
                      <Calendar className="mtw:size-4 mtw:text-neutral-50" />
                      <div className="mtw:w-px mtw:h-1.5 mtw:bg-neutral-80" />
                    </div>
                    <span className="mtw:text-neutral-50 mtw:text-sm mtw:font-normal mtw:leading-5">
                      {t(i18n)`Due date`}
                    </span>
                  </div>
                </li>
              )}

              {overdueTerms?.length > 0 &&
                overdueTerms.map((term, index) => (
                  <TermItem
                    key={term.id}
                    term={term}
                    isLastTerm={index === overdueTerms.length - 1}
                    invoiceId={invoiceId}
                  />
                ))}
            </ul>
          </div>
      </AccordionContent>
    </>
  );
};
