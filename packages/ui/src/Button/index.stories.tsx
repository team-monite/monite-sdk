import React from 'react';
import { ComponentStory } from '@storybook/react';

import Button from '.';
import { Box } from '../Box';

import { InfoIcon } from '../Icons';

const Story = {
  title: 'Button',
  component: Button,
};
export default Story;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const DefaultButton = Template.bind({});
DefaultButton.args = {
  text: 'Default Button',
};

export const PrimaryButton = () => {
  return (
    <>
      <Button text="Danger" /> <Button text="Danger" disabled />{' '}
      <Button isLoading /> <Button icon={<InfoIcon />} />{' '}
      <Button leftIcon={<InfoIcon width={24} height={24} />} text="Primary" />
    </>
  );
};

export const Secondary = () => {
  return (
    <>
      <Button color="secondary" text="Secondary" />{' '}
      <Button color="secondary" text="Secondary" disabled />{' '}
      <Button color="secondary" isLoading />{' '}
      <Button color="secondary" icon={<InfoIcon />} />{' '}
      <Button
        color="secondary"
        leftIcon={<InfoIcon width={24} height={24} />}
        text="Secondary"
      />
    </>
  );
};

export const Danger = () => {
  return (
    <>
      <Button color="danger" text="Danger" />{' '}
      <Button color="danger" text="Danger" disabled />{' '}
      <Button color="danger" isLoading />{' '}
      <Button color="danger" icon={<InfoIcon />} />{' '}
      <Button
        color="danger"
        leftIcon={<InfoIcon width={24} height={24} />}
        text="Danger"
      />
    </>
  );
};

export const BlockButton = () => {
  return (
    <Box width={[1, 1 / 2]} pt={2}>
      <Button block text="Block" my={1} />
      <Button block isLoading my={1} />
    </Box>
  );
};

export const ColoredLinks = () => {
  return (
    <>
      <Button color="blue" text="Blue" />{' '}
      <Button color="grey" text="Grey" disabled />{' '}
      <Button color="salad" isLoading />{' '}
      <Button color="orange" icon={<InfoIcon width={24} height={24} />} />{' '}
      <Button
        color="green"
        leftIcon={<InfoIcon width={24} height={24} />}
        text="Green"
      />
    </>
  );
};

export const LinksWithNoPadding = () => {
  return (
    <>
      <Button noPadding color="blue" text="Blue" />{' '}
      <Button noPadding color="grey" text="Grey" disabled />{' '}
      <Button noPadding color="salad" isLoading />{' '}
      <Button
        noPadding
        color="orange"
        icon={<InfoIcon width={24} height={24} />}
      />{' '}
      <Button
        noPadding
        color="green"
        leftIcon={<InfoIcon width={24} height={24} />}
        text="Green"
      />
    </>
  );
};
