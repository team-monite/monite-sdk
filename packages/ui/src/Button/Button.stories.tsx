import { ComponentStory } from '@storybook/react';

import Button, { ButtonColor } from '.';
import { Box, Flex } from '../Box';

import { UInfoCircle } from '../unicons';
import { STYLES as TEXT_STYLES } from '../Text';
import { TextSize, Themes } from './Button';

const Story = {
  title: 'Data Input/Button',
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
        <Button href={'#'} key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </Wrap>
  );
};

export const ButtonSizes = () => {
  return (
    <Wrap>
      {Object.keys(TextSize).map((size: keyof typeof TextSize) => (
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
      {Object.keys(Themes).map((color: ButtonColor) => (
        <Button key={`${variant}-${color}`} variant={variant} color={color}>
          {variant} {color}
        </Button>
      ))}
    </Wrap>
  ));
};

export const LoadingButtonColors = () => {
  return buttonVariant.map((variant: keyof typeof ButtonVariants) => (
    <Wrap key={variant}>
      {Object.keys(Themes).map((color: ButtonColor) => (
        <Button
          isLoading
          key={color}
          variant={variant}
          color={color}
          href={'#'}
        >
          {variant} {color}
        </Button>
      ))}
    </Wrap>
  ));
};

export const DisabledButtonColors = () => {
  return buttonVariant.map((variant: keyof typeof ButtonVariants) => (
    <Wrap key={variant}>
      {Object.keys(Themes).map((color: ButtonColor) => (
        <Button
          disabled
          key={`${variant}-${color}`}
          variant={variant}
          color={color}
          href={'#'}
        >
          {variant} {color}
        </Button>
      ))}
    </Wrap>
  ));
};

export const ButtonWithLeftIcon = () => {
  return buttonVariant.map((variant: keyof typeof ButtonVariants) => (
    <Wrap key={variant}>
      {Object.keys(Themes).map((color: ButtonColor) => (
        <Button
          key={`${variant}-${color}`}
          leftIcon={<UInfoCircle />}
          variant={variant}
          color={color}
        >
          {variant} {color}
        </Button>
      ))}
    </Wrap>
  ));
};

export const ButtonWithRightIcon = () => {
  return buttonVariant.map((variant: keyof typeof ButtonVariants) => (
    <Wrap key={variant}>
      {Object.keys(Themes).map((color: ButtonColor) => (
        <Button
          key={`${variant}-${color}`}
          rightIcon={<UInfoCircle />}
          variant={variant}
          color={color}
        >
          {variant} {color}
        </Button>
      ))}
    </Wrap>
  ));
};

export const ButtonWithLeftAndRightIcons = () => {
  return buttonVariant.map((variant: keyof typeof ButtonVariants) => (
    <Wrap key={variant}>
      {Object.keys(Themes).map((color: ButtonColor) => (
        <Button
          key={`${variant}-${color}`}
          leftIcon={<UInfoCircle />}
          rightIcon={<UInfoCircle />}
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
          <Button
            key={`${variant}-${style}`}
            variant={variant}
            textSize={style}
          >
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
      <Button leftIcon={<UInfoCircle />} block my={1}>
        Block with icon
      </Button>
    </Box>
  );
};
