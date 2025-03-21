import { useEntityUserById } from '@/core/queries';
import { Skeleton } from '@mui/material';

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
      {isLoading ? (
        <Skeleton height="50%" width={100} animation="wave" />
      ) : (
        `${entityUser.first_name ?? ''} ${entityUser.last_name ?? ''}`.trim()
      )}
    </>
  );
};
