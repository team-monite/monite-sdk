import { ComponentStory } from '@storybook/react';

import Link from './Link';

import { UInfoCircle, UEnvelopeAlt } from '../unicons';
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
        <UInfoCircle />
      </Link>
      <Link href={'#'} leftIcon={<UEnvelopeAlt />}>
        Primary with icon
      </Link>
      <Link href={'#'} disabled leftIcon={<UEnvelopeAlt />}>
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
        <UInfoCircle />
      </Link>
      <Link href={'#'} color="secondary" leftIcon={<UEnvelopeAlt />}>
        Secondary with icon
      </Link>
      <Link href={'#'} color="secondary" disabled leftIcon={<UEnvelopeAlt />}>
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
        <UInfoCircle />
      </Link>
      <Link href={'#'} color="danger" leftIcon={<UEnvelopeAlt />}>
        Danger with icon
      </Link>
      <Link href={'#'} color="danger" disabled leftIcon={<UEnvelopeAlt />}>
        Danger disabled with icon
      </Link>
    </Flex>
  );
};
