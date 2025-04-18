import { MemoryRouter } from 'react-router-dom';

import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { OFFERS_MOCK } from '../mocks';
import { FinanceOffers as FinanceOffersComponent } from './FinanceOffers';

const Story = {
  title: 'Financing/FinanceTab/FinanceWidget/FinanceOffers',
  component: FinanceOffersComponent,
};

type Story = StoryObj<typeof FinanceOffersComponent>;

export const FinanceOffers: Story = {
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
        <FinanceOffersComponent offers={OFFERS_MOCK} />
      </MemoryRouter>
    </div>
  ),
};

export default Story;
