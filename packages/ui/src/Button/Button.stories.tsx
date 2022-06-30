import { ComponentStory } from '@storybook/react';

import Button from '.';
import { Box, Flex } from '../Box';

import { InfoIcon } from '../Icons';
import { STYLES as TEXT_STYLES } from '../Text';
import { Size, Themes } from './Button';

const Story = {
  title: 'Components/Button',
  component: Button,
};

export default Story;

const Template: ComponentStory<typeof Button> = ({ children, ...args }) => (
  <Button {...args}>{children}</Button>
);

export const DefaultButton = Template.bind({});
DefaultButton.args = {
  children: 'Default Button',
};

const Wrap = ({ children, ...props }) => (
  <Flex
    {...props}
    sx={{
      gap: 10,
      flexWrap: 'wrap',
      padding: '15px 0',
      width: '100%',
    }}
  >
    {children}
  </Flex>
);

const buttonVariant = ['contained', 'outlined', 'link', 'text'];

export const ButtonVariants = () => {
  return (
    <Wrap>
      {buttonVariant.map((variant: keyof typeof ButtonVariants) => (
        <Button variant={variant}>{variant}</Button>
      ))}
    </Wrap>
  );
};

export const LinkButton = () => {
  return (
    <Wrap>
      {buttonVariant.map((variant: keyof typeof ButtonVariants) => (
        <Button href={'#'} key={'variant'} variant={variant}>
          {variant}
        </Button>
      ))}
    </Wrap>
  );
};

export const ButtonSizes = () => {
  return (
    <Wrap>
      {Object.keys(Size).map((size: keyof typeof Size) => (
        <Wrap key={size}>
          {buttonVariant.map((variant: keyof typeof ButtonVariants) => (
            <Button key={`${size}-${variant}`} variant={variant} size={size}>
              {variant} {size}
            </Button>
          ))}
        </Wrap>
      ))}
    </Wrap>
  );
};

export const ButtonColors = () => {
  return buttonVariant.map((variant: keyof typeof ButtonVariants) => (
    <Wrap key={variant}>
      {Object.keys(Themes).map((color: keyof typeof Themes) => (
        <Button key={color} variant={variant} color={color}>
          {variant} {color}
        </Button>
      ))}
    </Wrap>
  ));
};

export const ButtonWithLLeftIcon = () => {
  return buttonVariant.map((variant: keyof typeof ButtonVariants) => (
    <Wrap key={variant}>
      {Object.keys(Themes).map((color: keyof typeof Themes) => (
        <Button
          key={color}
          leftIcon={<InfoIcon />}
          variant={variant}
          color={color}
        >
          {variant} {color}
        </Button>
      ))}
    </Wrap>
  ));
};

export const ButtonWithLRightIcon = () => {
  return buttonVariant.map((variant: keyof typeof ButtonVariants) => (
    <Wrap key={variant}>
      {Object.keys(Themes).map((color: keyof typeof Themes) => (
        <Button
          key={color}
          rightIcon={<InfoIcon />}
          variant={variant}
          color={color}
        >
          {variant} {color}
        </Button>
      ))}
    </Wrap>
  ));
};

export const ButtonWithLefAndRightIcons = () => {
  return buttonVariant.map((variant: keyof typeof ButtonVariants) => (
    <Wrap key={variant}>
      {Object.keys(Themes).map((color: keyof typeof Themes) => (
        <Button
          key={color}
          leftIcon={<InfoIcon />}
          rightIcon={<InfoIcon />}
          variant={variant}
          color={color}
        >
          {variant} {color}
        </Button>
      ))}
    </Wrap>
  ));
};

export const ColoredButton = () => {
  return buttonVariant.map((variant: keyof typeof ButtonVariants) => (
    <Wrap key={variant}>
      <Button variant={variant} color={'tagViolet'}>
        {variant} tagViolet
      </Button>
      <Button variant={variant} color={'orange'}>
        {variant} orange
      </Button>
      <Button variant={variant} color={'teal'}>
        {variant} teal
      </Button>
    </Wrap>
  ));
};

export const CustomSizeButton = () => {
  return buttonVariant.map((variant: keyof typeof ButtonVariants) => (
    <Wrap key={variant}>
      {Object.keys(TEXT_STYLES)
        .reverse()
        .map((style: keyof typeof TEXT_STYLES) => (
          <Button key={style} variant={variant} textSize={style}>
            {variant} {style}
          </Button>
        ))}
    </Wrap>
  ));
};

export const BlockButton = () => {
  return (
    <Box width={[1, 1 / 2]} pt={2}>
      <Button block my={1}>
        Block
      </Button>
      <Button leftIcon={<InfoIcon />} block my={1}>
        Block with icon
      </Button>
    </Box>
  );
};
