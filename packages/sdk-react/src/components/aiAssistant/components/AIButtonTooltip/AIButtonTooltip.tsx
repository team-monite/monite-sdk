import type { FC, PropsWithChildren, MouseEvent, ReactNode } from 'react';

import { useIsMobile } from '@/core/hooks/useMobile';
import { IconButton, Tooltip } from '@mui/material';

interface AIButtonTooltipProps extends PropsWithChildren {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  ariaLabel: string;
  icon: ReactNode;
}

export const AIButtonTooltip: FC<AIButtonTooltipProps> = ({
  onClick,
  ariaLabel,
  children,
  icon,
}) => {
  const isMobile = useIsMobile();

  return (
    <Tooltip
      hidden={isMobile}
      arrow
      title={children}
      placement="top"
      slotProps={{
        popper: {
          disablePortal: false,
        },
        tooltip: {
          className: 'mtw:!bg-primary-50 mtw:!text-white',
        },
        arrow: {
          className: 'mtw:!text-primary-50',
        },
      }}
    >
      <IconButton
        aria-label={ariaLabel}
        onClick={onClick}
        className="mtw:shrink-0 mtw:!p-0"
        type="button"
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};
