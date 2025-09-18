import { Integrations as IntegrationsComponent } from './Integrations';
import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react-vite';

const Story = {
  title: 'Integrations',
  component: IntegrationsComponent,
};

type Story = StoryObj<typeof IntegrationsComponent>;

export const Integrations: Story = {
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
      <IntegrationsComponent />
    </div>
  ),
};

export default Story;
