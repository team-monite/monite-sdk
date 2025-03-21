import { useEntityUserById } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Skeleton, Stack } from '@mui/material';

export const UserCell = ({ userId }: { userId: string }) => {
  const { data: entityUser, isLoading } = useEntityUserById(userId);
  const { i18n } = useLingui();

  const user = entityUser || {
    first_name: t(i18n)`Unspecified`,
    last_name: '',
  };

  const name = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();

  return (
    <Stack
      className="Monite-UserCell"
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ maxWidth: '100%' }}
    >
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
