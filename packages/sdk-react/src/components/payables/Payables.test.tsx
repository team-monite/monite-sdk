import { BrowserRouter } from 'react-router-dom';

import { Payables } from '@/components';
import { renderWithClient } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.useFakeTimers();
jest.setTimeout(10000);

describe('Payables', () => {
  // todo::Skipped: the test is freezing because of `userEvent.upload()`, need to investigate
  test.skip('should display toast message when file upload is successful', async () => {
    const user = userEvent.setup();

    renderWithClient(
      <BrowserRouter>
        <Payables />
      </BrowserRouter>
    );

    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(t`Upload payable file`);

    expect(input).toBeInTheDocument();

    await user.upload(input, file);

    await waitFor(() =>
      expect(
        screen.findByText('Payable uploaded successfully')
      ).toBeInTheDocument()
    );
  });
});
