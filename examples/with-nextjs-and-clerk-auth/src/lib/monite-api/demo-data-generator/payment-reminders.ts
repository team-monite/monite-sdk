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

<p>I hope this message finds you well.</p>

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
