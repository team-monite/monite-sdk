import { MemoryRouter } from 'react-router-dom';

import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { FinanceLimits as FinanceLimitsComponent } from './FinanceLimits';

const Story = {
  title: 'Financing/FinanceTab/FinanceLimits',
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
      <MemoryRouter>
        <FinanceLimitsComponent isLoading={false} />
      </MemoryRouter>
    </div>
  ),
};

export default Story;
