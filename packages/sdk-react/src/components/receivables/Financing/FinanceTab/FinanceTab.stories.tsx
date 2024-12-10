import { MemoryRouter } from 'react-router-dom';

import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { FinanceTab as FinanceTabComponent } from './FinanceTab';

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
      <MemoryRouter>
        <FinanceTabComponent />
      </MemoryRouter>
    </div>
  ),
};

export default Story;
