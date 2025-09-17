import { FinanceTab as FinanceTabComponent } from './FinanceTab';
import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react-vite';

const Story = {
  title: 'Financing/FinanceTab',
  component: FinanceTabComponent,
};

type Story = StoryObj<typeof FinanceTabComponent>;

export const FinanceTab: Story = {
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
      <FinanceTabComponent />
    </div>
  ),
};

export default Story;
