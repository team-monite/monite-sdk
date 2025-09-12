import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Circle } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { lighten, styled, useTheme, useThemeProps } from '@mui/material/styles';
import { forwardRef, useMemo } from 'react';

type PurchaseOrderStatus =
  components['schemas']['PurchaseOrderResponseSchema']['status'];
type StatusConfigKey = PurchaseOrderStatus & keyof StatusConfigMap;

interface StatusConfig {
  label: string;
  color: string;
}

interface StatusConfigMap {
  draft: StatusConfig;
  issued: StatusConfig;
}

export interface MonitePurchaseOrderStatusChipProps {
  status: components['schemas']['PurchaseOrderResponseSchema']['status'];
  icon?: boolean;
  variant?: ChipProps['variant'];
  size?: ChipProps['size'];
}

export const PurchaseOrderStatusChip = forwardRef<
  HTMLDivElement,
  MonitePurchaseOrderStatusChipProps
>((inProps, ref) => {
  const { status, icon, size, variant } = useThemeProps({
    props: inProps,
    name: 'MonitePurchaseOrderStatusChip',
  });

  const { i18n } = useLingui();
  const theme = useTheme();

  const statusConfig: StatusConfigMap = useMemo(
    () => ({
      draft: {
        label: t(i18n)`Draft`,
        color: theme.palette.secondary.main,
      },
      issued: {
        label: t(i18n)`Issued`,
        color: theme.palette.primary.main,
      },
    }),
    [i18n, theme.palette.secondary.main, theme.palette.primary.main]
  );

  const config: StatusConfig = useMemo(() => {
    const isValidStatus = (
      status: PurchaseOrderStatus
    ): status is StatusConfigKey => {
      return status in statusConfig;
    };

    return isValidStatus(status)
      ? statusConfig[status]
      : {
          label: status || t(i18n)`Unknown`,
          color: theme.palette.grey[500],
        };
  }, [status, statusConfig, i18n, theme.palette.grey]);

  const chipStyles = useMemo(
    () => ({
      color: config.color,
      backgroundColor: lighten(config.color, 0.9),
      border: 'none',
      '& .MuiChip-icon': {
        color: config.color,
      },
    }),
    [config.color]
  );

  const chipIcon = useMemo(
    () => (icon ? <Circle sx={{ fontSize: '10px !important' }} /> : undefined),
    [icon]
  );

  return (
    <StyledChip
      className="Monite-PurchaseOrderStatusChip"
      ref={ref}
      sx={chipStyles}
      icon={chipIcon}
      label={config.label}
      size={size}
      status={status}
      variant={variant ?? 'outlined'}
    />
  );
});

export const StyledChip = styled(
  forwardRef<
    HTMLDivElement,
    ChipProps & Omit<MonitePurchaseOrderStatusChipProps, 'icon'>
  >((props, ref) => <Chip ref={ref} {...props} />),
  {
    name: 'MonitePurchaseOrderStatusChip',
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});
