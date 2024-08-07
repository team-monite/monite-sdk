import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint';

import * as rule from '../../rules/mui-require-container-property';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run<string, readonly unknown[]>(
  'mui-require-container-property',
  rule as never,
  {
    valid: [
      {
        code: `import { DatePickerCustom as MyDatePicker } from '@mui/material';
               <MyDatePicker slotProps={{ popperCustom: { container: root }, dialogCustom: { container: root } }} />`,
        options: [
          {
            slotPropsPopperContainerPropertyMissing: [
              {
                component: 'DatePickerCustom',
                import: '@mui/material',
                slotProps: ['popperCustom', 'dialogCustom'],
              },
            ],
          },
        ],
      },
      {
        code: `import { useMenuButton } from '@/core/hooks';
        import { Menu } from '@mui/material';
        const { menuProps } = useMenuButton();
        <Menu {...menuProps} />`,
      },
      {
        code: `import { DatePicker } from '@mui/x-date-pickers';
               <DatePicker slotProps={{ popper: { container: root }, dialog: { container: root } }} />`,
      },
      {
        code: `import { Autocomplete } from '@mui/material';
               <Autocomplete slotProps={{ popper: { container: root } }} />`,
      },
      {
        code: `import { DatePicker } from 'my-custom-mui-datepicker';
               <DatePicker />`,
      },
      {
        code: `import { Menu } from '@mui/material';
           const config = { menuProps: { container: 'root' } };
           <Menu {...config.menuProps} />`,
      },
      {
        code: `
        import { DatePicker } from '@mui/x-date-pickers';
        <DatePicker
          slotProps={{
            popper: { container: root },
            dialog: { container: root },
          }}
        />`,
      },
      {
        code: `import { Select } from '@mui/material';
               <Select MenuProps={{ container: root }} />`,
      },
      {
        code: `import { Menu } from '@mui/material';
               <Menu container={root} />`,
      },
      {
        code: `import { TextField } from '@mui/material';
               <TextField select SelectProps={{ MenuProps: { container: root } }} />`,
      },
      {
        code: `import { TextField } from '@mui/material';
               <TextField />`, // if no `select` property specified, then valid
      },
      {
        code: `import { NotMatchingComponent } from 'not-matching-package';
               <NotMatchingComponent MenuProps={{}} />`,
      },
    ],

    invalid: [
      {
        code: `import { DatePicker } from "@mui/x-date-pickers";
               <DatePicker />`,
        errors: [{ messageId: 'slotPropsPopperContainerPropertyMissing' }],
      },
      {
        code: `import { DatePicker as MyDatePicker } from "@mui/x-date-pickers";
               <MyDatePicker />`,
        errors: [{ messageId: 'slotPropsPopperContainerPropertyMissing' }],
      },
      {
        code: `import { DatePickerCustom } from '@mui/x-date-pickers';
               <DatePickerCustom slotProps={{ popper: { container: root } }} />`,
        errors: [{ messageId: 'slotPropsPopperContainerPropertyMissing' }],
        options: [
          {
            slotPropsPopperContainerPropertyMissing: [
              {
                component: 'DatePickerCustom',
                import: '@mui/x-date-pickers',
                slotProps: ['popper', 'dialog'],
              },
            ],
          },
        ],
      },
      {
        code: `import { Autocomplete } from '@mui/material';
               <Autocomplete slotProps={{ }} />`,
        errors: [{ messageId: 'slotPropsPopperContainerPropertyMissing' }],
      },
      {
        code: `import { DatePicker } from '@mui/x-date-pickers';
               <DatePicker
                 slotProps={{ popper: { id: 'date-picker' } }}
                 views={['year', 'month', 'day']}
               />`,
        errors: [{ messageId: 'slotPropsPopperContainerPropertyMissing' }],
      },
      {
        code: `import { DatePicker } from '@mui/x-date-pickers';
               <DatePicker slotProps={{}} />`,
        errors: [{ messageId: 'slotPropsPopperContainerPropertyMissing' }],
      },
      {
        code: `import { DatePicker } from '@mui/x-date-pickers';
               <DatePicker />`,
        errors: [{ messageId: 'slotPropsPopperContainerPropertyMissing' }],
      },
      {
        code: `
          import { DatePicker } from '@mui/x-date-pickers';
          <DatePicker
            slotProps={{ popper: { container: root } }}
          />`,
        errors: [{ messageId: 'slotPropsPopperContainerPropertyMissing' }],
      },
      {
        code: `import { Select } from '@mui/material';
               <Select MenuProps={{ }} />`,
        errors: [{ messageId: 'menuPropsContainerPropertyMissing' }],
      },
      {
        code: `import { Select } from '@mui/material';
               <Select />`,
        errors: [{ messageId: 'menuPropsContainerPropertyMissing' }],
      },
      {
        code: `import { Menu } from '@mui/material';
               <Menu />`,
        errors: [{ messageId: 'containerPropertyMissing' }],
      },
      {
        code: `import { Menu as MuiMenu } from '@mui/material';
               <MuiMenu />`,
        errors: [{ messageId: 'containerPropertyMissing' }],
      },
      {
        code: `import { TextField } from '@mui/material';
               <TextField select />`,
        errors: [{ messageId: 'selectPropsMenuPropsContainerPropertyMissing' }],
      },
      {
        code: `import { TextField } from '@mui/material';
               <TextField select SelectProps={{ MenuProps: { } }} />`,
        errors: [{ messageId: 'selectPropsMenuPropsContainerPropertyMissing' }],
      },
      {
        code: `import { SomeField } from 'my-ui';
               <SomeField select SelectProps={{ MenuProps: { } }} />`,
        errors: [{ messageId: 'selectPropsMenuPropsContainerPropertyMissing' }],
        options: [
          {
            selectPropsMenuPropsContainerPropertyMissing: [
              { component: 'SomeField', import: 'my-ui' },
            ],
          },
        ],
      },
      {
        code: `import { Menu } from '@mui/material';
           const props = { someOtherProps: {} };
           <Menu {...props} />`,
        errors: [{ messageId: 'containerPropertyMissing' }],
      },
      {
        code: `import { Menu } from '@mui/material';
           const myProps = { menuProps: { someKey: 'value' } };
           const container = { menuProps: myProps.menuProps };
           <Menu {...container} />`,
        errors: [{ messageId: 'containerPropertyMissing' }],
      },
    ],
  }
);
