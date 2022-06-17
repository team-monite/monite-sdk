import React from 'react';
import { ComponentStory } from '@storybook/react';

import Card from '.';

const Story = {
  title: 'Card',
  component: Card,
};
export default Story;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const DefaultCard = Template.bind({});
DefaultCard.args = {
  children: <div style={{ padding: 20 }}>Default Card</div>,
};
