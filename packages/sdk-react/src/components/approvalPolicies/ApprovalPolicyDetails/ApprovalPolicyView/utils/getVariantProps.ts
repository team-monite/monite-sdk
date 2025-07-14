import { Badge } from '@/ui/components/badge';

type UserVariant = 'default' | 'badge' | 'text' | 'cell';
type RoleVariant = 'default' | 'outlined' | 'filled';
type ComponentType = 'user' | 'role';

interface GetVariantPropsParams {
  variant: UserVariant | RoleVariant;
  isError?: boolean;
  componentType: ComponentType;
  showAvatar?: boolean;
  showUsersAsEmail?: boolean;
  className?: string;
}

interface VariantPropsResult {
  useBadge: boolean;
  badgeVariant: React.ComponentProps<typeof Badge>['variant'];
  className: string;
  showAvatar: boolean;
  showIcon: boolean;
}

/**
 * Unified function to get styling props for both normal and error states
 * Used by both User and Role components for consistent styling
 */
export const getVariantProps = ({
  variant,
  isError = false,
  componentType,
  showAvatar = false,
  showUsersAsEmail = false,
  className = '',
}: GetVariantPropsParams): VariantPropsResult => {
  if (isError) {
    const errorClassName = `mtw:text-muted-foreground ${className}`;

    if (componentType === 'user' && variant !== 'badge') {
      return {
        useBadge: false,
        badgeVariant: 'outline',
        className: errorClassName,
        showAvatar: false,
        showIcon: false,
      };
    }

    return {
      useBadge: true,
      badgeVariant: 'outline',
      className: errorClassName,
      showAvatar: false,
      showIcon: false,
    };
  }

  if (componentType === 'user') {
    return getUserVariantProps(
      variant as UserVariant,
      showAvatar,
      showUsersAsEmail,
      className
    );
  }

  return getRoleVariantProps(variant as RoleVariant, className);
};

function getUserVariantProps(
  variant: UserVariant,
  showAvatar: boolean,
  showUsersAsEmail: boolean,
  className: string
): VariantPropsResult {
  switch (variant) {
    case 'badge':
      return {
        useBadge: true,
        badgeVariant: 'secondary',
        className: `mtw:gap-1 mtw:px-2 mtw:py-1 ${className}`,
        showAvatar: showAvatar,
        showIcon: false,
      };
    case 'cell':
      return {
        useBadge: false,
        badgeVariant: 'secondary',
        className: `mtw:text-sm mtw:font-medium mtw:text-foreground mtw:overflow-hidden mtw:text-ellipsis mtw:whitespace-nowrap mtw:block ${
          showUsersAsEmail ? 'mtw:text-blue-600' : ''
        } ${className}`,
        showAvatar: false,
        showIcon: false,
      };
    case 'text':
    case 'default':
    default:
      return {
        useBadge: false,
        badgeVariant: 'secondary',
        className: `mtw:text-sm mtw:font-medium mtw:text-foreground ${className}`,
        showAvatar: false,
        showIcon: false,
      };
  }
}

function getRoleVariantProps(
  variant: RoleVariant,
  className: string
): VariantPropsResult {
  switch (variant) {
    case 'filled':
      return {
        useBadge: true,
        badgeVariant: 'secondary',
        className: `mtw:inline-flex mtw:items-center mtw:justify-center mtw:h-8 mtw:bg-gray-100 mtw:text-gray-800 mtw:text-sm mtw:leading-4 mtw:font-medium mtw:whitespace-nowrap mtw:border-0 mtw:rounded-lg mtw:px-4 mtw:py-1 ${className}`,
        showAvatar: false,
        showIcon: false,
      };
    case 'outlined':
      return {
        useBadge: true,
        badgeVariant: 'outline',
        className: `mtw:inline-flex mtw:items-center mtw:justify-center mtw:text-sm mtw:font-medium mtw:whitespace-nowrap mtw:rounded mtw:px-2 mtw:py-1 mtw:gap-1 ${className}`,
        showAvatar: false,
        showIcon: true,
      };
    case 'default':
    default:
      return {
        useBadge: true,
        badgeVariant: 'secondary',
        className: `mtw:inline-flex mtw:items-center mtw:justify-center mtw:h-8 mtw:bg-[rgb(248,248,255)] mtw:text-[rgb(55,55,255)] mtw:text-sm mtw:leading-4 mtw:font-medium mtw:whitespace-nowrap mtw:border-0 mtw:rounded-[7.98px] mtw:px-2 mtw:py-[7px] mtw:gap-2 mtw:transition-colors ${className}`,
        showAvatar: false,
        showIcon: true,
      };
  }
}
