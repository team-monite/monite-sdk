import { ComponentStory } from '@storybook/react';

import Alert, { AlertColors, AlertProps, AlertVariant } from './Alert';
import Button from '../Button';
import IconButton from '../IconButton';
import { UMultiply } from '../unicons';
import { Box } from '../Box';

const Story = {
  title: 'Components/Alert',
  component: Alert,
};

export default Story;

const AlertTemplate: ComponentStory<typeof Alert> = ({
  children,
  ...args
}: AlertProps) => <Alert {...args}>{children}</Alert>;

export const DefaultAlert = AlertTemplate.bind({});
DefaultAlert.args = {
  children:
    'A 3% credit card transaction fee applies. It’ll be charged separately to your card.',
};

const Wrap = ({ children }) => (
  <Box sx={{ marginBottom: 10, width: 600 }}>{children}</Box>
);

export const AlertWithIcon = () => {
  return Object.keys(AlertColors).map((variant: AlertVariant) => (
    <Wrap key={variant}>
      <AlertTemplate hasLeftIcon variant={variant}>
        A 3% credit card transaction fee applies. It’ll be charged separately to
        your card.
      </AlertTemplate>
    </Wrap>
  ));
};

export const AlertWithIconAndAction = () => {
  return Object.keys(AlertColors).map((variant: AlertVariant) => (
    <Wrap key={variant}>
      <AlertTemplate
        hasLeftIcon
        variant={variant}
        action={
          <IconButton color={'inherit'}>
            <UMultiply size={20} />
          </IconButton>
        }
      >
        A 3% credit card transaction fee applies. It’ll be charged separately to
        your card.
      </AlertTemplate>
    </Wrap>
  ));
};

export const AlertWithIconAndActionAndLink = () => {
  return Object.keys(AlertColors).map((variant: AlertVariant) => (
    <Wrap key={variant}>
      <AlertTemplate
        hasLeftIcon
        variant={variant}
        action={
          <IconButton color={'inherit'}>
            <UMultiply size={20} />
          </IconButton>
        }
        link={
          <Button
            size={'sm'}
            color={'inherit'}
            variant={'text'}
            textSize={'smallLink'}
          >
            Know more
          </Button>
        }
      >
        A 3% credit card transaction fee applies. It’ll be charged separately to
        your card.
      </AlertTemplate>
    </Wrap>
  ));
};
