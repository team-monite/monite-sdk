import { useEntityUserById } from '@/core/queries';
import { Skeleton } from '@mui/material';

export const UserCell = ({ id }: { id: string }) => {
  const { data: user, isLoading } = useEntityUserById(id);

  return (
    <span>
      {isLoading ? (
        <Skeleton
          animation="wave"
          height={10}
          width="100%"
          sx={{ minWidth: '4em' }}
        />
      ) : (
        !!user && `${user.first_name} ${user.last_name}`
      )}
    </span>
  );
};
