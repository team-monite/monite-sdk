import { MemoryRouter } from 'react-router-dom';

import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { Receivables as ReceivablesComponent } from './Receivables';

const Story = {
  title: 'Receivables',
  component: ReceivablesComponent,
};

type Story = StoryObj<typeof ReceivablesComponent>;

export const Receivables: Story = {
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
        <ReceivablesComponent />
      </MemoryRouter>
    </div>
  ),
};

export default Story;
