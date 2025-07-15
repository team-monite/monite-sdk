import { components } from '@/api';
import { UUserSquare } from '@/components/approvalPolicies/ApprovalPoliciesTable/components/icons/UUserSquare';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { Badge } from '@/ui/components/badge';
import { Skeleton } from '@/ui/components/skeleton';

import { getVariantProps } from '../utils/getVariantProps';

interface RoleProps {
  roleId: string;
  variant?: 'default' | 'outlined' | 'filled';
  quoted?: boolean;
  roleData?: components['schemas']['RoleResponse'];
}

export const Role = ({
  roleId,
  variant = 'default',
  quoted = false,
  roleData,
}: RoleProps) => {
  const { api } = useMoniteContext();

  const {
    data: role,
    isLoading,
    isError,
  } = api.roles.getRolesId.useQuery(
    {
      path: { role_id: roleId },
    },
    {
      enabled: !roleData,
    }
  );

  const displayRole = roleData ?? role;
  const isRoleLoading = !roleData && isLoading;

  if (!displayRole && !isRoleLoading && isError && roleId) {
    const fallbackDisplayName = 'N/A';
    const { badgeVariant, className } = getVariantProps({
      variant,
      isError: true,
      componentType: 'role',
    });

    return (
      <Badge variant={badgeVariant} className={className}>
        {fallbackDisplayName}
      </Badge>
    );
  }

  if (!displayRole && !isRoleLoading) {
    return null;
  }

  if (!displayRole) {
    return null;
  }

  const { badgeVariant, className, showIcon } = getVariantProps({
    variant,
    isError: false,
    componentType: 'role',
  });

  return (
    <Badge variant={badgeVariant} className={className}>
      {showIcon && (
        <UUserSquare
          width={24}
          height={24}
          className={
            variant === 'default'
              ? 'mtw:text-[rgb(97,97,97)] mtw:!w-6 mtw:!h-6 mtw:flex-shrink-0'
              : 'mtw:!w-6 mtw:!h-6 mtw:flex-shrink-0'
          }
        />
      )}
      {isRoleLoading ? (
        <Skeleton className="mtw:h-4 mtw:w-20" />
      ) : quoted ? (
        `"${displayRole.name}"`
      ) : (
        displayRole.name
      )}
    </Badge>
  );
};
