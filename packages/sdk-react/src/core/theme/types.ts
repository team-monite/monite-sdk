import { components } from '@/api';
import { ChipProps } from '@mui/material';

type TypographyStyle = {
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
};

/**
 * Configuration for customizing button styles
 * Supports all CSS properties including gradients for backgrounds
 *
 * @example
 * ```typescript
 * const buttonConfig: ButtonStyleConfig = {
 *   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 *   color: '#ffffff',
 *   border: '2px solid #667eea',
 *   borderRadius: 12,
 *   fontWeight: 600,
 *   hover: {
 *     background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
 *   },
 * };
 * ```
 */
export interface ButtonStyleConfig {
  /**
   * Background color or CSS gradient
   * @example '#667eea'
   * @example 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
   */
  background?: string;

  /**
   * Text color
   * @example '#ffffff'
   */
  color?: string;

  /**
   * Border style (CSS shorthand)
   * @example '2px solid #667eea'
   * @example 'none'
   */
  border?: string;

  /**
   * Border radius in pixels or CSS value
   * @example 8
   * @example '0.5rem'
   */
  borderRadius?: string | number;
  /**
   * Font weight
   * @example 400
   * @example 600
   * @example 'bold'
   */
  fontWeight?: string | number;
  /**
   * Box shadow for elevation effects
   * @example '0 4px 6px rgba(0, 0, 0, 0.1)'
   * @example '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)'
   */
  boxShadow?: string;
  /**
   * CSS transition duration
   * @example '200ms'
   * @example '0.3s'
   */
  transitionDuration?: string;
  /**
   * CSS transition timing function
   * @example 'ease-in-out'
   * @example 'cubic-bezier(0.4, 0, 0.2, 1)'
   */
  transitionTimingFunction?: string;
  /**
   * CSS transition property (which properties to animate)
   * @example 'all'
   * @example 'background, color, box-shadow'
   */
  transitionProperty?: string;
  hover?: Partial<
    Omit<ButtonStyleConfig, 'hover' | 'active' | 'focus' | 'disabled'>
  >;
  active?: Partial<
    Omit<ButtonStyleConfig, 'hover' | 'active' | 'focus' | 'disabled'>
  >;
  focus?: Partial<
    Omit<ButtonStyleConfig, 'hover' | 'active' | 'focus' | 'disabled'>
  >;
  disabled?: Partial<
    Omit<ButtonStyleConfig, 'hover' | 'active' | 'focus' | 'disabled'>
  >;
}

export type ThemeConfig = {
  borderRadius?: number;
  spacing?: number;

  colors?: {
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    neutral?: string;

    info?: string;
    success?: string;
    warning?: string;
    error?: string;

    background?: string;

    text?: string;

    rowBorder?: string;
  };

  typography?: {
    fontFamily?: string;
    fontSize?: number;

    h1?: TypographyStyle;
    h2?: TypographyStyle;
    h3?: TypographyStyle;
    subtitle1?: TypographyStyle;
    subtitle2?: TypographyStyle;
    body1?: TypographyStyle;
    body2?: TypographyStyle;
  };

  components?: {
    invoiceStatusChip?: Partial<MoniteInvoiceStatusChipProps>;
    payableStatusChip?: Partial<MonitePayableStatusChipProps>;
    approvalRequestStatusChip?: Partial<MoniteApprovalRequestStatusChipProps>;
    invoiceRecurrenceStatusChip?: Partial<MoniteInvoiceRecurrenceStatusChipProps>;
    invoiceRecurrenceIterationStatusChip?: Partial<MoniteInvoiceRecurrenceIterationStatusChipProps>;
    counterpartStatusChip?: Partial<MoniteCounterpartStatusChipProps>;
    approvalStatusChip?: Partial<MoniteApprovalStatusChipProps>;
    styles?: {
      payables?: {
        button?: {
          primary?: ButtonStyleConfig; // Primary action buttons (Save, Submit, Approve, Pay)
          secondary?: ButtonStyleConfig; // Secondary action buttons (Edit, outlined Pay button)
          tertiary?: ButtonStyleConfig; // Tertiary/text buttons (Reopen, Cancel without destruction)
          destructive?: ButtonStyleConfig; // Destructive action buttons (Reject, Force Reject, Delete)
        };
      };
    };
  };
};

export type MonitePalette = {
  primary: {
    dark: string;
    main: string;
    light: string;
    '30': string;
    '40': string;
    '50': string;
    '60': string;
    '80': string;
    '90': string;
  };
  secondary: {
    main: string;
    dark: string;
  };
  neutral: {
    '10': string;
    '50': string;
    '70': string;
    '80': string;
    '90': string;
    '95': string;
  };
  info: {
    main: string;
    light: string;
    dark: string;
  };
  success: {
    main: string;
    light: string;
    dark: string;
  };
  warning: {
    main: string;
    light: string;
    dark: string;
  };
  error: {
    main: string;
    light: string;
    dark: string;
  };
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  divider: string;
  status: {
    draft: string;
    new: string;
    approve_in_progress: string;
    paid: string;
    waiting_to_be_paid: string;
    rejected: string;
    partially_paid: string;
    canceled: string;
    all: string;
  };
};

interface BaseChipProps {
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
}

interface BaseStatusChipProps extends BaseChipProps {
  /** Display status icon? Set to false for dot, true for full icon, null to hide completely */
  icon?: boolean | null;
}

export type MoniteCounterpartType = 'customer' | 'vendor';

export interface MoniteInvoiceStatusChipProps extends BaseStatusChipProps {
  /** The status of the invoice. */
  status: components['schemas']['ReceivablesStatusEnum'];
}

export interface MoniteInvoiceRecurrenceStatusChipProps
  extends BaseStatusChipProps {
  /** The status of the recurrence. */
  status: components['schemas']['RecurrenceStatus'];
}

export interface MoniteInvoiceRecurrenceIterationStatusChipProps
  extends BaseStatusChipProps {
  /** The status of the iteration. */
  status: components['schemas']['IterationStatus'];
}

export interface MonitePayableStatusChipProps extends BaseStatusChipProps {
  /** The status of the payable. */
  status: components['schemas']['PayableStateEnum'];
  /** Custom colors for each payable status */
  colors?: Partial<Record<components['schemas']['PayableStateEnum'], string>>;
}

export interface MoniteCounterpartStatusChipProps extends BaseChipProps {
  /** The status of the invoice. */
  status: MoniteCounterpartType;
}

export interface MoniteApprovalRequestStatusChipProps
  extends BaseStatusChipProps {
  /** The status of the approval request. */
  status: components['schemas']['ApprovalRequestStatus'];
}

export interface MoniteApprovalStatusChipProps extends BaseStatusChipProps {
  /** The status of the payable. */
  status: components['schemas']['ApprovalPolicyStatus'];
}
