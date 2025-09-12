import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { useCurrencies } from '@/core/hooks';
import { useCounterpartById } from '@/core/queries';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, BoxProps, Skeleton, Typography } from '@mui/material';

interface OverviewTabPanelProps
  extends Pick<BoxProps, 'id' | 'role' | 'aria-labelledby'> {
  purchaseOrder: components['schemas']['PurchaseOrderResponseSchema'];
}

export const OverviewTabPanel = ({
  purchaseOrder,
  ...restProps
}: OverviewTabPanelProps) => {
  const { i18n } = useLingui();

  const { formatCurrencyToDisplay } = useCurrencies();
  const {
    data: counterpart,
    isLoading: isCounterpartLoading,
    error: counterpartError,
  } = useCounterpartById(purchaseOrder.counterpart_id);

  const totalAmount =
    purchaseOrder.items?.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    ) || 0;

  return (
    <Box
      sx={{
        '& > * + *': {
          mt: 5,
        },
      }}
      {...restProps}
    >
      <MoniteCard
        items={[
          {
            label: t(i18n)`Vendor`,
            value: isCounterpartLoading ? (
              <Skeleton variant="text" width="50%" />
            ) : counterpartError || !counterpart ? (
              '—'
            ) : (
              <Typography fontWeight={500}>
                {getCounterpartName(counterpart)}
              </Typography>
            ),
          },
          {
            label: t(i18n)`Total`,
            value: (
              <Typography fontWeight={500}>
                {formatCurrencyToDisplay(totalAmount, purchaseOrder.currency)}
              </Typography>
            ),
          },
        ]}
      />
    </Box>
  );
};
