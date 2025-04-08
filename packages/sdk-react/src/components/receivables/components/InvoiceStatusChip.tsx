import { forwardRef } from 'react';

import { components } from '@/api';
import {
  INVOICE_STATUS_TO_MUI_ICON_MAP,
  ROW_TO_TAG_STATUS_MUI_MAP,
} from '@/components/receivables/consts';
import { getCommonStatusLabel } from '@/components/receivables/utils';
import { useLingui } from '@lingui/react';
import { Circle } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

export interface MoniteInvoiceStatusChipProps {
  icon?: boolean;
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
  /** Display status icon? */
  /** The status of the invoice. */
  status: components['schemas']['ReceivablesStatusEnum'];
  /** The variant of the Chip. */
}

/**
 * Displays the status of an Invoice.
 */

export const InvoiceStatusChip = forwardRef<
  HTMLDivElement,
  MoniteInvoiceStatusChipProps
>((inProps, ref) => {
  const { status, variant, icon, size } = useThemeProps({
    props: inProps,
    name: 'MoniteInvoiceStatusChip',
  });

  const { i18n } = useLingui();

  const Icon = INVOICE_STATUS_TO_MUI_ICON_MAP[status];

  return (
    <StyledChip
      ref={ref}
      color={ROW_TO_TAG_STATUS_MUI_MAP[status]}
      icon={
        icon && Icon ? (
          <Icon fontSize="small" />
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
    ChipProps & Omit<MoniteInvoiceStatusChipProps, 'icon'>
  >((props, ref) => <Chip ref={ref} {...props} />),
  {
    name: 'MoniteInvoiceStatusChip',
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});
