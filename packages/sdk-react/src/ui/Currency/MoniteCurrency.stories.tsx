import { MoniteCurrency } from './MoniteCurrency';
import { components } from '@/api';
import type { CurrencyGroup, CurrencyType } from '@/core/utils';
import { Box } from '@mui/material';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { action } from 'storybook/actions';

const StoryContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: 20 }}>
    <div style={{ display: 'flex' }}>{children}</div>
  </div>
);

export default {
  title: 'Components/MoniteCurrency',
  component: MoniteCurrency,
  argTypes: {
    showCodeOnly: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof MoniteCurrency>;

interface FormValues {
  currency: CurrencyType | null;
}

const Template: StoryFn<typeof MoniteCurrency<FormValues, 'currency'>> = (
  args
) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      currency: null,
    },
  });

  const onSubmit = (data: FormValues) => {
    action('Form Submitted')(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <StoryContainer>
          <Box sx={{ width: 300 }}>
            <MoniteCurrency
              {...args}
              name="currency"
              control={methods.control}
            />
          </Box>
        </StoryContainer>
      </form>
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};

export const ShowCodeOnly = Template.bind({});
ShowCodeOnly.args = {
  showCodeOnly: true,
  onChange: undefined, // there is a problem with onChange event in the case of showCodeOnly: true setting
};

const usedCurrencies: CurrencyEnum[] = ['JPY', 'AUD', 'CAD'];
const simulatedGroups: CurrencyGroup[] = [
  {
    title: 'Used Currencies',
    predicate: (option) => usedCurrencies.includes(option.code),
  },
  {
    title: 'Unused Currencies',
    predicate: (option) => !usedCurrencies.includes(option.code),
  },
];

export const UsedCurrencies = Template.bind({});
UsedCurrencies.args = {
  groups: simulatedGroups,
};

export const Disabled = Template.bind({});
Disabled.args = {
  groups: simulatedGroups,
  disabled: true,
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
