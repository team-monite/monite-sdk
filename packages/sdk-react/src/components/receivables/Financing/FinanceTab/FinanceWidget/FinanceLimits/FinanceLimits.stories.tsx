import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { FinanceLimits as FinanceLimitsComponent } from './FinanceLimits';

const Story = {
  title: 'Financing/FinanceTab/FinanceWidget/FinanceLimits',
  component: FinanceLimitsComponent,
};

type Story = StoryObj<typeof FinanceLimitsComponent>;

export const FinanceLimits: Story = {
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
      <FinanceLimitsComponent isLoading={false} />
    </div>
  ),
};

export default Story;
