import {
  getMoniteApiVersion,
  MoniteClient,
} from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

export const reminderDaysBeforeTerm = 3;

export const createPaymentReminder = async ({
  moniteClient,
  entity_id,
}: {
  moniteClient: MoniteClient;
  entity_id: string;
}): Promise<components['schemas']['PaymentReminderResponse']> => {
  const discountReminderSubject = `Reminder: Early Payment Discount Available - Pay Within ${reminderDaysBeforeTerm} Days`;
  const discountReminderBody = `<html lang="en"><body>
<p>Dear {contact_name},</p>

<p>We hope this message finds you well. This is a friendly reminder regarding the outstanding invoice
 # {invoice_number} with a due amount of {amount_due}.</p>

<p>To show our appreciation for your prompt payment, we are pleased to offer you a special early payment discount.
If you settle the invoice within ${reminderDaysBeforeTerm} days from the receipt of this email, the total
amount due will be reduced to {amount_due_with_discount}.</p>

<p>Here are the details of your invoice:</p>

<ul>
<li>Invoice Number: {invoice_number}</li>
<li>Invoice Date: {due_date}</li>
<li>Total Amount Due: {amount_due}</li>
<li>Early Payment Discount Amount: {amount_due_with_discount}</li>
</ul>

<p>You can make the payment using our payment link: <a href="{payment_link}">{payment_link}</a>.</p>

<p>If you have any questions regarding the invoice or the payment process, please feel free to contact us
at <a href="mailto:{entity_email}">{entity_email}</a>.</p>

<p>We sincerely appreciate your prompt attention to this matter and your continued business.</p>

<p>Best regards,<br/>
{entity_name}</p>
</body></html>`;

  const finalReminderSubject = `Payment Reminder: Invoice #{invoice_number} Due on {due_date}`;
  const finalReminderBody = `<html lang="en"><body>
Dear {contact_name},

<p>I hope this message finds you well. This is a friendly reminder regarding the outstanding invoice #{invoice_number} which is due on {due_date}.</p>

<p>The total amount due is {amount_due}. To ensure there are no disruptions in our services to you, we kindly ask
that you arrange payment by the due date.</p>

<p>Here are the details of your invoice for reference:</p>

<ul>
  <li>Invoice Number: {invoice_number}</li>
  <li>Due Date: {due_date}</li>
  <li>Amount Due: {amount_due}</li>
</ul>

<p>For your convenience, here is our payment link: <!--suppress HtmlUnknownTarget -->
<a href="{payment_link}">{payment_link}</a>.</p>

<p>If you have any questions or need assistance, please do not hesitate to contact us.
We appreciate your prompt attention to this matter.</p>

<p>Thank you for your cooperation.</p>

<p>Best regards,<br/>
{entity_name}</p>
</body></html>`;

  const { data, error, response } = await moniteClient.POST(
    '/payment_reminders',
    {
      params: {
        header: {
          'x-monite-version': getMoniteApiVersion(),
          'x-monite-entity-id': entity_id,
        },
      },
      body: {
        name: `Send payment reminders ${reminderDaysBeforeTerm} days before each due date`,
        term_1_reminder: {
          days_before: reminderDaysBeforeTerm,
          subject: discountReminderSubject,
          body: discountReminderBody,
        },
        term_2_reminder: {
          days_before: reminderDaysBeforeTerm,
          subject: discountReminderSubject,
          body: discountReminderBody,
        },
        term_final_reminder: {
          days_before: reminderDaysBeforeTerm,
          subject: finalReminderSubject,
          body: finalReminderBody,
        },
      },
    }
  );

  if (error) {
    console.error(
      `❌ Failed to create payment reminder for the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(
      `Payment reminder creation failed: ${JSON.stringify(error)}`
    );
  }

  return data;
};

export const createOverdueReminder = async ({
  moniteClient,
  entity_id,
}: {
  moniteClient: MoniteClient;
  entity_id: string;
}): Promise<components['schemas']['OverdueReminderResponse']> => {
  // According to our docs overdue reminders accept text email content, but not HTML content
  const firstReminderSubject = `Invoice {invoice_number} From {entity_name} Is Past Due`;
  const firstReminderBody = `Dear {contact name},

Thank you for doing business with us!

Our records indicate that we have not received the full payment for invoice #{invoice_number} which was
due on {due_date}. The amount due is {amount_due}.

If you have already paid this invoice, please ignore this notice. Otherwise, please send the payment
as soon as possible.

If you have any questions or want to arrange an alternative payment method, please do not hesitate
to contact us at {entity_email}.

Best regards,
{entity_name}`;

  const secondReminderSubject = `Invoice {invoice_number} From {entity_name} Is Past Due`;
  const secondReminderBody = `Dear {contact name},

I hope this message finds you well.

We are writing to inform you that our records indicate that Invoice #{invoice_number}, dated {issue_date},
is now overdue. The outstanding amount of {amount_due} was due on {due_date}.

We understand that oversights happen and kindly request that you remit payment as soon as possible.
Here is a copy of the invoice for your reference: {invoice_link}

Please disregard this notice if you have already made the payment. If there are any issues or
discrepancies with the invoice, or if you have any questions regarding this matter, please do
not hesitate to contact us at {entity_email} so we can promptly address any concerns.

Thank you for your immediate attention to this matter. We value your business and look forward
to continuing our successful relationship.

Warm regards,
{entity_name}`;

  const { data, error, response } = await moniteClient.POST(
    '/overdue_reminders',
    {
      params: {
        header: {
          'x-monite-version': getMoniteApiVersion(),
          'x-monite-entity-id': entity_id,
        },
      },
      body: {
        name: 'Overdue reminders sent after 2 and 7 days',
        terms: [
          {
            days_after: 2,
            subject: firstReminderSubject,
            body: firstReminderBody,
          },
          {
            days_after: 7,
            subject: secondReminderSubject,
            body: secondReminderBody,
          },
        ],
      },
    }
  );

  if (error) {
    console.error(
      `❌ Failed to create overdue reminder for the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(
      `Overdue reminder creation failed: ${JSON.stringify(error)}`
    );
  }

  return data;
};
