import { ComponentStory } from '@storybook/react';

import { Box, Flex, BoxProps } from './';
import { ReactNode } from 'react';

const Story = {
  title: 'Layout/Box',
  component: Box,
};

export default Story;

const Template: ComponentStory<typeof Box> = (args) => <Box {...args} />;

export const DefaultBox = Template.bind({});
DefaultBox.args = {
  children: <span>Default Box</span>,
};

export const StyledBox = Template.bind({});

StyledBox.args = {
  children: <span>Styled Box</span>,
  border: 'red solid 1px',
  p: 3,
  display: 'inline-block',
  color: 'white',
  bg: 'grey',
};

const FlexTemplate: ComponentStory<typeof Flex> = (args) => <Flex {...args} />;
const BorderedBox = ({
  children,
  ...props
}: BoxProps & { children: ReactNode }) => (
  <Box sx={{ border: '1px black solid' }} {...props}>
    {children}
  </Box>
);

export const DefaultFlex = FlexTemplate.bind({});
DefaultFlex.args = {
  children: (
    <>
      <BorderedBox m={3} p={3}>
        Box1
      </BorderedBox>
      <BorderedBox m={3} p={3}>
        Box2
      </BorderedBox>
    </>
  ),
};

export const ResponsiveFlex = FlexTemplate.bind({});
ResponsiveFlex.args = {
  children: (
    <>
      <BorderedBox width={[1, 1 / 2]} p={3}>
        Box1
      </BorderedBox>
      <BorderedBox width={[1, 1 / 2]} p={3}>
        Box2
      </BorderedBox>
    </>
  ),
  flexWrap: 'wrap',
};

export const ResponsiveFlexByAliases = FlexTemplate.bind({});
ResponsiveFlexByAliases.args = {
  children: (
    <>
      <BorderedBox width={{ _: 1, md: 1, lg: 1 / 2 }} p={3}>
        Box1
      </BorderedBox>
      <BorderedBox width={{ _: 1, md: 1, lg: 1 / 2 }} p={3}>
        Box2
      </BorderedBox>
      <BorderedBox width={{ _: 1, md: 1 / 3 }} p={3}>
        Box3
      </BorderedBox>
      <BorderedBox width={{ _: 1, md: 1 / 3 }} p={3}>
        Box4
      </BorderedBox>
      <BorderedBox width={{ _: 1, md: 1 / 3 }} p={3}>
        Box5
      </BorderedBox>
      <BorderedBox width={{ _: 1, sm: 1 / 4 }} p={3}>
        Box6
      </BorderedBox>
      <BorderedBox width={{ _: 1, sm: 1 / 4 }} p={3}>
        Box7
      </BorderedBox>
      <BorderedBox width={{ _: 1, sm: 1 / 4 }} p={3}>
        Box8
      </BorderedBox>
      <BorderedBox width={{ _: 1, sm: 1 / 4 }} p={3}>
        Box9
      </BorderedBox>
    </>
  ),
  flexWrap: 'wrap',
};
