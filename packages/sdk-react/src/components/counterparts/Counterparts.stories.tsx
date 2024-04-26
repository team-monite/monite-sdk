import React from 'react';

import { useMenuButton } from '@/core/hooks';
import { css } from '@emotion/react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
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

export const Counterparts2: Story = {
  args: {},
  render: () => {
    const { getButtonProps, getMenuProps } = useMenuButton();

    return (
      <Box>
        <IconButton {...getButtonProps()}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu {...getMenuProps()}>
          <MenuItem>Individual</MenuItem>
        </Menu>
      </Box>
    );
  },
};

export default Story;
