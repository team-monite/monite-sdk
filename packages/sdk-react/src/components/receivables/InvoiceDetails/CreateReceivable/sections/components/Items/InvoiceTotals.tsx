import { ReactNode } from 'react';

import { Price } from '@/core/utils/price';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Card,
  Grid,
  Divider,
  Typography,
  Stack,
  CardContent,
  TypographyTypeMap,
} from '@mui/material';

interface CardTableItemProps {
  label: string | ReactNode;
  value?: string | Price;
  variant?: TypographyTypeMap['props']['variant'];
  sx?: TypographyTypeMap['props']['sx'];
  className?: string;
}

const CardTableItem = ({
  label,
  value,
  variant = 'body1',
  sx,
  className,
}: CardTableItemProps) => {
  const componentClassName = 'Monite-CreateReceivable-CardTableItem';

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      className={classNames(componentClassName, className)}
    >
      <Grid item xs={4}>
        {typeof label === 'string' ? (
          <Typography variant="body1">{label}</Typography>
        ) : (
          label
        )}
      </Grid>
      {value && (
        <Grid item xs={8} display="flex" justifyContent="end">
          <Typography
            variant={variant}
            sx={sx}
            className={componentClassName + '-Value'}
          >
            {value.toString()}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

interface InvoiceTotalsProps {
  subtotalPrice?: Price;
  totalTaxes?: Price;
  totalPrice?: Price;
  parentClassName: string;
}

export const InvoiceTotals = ({
  subtotalPrice,
  totalTaxes,
  totalPrice,
  parentClassName,
}: InvoiceTotalsProps) => {
  const { i18n } = useLingui();

  return (
    <Card
      className={parentClassName + '-Totals'}
      variant="outlined"
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        borderRadius: 0,
        border: 0,
        paddingBottom: 4,
      }}
    >
      <CardContent sx={{ maxWidth: '560px', width: '100%' }}>
        <Stack>
          <CardTableItem
            key={`subtotal-${subtotalPrice}`}
            label={t(i18n)`Subtotal`}
            value={subtotalPrice}
            className="Monite-Subtotal"
          />
          <Divider sx={{ my: 1.5 }} />
          <CardTableItem
            key={`totalTaxes-${totalTaxes}`}
            label={t(i18n)`Taxes total`}
            value={totalTaxes}
            className="Monite-TaxesTotal"
          />
          <Divider sx={{ my: 1.5 }} />
          <CardTableItem
            label={
              <Typography variant="subtitle1">{t(i18n)`Total`}</Typography>
            }
            value={totalPrice}
            variant="subtitle1"
            className="Monite-Total"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
