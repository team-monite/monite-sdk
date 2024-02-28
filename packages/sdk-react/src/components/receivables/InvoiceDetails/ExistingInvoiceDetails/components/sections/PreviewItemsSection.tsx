import React from 'react';

import { useCurrencies } from '@/core/hooks';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { InvoiceResponsePayload } from '@monite/sdk-api';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { TypographyTypeMap } from '@mui/material/Typography/Typography';

interface IPreviewItemsSectionProps {
  invoice: InvoiceResponsePayload;
}

const tableCellStyles = {
  sx: {
    px: 2,
    py: 1.5,
  },
};

const TotalView = ({
  items,
}: {
  items: Array<{
    title: string;
    value: string | number | React.ReactNode;
    bold?: boolean;
  }>;
}) => {
  const { i18n } = useLingui();

  return (
    <>
      {items.map((item, index) => {
        const labelProps = item.bold
          ? {
              fontWeight: 500,
            }
          : {};
        const valueProps: TypographyTypeMap['props'] = item.bold
          ? {
              variant: 'subtitle2',
              fontWeight: 600,
            }
          : {
              variant: 'body1',
            };

        return (
          <React.Fragment key={index}>
            {index !== 0 && <Divider />}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                px: 3,
                py: 1.5,
              }}
            >
              <Typography variant="body1" {...labelProps}>
                {item.title}
              </Typography>
              <Typography {...valueProps}>{item.value}</Typography>
            </Box>
          </React.Fragment>
        );
      })}
    </>
  );
};

export const PreviewItemsSection = ({ invoice }: IPreviewItemsSectionProps) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay, formatFromMinorUnits } = useCurrencies();

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>{t(
        i18n
      )`Items`}</Typography>
      <Stack spacing={2}>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t(i18n)`Name`}</TableCell>
                <TableCell align="center">{t(i18n)`Quantity`}</TableCell>
                <TableCell align="right">{t(i18n)`Price`}</TableCell>
                <TableCell align="right">{t(
                  i18n
                )`Amount, (excl.) tax`}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.line_items.map((item, index) => {
                const price = item.product.price
                  ? formatCurrencyToDisplay(
                      item.product.price.value,
                      item.product.price.currency
                    )
                  : 0;
                const amount = item.product.price ? (
                  <>
                    <Typography fontWeight="500">
                      {formatCurrencyToDisplay(
                        item.product.price.value * item.quantity,
                        item.product.price.currency
                      )}
                    </Typography>
                    <Typography variant="body2">{t(
                      i18n
                    )`VAT ${formatFromMinorUnits(
                      item.product.vat_rate.value,
                      item.product.price.currency
                    )}%`}</Typography>
                  </>
                ) : (
                  0
                );

                return (
                  <TableRow key={index}>
                    <TableCell {...tableCellStyles}>
                      {item.product.name}
                    </TableCell>
                    <TableCell {...tableCellStyles} align="center">
                      {item.quantity}
                    </TableCell>
                    <TableCell {...tableCellStyles} align="right">
                      {price}
                    </TableCell>
                    <TableCell {...tableCellStyles} align="right">
                      {amount}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <Stack direction="column">
            <TotalView
              items={[
                {
                  title: t(i18n)`Subtotal`,
                  value:
                    invoice.subtotal &&
                    formatCurrencyToDisplay(invoice.subtotal, invoice.currency),
                },
                {
                  title: t(i18n)`Discounted subtotal`,
                  value:
                    invoice.discounted_subtotal &&
                    formatCurrencyToDisplay(
                      invoice.discounted_subtotal,
                      invoice.currency
                    ),
                },
                {
                  title: t(i18n)`Total taxes`,
                  value: formatCurrencyToDisplay(
                    invoice.total_vat_amount,
                    invoice.currency
                  ),
                },
                {
                  title: t(i18n)`Total`,
                  value: formatCurrencyToDisplay(
                    invoice.total_amount_with_credit_notes,
                    invoice.currency
                  ),
                  bold: true,
                },
              ]}
            />
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
};
