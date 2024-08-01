import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import { useEntityUserById } from '@/core/queries';
import { Chip, Skeleton } from '@mui/material';

interface UserCellProps {
  entityUserId: string;
}

export const UserCell = ({ entityUserId }: UserCellProps) => {
  const { data: entityUser, isLoading } = useEntityUserById(entityUserId);

  if (!entityUser) {
    return null;
  }

  if (isLoading) {
    return (
      <Chip
        label={
          <Skeleton
            variant="rounded"
            height="50%"
            width={100}
            animation="wave"
          />
        }
      />
    );
  }

  return (
    <Chip
      avatar={<UserAvatar fileId={entityUser.userpic_file_id} />}
      label={
        `${entityUser.first_name ?? ''} ${entityUser.last_name ?? ''}`.trim() ||
        '—'
      }
      variant="outlined"
      color="secondary"
    />
  );
};
