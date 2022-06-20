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
  children: 'Default Button',
};

export const PrimaryButton = () => {
  return (
    <>
      <Button>Danger</Button> <Button disabled>Danger</Button>{' '}
      <Button isLoading /> <Button icon={<InfoIcon />} />{' '}
      <Button leftIcon={<InfoIcon width={24} height={24} />}>Primary</Button>
    </>
  );
};

export const Secondary = () => {
  return (
    <>
      <Button color="secondary">Secondary</Button>{' '}
      <Button color="secondary" disabled>
        Secondary
      </Button>{' '}
      <Button color="secondary" isLoading />{' '}
      <Button color="secondary" icon={<InfoIcon />} />{' '}
      <Button color="secondary" leftIcon={<InfoIcon width={24} height={24} />}>
        Secondary
      </Button>
    </>
  );
};

export const Danger = () => {
  return (
    <>
      <Button color="danger">Danger</Button>{' '}
      <Button color="danger" disabled>
        Danger
      </Button>{' '}
      <Button color="danger" isLoading />{' '}
      <Button color="danger" icon={<InfoIcon />} />{' '}
      <Button color="danger" leftIcon={<InfoIcon width={24} height={24} />}>
        Danger
      </Button>
    </>
  );
};

export const BlockButton = () => {
  return (
    <Box width={[1, 1 / 2]} pt={2}>
      <Button block my={1}>
        Block
      </Button>
      <Button block isLoading my={1} />
    </Box>
  );
};

export const ColoredLinks = () => {
  return (
    <>
      <Button color="blue">Blue</Button>{' '}
      <Button color="grey" disabled>
        Grey
      </Button>{' '}
      <Button color="salad" isLoading />{' '}
      <Button color="orange" icon={<InfoIcon width={24} height={24} />} />{' '}
      <Button color="green" leftIcon={<InfoIcon width={24} height={24} />}>
        Green
      </Button>
    </>
  );
};

export const LinksWithNoPadding = () => {
  return (
    <>
      <Button noPadding color="blue">
        Blue
      </Button>{' '}
      <Button noPadding color="grey" disabled>
        Grey
      </Button>{' '}
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
      >
        Green
      </Button>
    </>
  );
};
