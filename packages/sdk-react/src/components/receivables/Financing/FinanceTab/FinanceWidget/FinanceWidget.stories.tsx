import { MemoryRouter } from 'react-router-dom';

import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { FinanceWidget as FinanceWidgetComponent } from './FinanceWidget';

const Story = {
  title: 'Financing/FinanceTab/FinanceWidget',
  component: FinanceWidgetComponent,
};

type Story = StoryObj<typeof FinanceWidgetComponent>;

export const FinanceWidget: Story = {
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
        <FinanceWidgetComponent />
      </MemoryRouter>
    </div>
  ),
};

export default Story;
