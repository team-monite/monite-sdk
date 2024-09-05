import { useEntityUserById } from '@/core/queries';
import { calculateAvatarColorIndex } from '@/ui/CounterpartCell/CounterpartCell';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { Avatar, Skeleton, Stack } from '@mui/material';

export const UserCell = ({ userId }: { userId: string }) => {
  const { data: entityUser, isLoading } = useEntityUserById(userId);

  const user = entityUser || {
    first_name: t(i18n)`Unspecified`,
    last_name: '',
  };

  const name = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();

  // Split name into parts by ' ' and take first letters from the first and last parts of the name
  // For example, Mike Borough -> MB
  // Ambercombie -> A
  const avatarLetters = (
    user.first_name &&
    user.first_name.length > 1 &&
    user.last_name &&
    user.last_name.length > 1
      ? user.first_name[0] + user.last_name[0]
      : (user.first_name ?? user.last_name ?? 'A')[0] || ''
  ).toUpperCase();

  return (
    <Stack
      className="Monite-UserCell"
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ maxWidth: '100%' }}
    >
      {isLoading ? (
        <Skeleton
          animation="wave"
          variant="circular"
          width={40}
          height={40}
          sx={{ flexShrink: 0 }}
        />
      ) : (
        <Avatar
          className={
            'MuiAvatar-colored MuiAvatar-' +
            calculateAvatarColorIndex(avatarLetters)
          }
        >
          {avatarLetters}
        </Avatar>
      )}

      {isLoading || !name ? (
        <Skeleton
          animation="wave"
          height={10}
          width="100%"
          sx={{ flexShrink: 0, minWidth: '4em' }}
        />
      ) : (
        <span className="Monite-TextOverflowContainer">{name}</span>
      )}
    </Stack>
  );
};
