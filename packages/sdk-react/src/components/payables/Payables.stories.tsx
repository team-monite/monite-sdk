import { MemoryRouter } from 'react-router-dom';

import { css } from '@emotion/react';
import { action } from '@storybook/addon-actions';
import { StoryObj } from '@storybook/react';

import { Payables as PayablesComponent } from './Payables';

const Story = {
  title: 'Payables',
  component: PayablesComponent,
};

const actions = {
  onSaved: action('onSaved'),
  onCanceled: action('onCanceled'),
  onSubmitted: action('onSubmitted'),
  onRejected: action('onRejected'),
  onApproved: action('onApproved'),
  onPay: action('onPay'),
};

type Story = StoryObj<typeof PayablesComponent>;

export const Payables: Story = {
  args: actions,
  render: (args) => (
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
        <PayablesComponent {...args} />
      </MemoryRouter>
    </div>
  ),
};

export default Story;
