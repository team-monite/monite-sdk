import { components } from '@/api';
import { useEntityUserById } from '@/core/queries';
import { Avatar, AvatarFallback } from '@/ui/components/avatar';
import { Badge } from '@/ui/components/badge';
import { Skeleton } from '@/ui/components/skeleton';

import { getVariantProps } from '../utils/getVariantProps';

interface UserProps {
  userId?: string;
  user?: components['schemas']['EntityUserResponse'];
  variant?: 'default' | 'badge' | 'text' | 'cell';
  showUsersAsEmail?: boolean;
  showAvatar?: boolean;
  className?: string;
}

export const User = ({
  userId,
  user,
  variant = 'text',
  showUsersAsEmail = false,
  showAvatar = false,
  className = '',
}: UserProps) => {
  const {
    data: fetchedUser,
    isLoading,
    isError,
  } = useEntityUserById(user ? undefined : userId);

  const entityUser = user || fetchedUser;

  if (!entityUser && !isLoading && isError && userId) {
    // Show N/A as fallback when user data cannot be fetched due to permissions
    const fallbackDisplayName = 'N/A';
    const {
      useBadge,
      badgeVariant,
      className: fallbackClassName,
    } = getVariantProps({
      variant,
      isError: true,
      componentType: 'user',
      className,
    });

    if (useBadge) {
      return (
        <Badge variant={badgeVariant} className={fallbackClassName}>
          {fallbackDisplayName}
        </Badge>
      );
    }

    return <span className={fallbackClassName}>{fallbackDisplayName}</span>;
  }

  if (!entityUser && !isLoading) {
    return null;
  }

  const fullName = entityUser
    ? `${entityUser.first_name ?? ''} ${entityUser.last_name ?? ''}`.trim()
    : '';

  const initials = entityUser
    ? `${entityUser.first_name?.[0] ?? ''}${
        entityUser.last_name?.[0] ?? ''
      }`.toUpperCase()
    : '';

  const getDisplayName = () => {
    if (showUsersAsEmail && entityUser?.email) {
      return entityUser.email;
    }

    return fullName || entityUser?.email || '';
  };

  const displayName = getDisplayName();

  if (isLoading) {
    return <Skeleton className="mtw:h-4 mtw:w-20" />;
  }

  const {
    useBadge,
    badgeVariant,
    className: variantClassName,
    showAvatar: shouldShowAvatar,
  } = getVariantProps({
    variant,
    isError: false,
    componentType: 'user',
    showAvatar,
    showUsersAsEmail,
    className,
  });

  if (useBadge) {
    return (
      <Badge variant={badgeVariant} className={variantClassName}>
        {shouldShowAvatar && (
          <Avatar className="mtw:w-4 mtw:h-4">
            <AvatarFallback className="mtw:text-xs mtw:font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        )}
        {displayName}
      </Badge>
    );
  }

  return <span className={variantClassName}>{displayName}</span>;
};
