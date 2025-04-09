import { MemoryRouter } from 'react-router-dom';

import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { FinanceBanner as FinanceBannerComponent } from './FinanceBanner';

const Story = {
  title: 'Financing/FinanceBanner',
  component: FinanceBannerComponent,
};

type Story = StoryObj<typeof FinanceBannerComponent>;

export const FinanceBanner: Story = {
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
        <FinanceBannerComponent />
      </MemoryRouter>
    </div>
  ),
};

export default Story;
