import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import { useEntityUserById } from '@/core/queries';
import { Chip, Skeleton } from '@mui/material';

interface UserProps {
  userId: string;
}

export const User = ({ userId }: UserProps) => {
  const { data: entityUser, isLoading } = useEntityUserById(userId);

  if (!entityUser) {
    return null;
  }

  return (
    <>
      <Chip
        avatar={
          <UserAvatar
            fileId={entityUser.userpic_file_id}
            sx={{ width: 24, height: 24 }}
          />
        }
        label={
          isLoading ? (
            <Skeleton height="50%" width={100} animation="wave" />
          ) : (
            `${entityUser.first_name ?? ''} ${
              entityUser.last_name ?? ''
            }`.trim()
          )
        }
      />
    </>
  );
};
