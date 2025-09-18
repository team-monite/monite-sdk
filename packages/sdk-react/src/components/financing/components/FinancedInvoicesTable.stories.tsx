import { FinancedInvoicesTable as FinancedInvoicesTableComponent } from './FinancedInvoicesTable';
import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react-vite';

const Story = {
  title: 'Financing/FinanceTab/FinancedInvoicesTable',
  component: FinancedInvoicesTableComponent,
};

type Story = StoryObj<typeof FinancedInvoicesTableComponent>;

export const FinancedInvoicesTable: Story = {
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
      <FinancedInvoicesTableComponent />
    </div>
  ),
};

export default Story;
