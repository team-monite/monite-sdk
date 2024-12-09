import { MemoryRouter } from 'react-router-dom';

import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { FinanceApplicationCard as FinanceApplicationCardComponent } from './FinanceApplicationCard';

const Story = {
  title: 'Financing/FinanceApplicationCard',
  component: FinanceApplicationCardComponent,
};

type Story = StoryObj<typeof FinanceApplicationCardComponent>;

export const FinanceApplicationCard: Story = {
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
        <FinanceApplicationCardComponent />
      </MemoryRouter>
    </div>
  ),
};

export default Story;
