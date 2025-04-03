import { receivableListFixture } from '@/mocks';
import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { FinanceInvoice as FinanceInvoiceComponent } from './FinanceInvoice';

const Story = {
  title: 'Financing/FinanceInvoice',
  component: FinanceInvoiceComponent,
};

type Story = StoryObj<typeof FinanceInvoiceComponent>;

export const FinanceInvoice: Story = {
  args: {},
  render: () => (
    <div
      css={css`
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 20px;
      `}
    >
      <FinanceInvoiceComponent invoice={receivableListFixture.invoice[0]} />
    </div>
  ),
};

export default Story;
