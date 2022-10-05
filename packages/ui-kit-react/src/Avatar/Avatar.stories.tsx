import Avatar from '.';

import { action } from '@storybook/addon-actions';
import { THEMES } from '../theme_deprecated';
import { STYLES } from '../Text';

const Story = {
  title: 'Data Display/Avatar',
  component: Avatar,
};

export default Story;

const defaultArgs = {
  children: 'Monite',
  size: 32,
  src: undefined,
  to: undefined,
  disabled: false,
  color: undefined,
  textSize: undefined,
  onClick: action('onClick'),
  withStatus: false,
};

const Template = (args) => <Avatar {...args} />;

export const Playground = Template.bind({});

Playground.args = defaultArgs;

Playground.argTypes = {
  children: {
    control: 'text',
  },
  size: {
    description: 'width && height of the avatar component',
    table: {
      defaultValue: {
        summary: 32,
      },
    },
    control: 'number',
  },
  src: {
    description: 'a link to img',
    control: 'text',
  },
  to: {
    description: 'location to navigate after click',
    control: 'text',
  },
  disabled: {
    control: 'boolean',
  },
  color: {
    control: 'select',
    options: Object.keys(THEMES.default.colors),
  },
  textSize: {
    control: 'select',
    options: Object.keys(STYLES),
  },
  withStatus: {
    control: 'boolean',
  },
};

export const WithImage = Template.bind({});

WithImage.args = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Icon_Bird_512x512.png',
};

export const WithStatus = Template.bind({});

WithStatus.args = {
  children: 'Monite',
  withStatus: true,
};

export const Disabled = Template.bind({});

Disabled.args = {
  children: 'Monite',
  disabled: true,
};

export const Colors = (args) => (
  <div>
    <Avatar {...args} color="primary">
      Monite
    </Avatar>{' '}
    <Avatar {...args} color="danger">
      Monite
    </Avatar>{' '}
    <Avatar {...args} color="success">
      Monite
    </Avatar>
  </div>
);

export const Sizes = (args) => (
  <div>
    <Avatar {...args} size={16}>
      Monite
    </Avatar>{' '}
    <Avatar {...args} size={32}>
      Monite
    </Avatar>{' '}
    <Avatar {...args} size={64}>
      Monite
    </Avatar>{' '}
  </div>
);
