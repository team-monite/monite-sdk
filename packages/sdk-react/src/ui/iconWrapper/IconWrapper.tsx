import React, {
  ReactNode,
  forwardRef,
  useState,
  useEffect,
  MouseEvent,
  FocusEvent,
} from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { SxProps, useThemeProps } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { Theme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

interface IconWrapperEvents {
  onHover?: (event: MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
}

export interface MoniteIconWrapperProps
  extends IconButtonProps,
    IconWrapperEvents {
  icon?: ReactNode;
  fallbackIcon?: ReactNode;
  tooltip?: string;
  color?:
    | 'inherit'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  sx?: SxProps<Theme>;
  isDynamic?: boolean;
  ariaLabelOverride?: string;
}

/**
 * IconWrapper component
 *
 * A customizable wrapper for icon buttons that allows:
 * - Compatibility with Material UI theming.
 * - Accessibility features, including a customizable `aria-label`.
 * - Optional tooltips for additional context.
 * - Dynamic icon swapping on hover if `isDynamic` is enabled.
 * - Integration of custom event handlers (onClick, onHover, onFocus, onBlur).
 *
 * @component
 * @example
 * <IconWrapper
 *   icon={<CustomIcon />}
 *   fallbackIcon={<ArrowBackIcon />}
 *   tooltip="Go back"
 *   onClick={() => console.log('Icon clicked')}
 *   isDynamic={true}
 * />
 *
 * @param {ReactNode} [icon] - A custom icon to display, which can be any React node, SVG, image, or component.
 * @param {ReactNode} [fallbackIcon] - A fallback icon used when `icon` is not provided.
 * @param {string} [tooltip] - Tooltip text displayed on hover.
 * @param {'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'} [color="default"] - Icon color, using MUI theme colors.
 * @param {SxProps<Theme>} [sx] - MUI system properties for custom styling.
 * @param {() => void} onClick - Callback executed on button click.
 * @param {boolean} [isDynamic=false] - Determines if icon should change on hover.
 * @param {string} [ariaLabelOverride] - Custom `aria-label` for screen readers, defaults based on icon.
 * @param {React.MouseEvent<HTMLButtonElement>} [onHover] - Callback for hover events.
 * @param {React.FocusEvent<HTMLButtonElement>} [onFocus] - Callback for focus events.
 * @param {React.FocusEvent<HTMLButtonElement>} [onBlur] - Callback for blur events.
 *
 * @returns {JSX.Element} The IconWrapper component
 */
export const IconWrapper = forwardRef<
  HTMLButtonElement,
  MoniteIconWrapperProps
>(
  (
    {
      icon,
      fallbackIcon,
      tooltip,
      onClick = () => {},
      onHover,
      onFocus,
      onBlur,
      ariaLabelOverride,
      isDynamic = false,
      ...props
    },
    ref
  ) => {
    const themeProps = useThemeProps({
      props: { icon, fallbackIcon },
      name: 'MoniteIconWrapper',
    });

    const [displayIcon, setDisplayIcon] = useState<ReactNode>(
      themeProps.icon || themeProps.fallbackIcon || <CloseIcon />
    );

    useEffect(() => {
      setDisplayIcon(
        themeProps.icon || themeProps.fallbackIcon || <CloseIcon />
      );
    }, [themeProps.icon, themeProps.fallbackIcon]);

    const handleMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
      onHover?.(event);
      if (isDynamic) {
        setDisplayIcon(<ArrowBackIcon />);
      }
    };

    const handleMouseLeave = () => {
      setDisplayIcon(
        themeProps.icon || themeProps.fallbackIcon || <CloseIcon />
      );
    };

    // eslint-disable-next-line lingui/no-unlocalized-strings
    const ariaLabel = ariaLabelOverride || 'Icon button';

    const renderIconButton = () => (
      <IconButton
        ref={ref}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={(event) => onFocus?.(event)}
        onBlur={(event) => onBlur?.(event)}
        aria-label={ariaLabel}
        {...props}
      >
        {displayIcon}
      </IconButton>
    );

    return tooltip ? (
      <Tooltip title={tooltip}>{renderIconButton()}</Tooltip>
    ) : (
      renderIconButton()
    );
  }
);
