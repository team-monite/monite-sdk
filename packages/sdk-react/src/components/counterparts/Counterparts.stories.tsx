import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { Counterparts as CounterpartsComponent } from './Counterparts';

const Story = {
  title: 'Counterparts',
  component: CounterpartsComponent,
};

type Story = StoryObj<typeof CounterpartsComponent>;

export const Counterparts: Story = {
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
      <CounterpartsComponent />
    </div>
  ),
};

export default Story;
