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
               <MyDatePicker slotProps={{ popper: { container: root } }} />`,
        options: [
          {
            slotPropsPopperContainerPropertyMissing: [
              { component: 'DatePickerCustom', import: '@mui/material' },
            ],
          },
        ],
      },
      {
        code: `import { DatePicker } from '@mui/x-date-pickers';
               <DatePicker slotProps={{ popper: { container: root } }} />`,
      },
      {
        code: `import { DatePicker } from 'my-custom-mui-datepicker';
               <DatePicker />`,
      },
      {
        code: `import { DatePicker } from '@mui/x-date-pickers';
               <DatePicker
                 slotProps={{
                   popper: {
                     id: 'date-picker',
                     container: root
                   }
                 }}
                 views={['year', 'month', 'day']}
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
      {
        code: `import { Menu } from '@mui/material';
               const restProps = { container: root };
               <Menu {...restProps} />`,
      },
      {
        code: `import { Menu } from '@mui/material';
               const props = { other: 'value' };
               <Menu {...props} container={root} />`,
      },
      {
        code: `import { Menu } from '@mui/material';
               <Menu SelectProps={{ MenuProps: { container: root } }} />`,
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
               <DatePickerCustom />`,
        errors: [{ messageId: 'slotPropsPopperContainerPropertyMissing' }],
        options: [
          {
            slotPropsPopperContainerPropertyMissing: [
              { component: 'DatePickerCustom', import: '@mui/x-date-pickers' },
            ],
          },
        ],
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
               <Menu SelectProps={{ }} />`,
        errors: [{ messageId: 'selectPropsMenuPropsContainerPropertyMissing' }],
      },
      {
        code: `import { Menu } from '@mui/material';
           const props = { container: root };
           <Menu {...props} />`,
        errors: [{ messageId: 'containerPropertyMissing' }],
      },
      {
        code: `import { Menu } from '@mui/material';
           const nestedProps = { props: { container: root } };
           <Menu {...nestedProps.props} />`,
        errors: [{ messageId: 'containerPropertyMissing' }],
      },
      {
        code: `import { TextField } from '@mui/material';
           const selectProps = { MenuProps: { container: root } };
           <TextField select SelectProps={{ ...selectProps }} />`,
        errors: [{ messageId: 'selectPropsMenuPropsContainerPropertyMissing' }],
      },
      {
        code: `import { Select } from '@mui/material';
           const menuProps = { container: root };
           <Select MenuProps={{ ...menuProps }} />`,
        errors: [{ messageId: 'menuPropsContainerPropertyMissing' }],
      },
      {
        code: `import { DatePicker } from '@mui/x-date-pickers';
           const slotProps = { popper: { container: root } };
           <DatePicker slotProps={{ ...slotProps }} />`,
        errors: [{ messageId: 'slotPropsPopperContainerPropertyMissing' }],
      },
    ],
  }
);
