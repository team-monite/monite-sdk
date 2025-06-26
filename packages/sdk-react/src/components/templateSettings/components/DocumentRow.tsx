import { Control, Controller, useFormContext } from 'react-hook-form';

import { TextField } from '@mui/material';

import { DocumentNumberFormValues, DocumentType } from '../types';

type Props = {
  control: Control<DocumentNumberFormValues>;
  availableType: {
    name: DocumentType;
    label: string;
  };
};

export const DocumentRow = ({ control, availableType }: Props) => {
  const { watch } = useFormContext<DocumentNumberFormValues>();
  const fieldName = availableType.name;

  const minDigits = watch('min_digits');
  const customPrefix = watch('prefix');
  const separator = watch('separator');
  const includeDate = watch('include_date');
  const currentFieldPrefix = watch(fieldName);
  const nextOrderNumber = watch(`${fieldName}_number`);

  function generatePreviewText() {
    return `${currentFieldPrefix}${separator}${
      customPrefix ? `${customPrefix}${separator}` : ''
    }${
      includeDate ? `${new Date().getFullYear()}${separator}` : ''
    }${nextOrderNumber.toString().padStart(minDigits, '0')}`;
  }

  const previewText = generatePreviewText();

  return (
    <tr className="mtw:text-base mtw:font-normal mtw:leading-5 mtw:text-neutral-10">
      <td className="mtw:pt-3 mtw:w-full mtw:pr-1">
        <span>{availableType.label}</span>
      </td>
      <td className="mtw:pt-3 mtw:px-1">
        <Controller
          name={fieldName}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              id={field.name}
              size="small"
              variant="outlined"
              fullWidth
              error={Boolean(error)}
              sx={{
                width: '6.5rem',
                minWidth: '6.5rem',
                height: '2rem',
                '& .MuiInputBase-root': {
                  height: '2rem',
                  minHeight: '2rem',
                },
                '& .MuiInputBase-input': {
                  height: '2rem',
                  minHeight: '2rem',
                },
              }}
            />
          )}
        />
      </td>
      <td className="mtw:pt-3 mtw:px-1">
        <Controller
          name={`${fieldName}_number`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              id={field.name}
              size="small"
              variant="outlined"
              fullWidth
              type="number"
              onChange={(event) => {
                // This RegEx is for removing the zeros that are added with padStart
                // before storing the input value so we don't store something like 001 but 1 instead
                // For example, if min digits is 3, the next number should be 001
                // Now, when we type in this input, the stored value is actually 1 and not 001
                const filteredValue = event.target.value.replace(
                  /^0+(?=\d)/,
                  ''
                );
                field.onChange(Number(filteredValue));
              }}
              value={field.value.toString().padStart(minDigits, '0')}
              error={Boolean(error)}
              sx={{
                width: '8rem',
                minWidth: '8rem',
                height: '2rem',
                '& .MuiInputBase-root': {
                  height: '2rem',
                  minHeight: '2rem',
                },
                '& .MuiInputBase-input': {
                  height: '2rem',
                  minHeight: '2rem',
                },
              }}
            />
          )}
        />
      </td>
      <td className="mtw:min-w-24 mtw:text-left mtw:w-fit mtw:pt-3 mtw:pl-1">
        <span className="mtw:font-semibold mtw:whitespace-nowrap">
          {previewText}
        </span>
      </td>
    </tr>
  );
};
