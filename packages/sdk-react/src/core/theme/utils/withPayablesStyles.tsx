import { type ComponentType, type CSSProperties, forwardRef,useMemo } from 'react';
import { Box } from '@mui/material';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { generatePayablesButtonCssVars } from './buttonStyleHelpers';

/**
 * HOC that wraps components with Payables styling context
 *
 * This HOC ensures that CSS variables for button customization are available
 * even when components are rendered in React portals (dialogs, modals, popovers).
 *
 * ## Why This Is Needed
 *
 * CSS variables don't inherit across portal boundaries. When a component like
 * PayableDetails is rendered in a Dialog (which uses a portal), the CSS variables
 * defined on the parent `.Monite-Payables` element are not accessible.
 *
 * This HOC solves the problem by:
 * 1. Adding the `.Monite-Payables` className to the wrapper
 * 2. Generating CSS variables from the theme
 * 3. Applying variables as inline styles (which DO work in portals)
 *
 * ## Usage
 *
 * ```typescript
 * // Before
 * export const PayableDetails = () => { ... };
 *
 * // After
 * const PayableDetailsBase = () => { ... };
 * export const PayableDetails = withPayablesStyles(
 *   PayableDetailsBase,
 *   'PayableDetails'
 * );
 * ```
 *
 * @param Component - The component to wrap
 * @param displayName - Optional display name for React DevTools
 * @returns Wrapped component with Payables styling context
 *
 * @example
 * ```typescript
 * import { withPayablesStyles } from '@/core/theme/utils/withPayablesStyles';
 *
 * const MyComponentBase = () => (
 *   <div>
 *     <Button variant="contained">Primary Button</Button>
 *   </div>
 * );
 *
 * export const MyComponent = withPayablesStyles(MyComponentBase, 'MyComponent');
 * ```
 */
export function withPayablesStyles<P extends object>(
  Component: ComponentType<P>,
  displayName?: string
) {
  const WrappedComponent = forwardRef<any, P>((props, ref) => {
    const { theme } = useMoniteContext();

    const buttonCssVars = useMemo(
      () =>
        generatePayablesButtonCssVars(
          theme.components?.styles?.payables?.button
        ),
      [theme.components?.styles?.payables?.button]
    );

    return (
      <Box
        className="Monite-Payables"
        style={buttonCssVars as CSSProperties}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Component {...props} ref={ref} />
      </Box>
    );
  });

  WrappedComponent.displayName =
    displayName ||
    `withPayablesStyles(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
