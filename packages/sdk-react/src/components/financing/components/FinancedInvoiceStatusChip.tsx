import { forwardRef } from 'react';

import { components } from '@/api';
import {
  FINANCE_INVOICE_STATUS_TO_MUI_ICON_MAP,
  ROW_TO_TAG_FINANCE_STATUS_MUI_MAP,
  BACKGROUND_FINANCE_STATUS_MUI_MAP,
} from '@/components/financing/consts';
import { getCommonStatusLabel } from '@/components/financing/utils';
import { useLingui } from '@lingui/react';
import { Circle } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

export interface MoniteFinancedInvoiceStatusChipProps {
  /** Whether to display status icon. */
  icon?: boolean;
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
  /** The status of the invoice. */
  status: components['schemas']['WCInvoiceStatus'];
}

/**
 * Displays the status of an Invoice.
 */

export const FinancedInvoiceStatusChip = forwardRef<
  HTMLDivElement,
  MoniteFinancedInvoiceStatusChipProps
>((inProps, ref) => {
  const { status, variant, icon, size } = useThemeProps({
    props: inProps,
    name: 'MoniteFinancedInvoiceStatusChip',
  });

  const { i18n } = useLingui();

  const Icon = FINANCE_INVOICE_STATUS_TO_MUI_ICON_MAP[status];

  return (
    <StyledChip
      ref={ref}
      sx={{
        width: 'auto',
        color: ROW_TO_TAG_FINANCE_STATUS_MUI_MAP[status],
        bgcolor: BACKGROUND_FINANCE_STATUS_MUI_MAP[status],
      }}
      icon={
        icon && Icon ? (
          <Icon
            sx={{
              fontSize: 16,
              fill: ROW_TO_TAG_FINANCE_STATUS_MUI_MAP[status],
            }}
          />
        ) : (
          <Circle sx={{ fontSize: '10px !important' }} />
        )
      }
      label={getCommonStatusLabel(i18n, status)}
      size={size}
      status={status}
      variant={variant ?? 'filled'}
    />
  );
});

const StyledChip = styled(
  forwardRef<
    HTMLDivElement,
    ChipProps & Omit<MoniteFinancedInvoiceStatusChipProps, 'icon'>
  >((props, ref) => <Chip ref={ref} {...props} />),
  {
    name: 'MoniteFinancedInvoiceStatusChip',
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});
