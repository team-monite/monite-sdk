import { renderWithClient, triggerChangeInput } from '@/utils/test-utils';
import { requestFn } from '@openapi-qraft/react';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CreateBeforeDueDateReminder } from './CreateBeforeDueDateReminder';

const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

describe('CreateBeforeDueDateReminder', () => {
  describe('#FormValidation', () => {
    test('should show error message when fields are empty and form is submitted', async () => {
      renderWithClient(<CreateBeforeDueDateReminder />);

      const createButton = screen.getByRole('button', {
        name: /create/i,
      });

      fireEvent.click(createButton);

      const errorMessages = await screen.findAllByText(/is a required field/i);

      expect(errorMessages.length).toBe(1);
    });
  });
  test('toggles reminder forms when switches are clicked', () => {
    renderWithClient(<CreateBeforeDueDateReminder />);

    expect(screen.queryByText('Remind')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Discount date 1'));
    expect(screen.getByText('Remind')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Discount date 1'));
    expect(screen.queryByText('Remind')).not.toBeInTheDocument();
  });

  test('submits the form with valid data', async () => {
    const user = userEvent.setup();

    renderWithClient(<CreateBeforeDueDateReminder />);

    triggerChangeInput('Preset name', 'Test Reminder');

    fireEvent.click(screen.getByLabelText('Discount date 1'));

    fireEvent.change(screen.getByLabelText(/remind/i), {
      target: { value: '5' },
    });
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Subject' })[0], {
      target: { value: 'Test Subject 1' },
    });
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Body' })[0], {
      target: { value: 'Test Body 1' },
    });

    fireEvent.click(screen.getByLabelText('Discount date 2'));

    fireEvent.change(screen.getAllByLabelText(/remind/i)[1], {
      target: { value: '10' },
    });
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Subject' })[1], {
      target: { value: 'Test Subject 2' },
    });
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Body' })[1], {
      target: { value: 'Test Body 2' },
    });

    fireEvent.click(screen.getByLabelText('Due date'));

    fireEvent.change(screen.getAllByLabelText(/remind/i)[2], {
      target: { value: '15' },
    });
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Subject' })[2], {
      target: { value: 'Test Subject final' },
    });
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Body' })[2], {
      target: { value: 'Test Body final' },
    });

    const createButton = screen.getByRole('button', {
      name: /Create/i,
    });

    await user.click(createButton);

    expect(requestFnMock.mock.lastCall?.[1].body).toMatchObject({
      name: 'Test Reminder',
      term_1_reminder: {
        days_before: 5,
        subject: 'Test Subject 1',
        body: 'Test Body 1',
      },
      term_2_reminder: {
        days_before: 10,
        subject: 'Test Subject 2',
        body: 'Test Body 2',
      },
      term_final_reminder: {
        days_before: 15,
        subject: 'Test Subject final',
        body: 'Test Body final',
      },
    });
  });
});

// describe('CreateBeforeDueDateReminder', () => {
//   const queryClient = new QueryClient();
//
//   const wrapper = ({ children }: { children: React.ReactNode }) => (
//     <QueryClientProvider client={queryClient}>
//       <I18nProvider i18n={i18n}>
//         <MoniteProvider>{children}</MoniteProvider>
//       </I18nProvider>
//     </QueryClientProvider>
//   );
//
//   it('renders the component', () => {
//     render(<CreateBeforeDueDateReminder />, { wrapper });
//     expect(
//       screen.getByText('Create "Before due date" reminder')
//     ).toBeInTheDocument();
//   });
//
//   it('submits the form with valid data', async () => {
//     render(<CreateBeforeDueDateReminder />, { wrapper });
//
//     fireEvent.change(screen.getByLabelText('Preset name'), {
//       target: { value: 'Test Reminder' },
//     });
//     fireEvent.click(screen.getByLabelText('Discount date 1'));
//     fireEvent.change(screen.getByLabelText('Remind'), {
//       target: { value: '5' },
//     });
//     fireEvent.change(screen.getByLabelText('Subject'), {
//       target: { value: 'Test Subject' },
//     });
//     fireEvent.change(screen.getByLabelText('Body'), {
//       target: { value: 'Test Body' },
//     });
//
//     fireEvent.click(screen.getByText('Create'));
//
//     await waitFor(() => {
//       expect(screen.getByText('Reminder has been created')).toBeInTheDocument();
//     });
//   });
//
//   it('displays error message on API failure', async () => {
//     server.use(
//       rest.post('/api/payment_reminders', (req, res, ctx) => {
//         return res(ctx.status(400), ctx.json({ message: 'Bad Request' }));
//       })
//     );
//
//     render(<CreateBeforeDueDateReminder />, { wrapper });
//
//     fireEvent.change(screen.getByLabelText('Preset name'), {
//       target: { value: 'Test Reminder' },
//     });
//     fireEvent.click(screen.getByText('Create'));
//
//     await waitFor(() => {
//       expect(screen.getByText('Bad Request')).toBeInTheDocument();
//     });
//   });
//
//   it('toggles reminder forms when switches are clicked', () => {
//     render(<CreateBeforeDueDateReminder />, { wrapper });
//
//     expect(screen.queryByText('Remind')).not.toBeInTheDocument();
//
//     fireEvent.click(screen.getByLabelText('Discount date 1'));
//     expect(screen.getByText('Remind')).toBeInTheDocument();
//
//     fireEvent.click(screen.getByLabelText('Discount date 1'));
//     expect(screen.queryByText('Remind')).not.toBeInTheDocument();
//   });
// });
