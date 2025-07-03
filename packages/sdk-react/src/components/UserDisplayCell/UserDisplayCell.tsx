import { useMemo } from 'react';

import { getIndividualName, getUserDisplayName } from '@/core/utils';
import { UserAvatar } from '@/ui/UserAvatar/UserAvatar';
import { type Theme } from '@monite/sdk-react/mui-styles';
import { type SxProps, Box, Typography } from '@mui/material';

interface UserDisplayCellProps {
  user: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    login?: string | null;
    userpic_file_id?: string | null;
  };
  showUserEmail?: boolean;
  showAvatar?: boolean;
  avatarSize?: number;
  variant?: 'inline' | 'stacked';
  typographyVariant?: 'body1' | 'body2';
  sx?: SxProps<Theme>;
}

export const UserDisplayCell = ({
  user,
  showUserEmail = false,
  showAvatar = true,
  avatarSize = 24,
  variant = 'inline',
  typographyVariant = 'body2',
  sx,
}: UserDisplayCellProps) => {
  const displayName = useMemo(
    () => getUserDisplayName(user, showUserEmail),
    [user, showUserEmail]
  );
  const altDisplayName = useMemo(
    () => getIndividualName(user.first_name || '', user.last_name || ''),
    [user.first_name, user.last_name]
  );

  if (variant === 'stacked') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          ...sx,
        }}
      >
        {showAvatar && (
          <UserAvatar
            sx={{ width: avatarSize, height: avatarSize }}
            alt={altDisplayName}
            fileId={user.userpic_file_id}
          />
        )}
        <Typography
          variant={typographyVariant}
          title={displayName ?? ''}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          {displayName ?? ''}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
      {showAvatar && (
        <UserAvatar
          sx={{ width: avatarSize, height: avatarSize }}
          alt={altDisplayName}
          fileId={user.userpic_file_id}
        />
      )}
      <Typography
        variant={typographyVariant}
        title={displayName ?? ''}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {displayName ?? ''}
      </Typography>
    </Box>
  );
};
