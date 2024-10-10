import { MemoryRouter } from 'react-router-dom';

import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { Tags as TagsComponent } from './Tags';

const Story = {
  title: 'Tags',
  component: TagsComponent,
};

type Story = StoryObj<typeof TagsComponent>;

export const Tags: Story = {
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
        <TagsComponent />
      </MemoryRouter>
    </div>
  ),
};

export default Story;
