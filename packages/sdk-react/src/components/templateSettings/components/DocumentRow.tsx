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
                width: 104,
                minWidth: 104,
                height: 32,
                '& .MuiInputBase-root': {
                  height: 32,
                  minHeight: 32,
                },
                '& .MuiInputBase-input': {
                  height: 32,
                  minHeight: 32,
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
                const filteredValue = event.target.value.replace(
                  /^0+(?=\d)/,
                  ''
                );
                field.onChange(Number(filteredValue));
              }}
              value={field.value.toString().padStart(minDigits, '0')}
              error={Boolean(error)}
              helperText={error?.message}
              sx={{
                width: 128,
                minWidth: 128,
                height: 32,
                '& .MuiInputBase-root': {
                  height: 32,
                  minHeight: 32,
                },
                '& .MuiInputBase-input': {
                  height: 32,
                  minHeight: 32,
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
