import { useMemo } from 'react';
import type { ElementType } from 'react';

import { InfoOutlined } from '@mui/icons-material';
import { IconButton, Tooltip, type TooltipProps } from '@mui/material';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { SvgIconProps } from '@mui/material/SvgIcon';

interface FormTooltipProps {
  title: TooltipProps['title'];
  placement?: TooltipProps['placement'];
  showArrow?: boolean;
  tooltipProps?: Omit<
    Partial<TooltipProps>,
    'title' | 'placement' | 'children' | 'arrow'
  >;
  iconButtonProps?: Omit<IconButtonProps, 'children'>;
  iconProps?: Omit<SvgIconProps, 'component'>;
  icon?: ElementType;
}

const defaultTooltipProps = {
  placement: 'right' as const,
  arrow: true,
  componentsProps: {
    tooltip: {
      sx: {
        wordWrap: 'break-word',
        whiteSpace: 'break-spaces',
      },
    },
  },
};

const defaultIconButtonProps = {
  size: 'small' as const,
  sx: {
    p: 0,
    ml: 0.5,
    '&:hover': {
      background: 'transparent',
    },
  },
};

const defaultIconProps = {
  sx: {
    fontSize: '1rem',
    verticalAlign: 'middle',
  },
};

export const FormTooltip = ({
  title,
  placement,
  showArrow = true,
  tooltipProps,
  iconButtonProps,
  iconProps,
  icon: Icon = InfoOutlined,
}: FormTooltipProps) => {
  const finalTooltipProps = useMemo(
    () => ({
      ...defaultTooltipProps,
      placement,
      arrow: showArrow,
      ...tooltipProps,
    }),
    [placement, showArrow, tooltipProps]
  );

  const finalIconButtonProps = useMemo(
    () => ({ ...defaultIconButtonProps, ...iconButtonProps }),
    [iconButtonProps]
  );

  const finalIconProps = useMemo(
    () => ({ ...defaultIconProps, ...iconProps }),
    [iconProps]
  );

  return (
    <Tooltip title={title} {...finalTooltipProps}>
      <IconButton {...finalIconButtonProps}>
        <Icon {...finalIconProps} />
      </IconButton>
    </Tooltip>
  );
};
