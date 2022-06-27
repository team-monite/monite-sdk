import { ComponentStory } from '@storybook/react';

import Link from './Link';

import { InfoIcon, MailIcon } from '../Icons';
import { Flex } from '../Box';

const Story = {
  title: 'Components/Link',
  component: Link,
};

export default Story;

const Template: ComponentStory<typeof Link> = ({ children, ...args }) => (
  <Link {...args}>{children}</Link>
);

export const DefaultLink = Template.bind({});
DefaultLink.args = {
  children: 'Default Link',
};

export const Primary = () => {
  return (
    <Flex style={{ gap: 20 }}>
      <Link href={'#'}>Primary</Link>
      <Link href={'#'} disabled>
        Primary disabled
      </Link>
      <Link href={'#'}>
        <InfoIcon />
      </Link>
      <Link href={'#'} leftIcon={<MailIcon width={24} height={24} />}>
        Primary with icon
      </Link>
      <Link href={'#'} disabled leftIcon={<MailIcon width={24} height={24} />}>
        Primary disabled with icon
      </Link>
    </Flex>
  );
};

export const Secondary = () => {
  return (
    <Flex style={{ gap: 20 }}>
      <Link href={'#'} color="secondary">
        Secondary
      </Link>
      <Link href={'#'} color="secondary" disabled>
        Secondary disabled
      </Link>
      <Link color="secondary" href={'#'}>
        <InfoIcon />
      </Link>
      <Link
        href={'#'}
        color="secondary"
        leftIcon={<MailIcon width={24} height={24} />}
      >
        Secondary with icon
      </Link>
      <Link
        href={'#'}
        color="secondary"
        disabled
        leftIcon={<MailIcon width={24} height={24} />}
      >
        Secondary disabled with icon
      </Link>
    </Flex>
  );
};

export const Danger = () => {
  return (
    <Flex style={{ gap: 20 }}>
      <Link href={'#'} color="danger">
        Danger
      </Link>
      <Link href={'#'} color="danger" disabled>
        Danger disabled
      </Link>
      <Link color="danger" href={'#'}>
        <InfoIcon />
      </Link>
      <Link
        href={'#'}
        color="danger"
        leftIcon={<MailIcon width={24} height={24} />}
      >
        Danger with icon
      </Link>
      <Link
        href={'#'}
        color="danger"
        disabled
        leftIcon={<MailIcon width={24} height={24} />}
      >
        Danger disabled with icon
      </Link>
    </Flex>
  );
};
