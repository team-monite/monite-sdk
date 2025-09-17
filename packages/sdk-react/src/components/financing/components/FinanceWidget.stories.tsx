import { OFFERS_MOCK } from '../mocks';
import { FinanceWidget as FinanceWidgetComponent } from './FinanceWidget';
import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react-vite';

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
      <FinanceWidgetComponent offers={OFFERS_MOCK} />
    </div>
  ),
};

export default Story;
