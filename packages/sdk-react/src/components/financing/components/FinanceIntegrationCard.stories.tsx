import { MemoryRouter } from 'react-router-dom';

import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { FinanceIntegrationCard as FinanceIntegrationCardComponent } from './FinanceIntegrationCard';

const Story = {
  title: 'Financing/FinanceIntegrationCard',
  component: FinanceIntegrationCardComponent,
};

type Story = StoryObj<typeof FinanceIntegrationCardComponent>;

export const FinanceIntegrationCard: Story = {
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
        <FinanceIntegrationCardComponent />
      </MemoryRouter>
    </div>
  ),
};

export default Story;
