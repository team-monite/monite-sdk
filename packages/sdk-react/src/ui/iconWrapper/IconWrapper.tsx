import * as React from 'react';
import {
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

interface IconWrapperProps extends IconButtonProps, IconWrapperEvents {
  icon?: ReactNode;
  fallbackIcon?: ReactNode;
  tooltip?: string;
  showCloseIcon?: boolean;
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
  onClick: () => void;
  isDynamic?: boolean;
  ariaLabelOverride?: string;
}

/**
 * IconWrapper component
 *
 * A customizable wrapper for icon buttons that allows:
 * - Theming compatibility with Material UI.
 * - Accessibility features including customizable `aria-label`.
 * - Optional tooltips for additional context.
 * - Dynamic swapping of icons on hover.
 * - Integration of custom event handlers (onClick, onHover, onFocus, onBlur).
 *
 * @component
 * @example
 * <IconWrapper
 *   icon={<CustomIcon />}
 *   fallbackIcon={<ArrowBackIcon />}
 *   tooltip="Go back"
 *   onClick={() => console.log('Icon clicked')}
 *   showCloseIcon={false}
 *   isDynamic={true}
 * />
 *
 * @param {ReactNode} [icon] - A custom icon to display in place of default icons.
 * @param {ReactNode} [fallbackIcon] - A fallback icon if `icon` is not provided, defaults to `CloseIcon` or `ArrowBackIcon` based on `showCloseIcon`.
 * @param {string} [tooltip] - Tooltip text displayed on hover.
 * @param {boolean} [showCloseIcon=true] - Controls default icon appearance. `true` shows `CloseIcon`; `false` shows `ArrowBackIcon`.
 * @param {'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'} [color="default"] - Icon color, using MUI theme colors.
 * @param {SxProps<Theme>} [sx] - MUI system properties for custom styling.
 * @param {() => void} onClick - Callback executed on button click.
 * @param {boolean} [isDynamic=false] - Determines if icon should change on hover.
 * @param {string} [ariaLabelOverride] - Custom `aria-label` for screen readers, default is based on `showCloseIcon`.
 * @param {React.MouseEvent<HTMLButtonElement>} [onHover] - Callback for hover events.
 * @param {React.FocusEvent<HTMLButtonElement>} [onFocus] - Callback for focus events.
 * @param {React.FocusEvent<HTMLButtonElement>} [onBlur] - Callback for blur events.
 *
 * @returns {JSX.Element} The IconWrapper component
 */
export const IconWrapper = forwardRef<HTMLButtonElement, IconWrapperProps>(
  (
    {
      icon,
      fallbackIcon,
      tooltip,
      onClick,
      onHover,
      onFocus,
      onBlur,
      showCloseIcon,
      ariaLabelOverride,
      isDynamic = false,
      ...props
    },
    ref
  ) => {
    const { showCloseIcon: themeShowCloseIcon = true } = useThemeProps({
      props: { showCloseIcon },
      // eslint-disable-next-line lingui/no-unlocalized-strings
      name: 'IconWrapper',
    });

    const [displayIcon, setDisplayIcon] = useState<ReactNode>(
      icon ||
        fallbackIcon ||
        (themeShowCloseIcon ? <CloseIcon /> : <ArrowBackIcon />)
    );

    useEffect(() => {
      setDisplayIcon(
        icon ||
          fallbackIcon ||
          (themeShowCloseIcon ? <CloseIcon /> : <ArrowBackIcon />)
      );
    }, [icon, fallbackIcon, themeShowCloseIcon]);

    const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
      onHover?.(event);
      if (isDynamic) {
        setDisplayIcon(showCloseIcon ? <ArrowBackIcon /> : <CloseIcon />);
      }
    };

    const handleMouseLeave = () => {
      setDisplayIcon(
        icon ||
          fallbackIcon ||
          (themeShowCloseIcon ? <CloseIcon /> : <ArrowBackIcon />)
      );
    };

    const ariaLabel =
      // eslint-disable-next-line lingui/no-unlocalized-strings
      ariaLabelOverride || (themeShowCloseIcon ? 'Close' : 'Back');

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

// eslint-disable-next-line lingui/no-unlocalized-strings
IconWrapper.displayName = 'IconWrapper';
