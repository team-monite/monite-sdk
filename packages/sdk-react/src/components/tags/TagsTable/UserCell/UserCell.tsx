import React from 'react';

import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import { useEntityUserById } from '@/core/queries';
import { TagReadSchema } from '@monite/sdk-api';
import { Chip, Box, Skeleton, Typography } from '@mui/material';

interface Props {
  id: TagReadSchema['created_by_entity_user_id'];
}

export const UserCell = ({ id }: Props) => {
  const { data: user, isLoading } = useEntityUserById(id);

  return (
    <Box>
      <Chip
        avatar={
          isLoading ? (
            <Skeleton
              animation="wave"
              variant="circular"
              width={24}
              height={24}
              sx={{ flexShrink: 0 }}
            />
          ) : (
            <UserAvatar
              alt={`${user?.first_name?.slice(0, 1).toUpperCase() ?? ''}${
                user?.last_name?.slice(0, 1).toLocaleUpperCase() ?? ''
              }`}
              fileId={user?.userpic_file_id}
              sx={{ width: 24, height: 24 }}
            />
          )
        }
        label={
          isLoading ? (
            <Skeleton
              animation="wave"
              height={10}
              width="100%"
              sx={{ flexShrink: 0, ml: 1, minWidth: '4em' }}
            />
          ) : (
            <Typography sx={{ ml: 1 }}>
              {!!user && `${user.first_name} ${user.last_name}`}
            </Typography>
          )
        }
        sx={{ backgroundColor: 'transparent', color: 'text.primary' }}
      />
    </Box>
  );
};
