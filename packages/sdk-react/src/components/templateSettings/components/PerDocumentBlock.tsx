import { Control, useFormContext } from 'react-hook-form';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Alert } from '@mui/material';

import { DocumentNumberFormValues } from '../types';
import { DocumentRow } from './DocumentRow';

type Props = {
  control: Control<DocumentNumberFormValues>;
};

const PREFIX_FIELDS = [
  'invoice',
  'credit_note',
  'delivery_note',
  'purchase_order',
  'quote',
];

const ORDER_NUMBER_FIELDS = [
  'invoice_number',
  'credit_note_number',
  'delivery_note_number',
  'purchase_order_number',
  'quote_number',
];

export const PerDocumentBlock = ({ control }: Props) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();
  const { formState } = useFormContext<DocumentNumberFormValues>();
  const errorKeys = Object.keys(formState.errors);

  const availableTypes = [
    ...new Set([
      ...(componentSettings?.templateSettings?.availableARDocuments ?? []),
      ...(componentSettings?.templateSettings?.availableAPDocuments ?? []),
    ]),
  ];

  return (
    <div className="mtw:flex mtw:flex-col mtw:gap-4">
      <h2 className="mtw:text-lg mtw:font-semibold mtw:text-neutral-30">{t(
        i18n
      )`Document prefix and number`}</h2>

      {!!errorKeys.length &&
        errorKeys.some((key) => PREFIX_FIELDS.includes(key)) && (
          <Alert
            icon={<WarningAmberRoundedIcon />}
            variant="filled"
            severity="error"
            sx={{
              '& .MuiAlert-message': {
                padding: 0,
                alignContent: 'center',
              },
            }}
          >
            {t(i18n)`Document prefix must contain at least 1 symbol`}
          </Alert>
        )}

      {!!errorKeys.length &&
        errorKeys.some((key) => ORDER_NUMBER_FIELDS.includes(key)) && (
          <Alert
            icon={<WarningAmberRoundedIcon />}
            variant="filled"
            severity="error"
            sx={{
              '& .MuiAlert-message': {
                padding: 0,
                alignContent: 'center',
              },
            }}
          >
            {t(i18n)`Next order number must be more than the last issued`}
          </Alert>
        )}

      <ul className="mtw:flex mtw:flex-col mtw:gap-2 mtw:list-none">
        {availableTypes.map((availableType) => (
          <DocumentRow
            key={availableType}
            control={control}
            fieldName={availableType}
            isOnlyOneAvailable={availableTypes?.length === 1}
          />
        ))}
      </ul>
    </div>
  );
};
