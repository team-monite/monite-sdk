import React from 'react';

import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import { useEntityUserById } from '@/core/queries';
import { Chip, Skeleton, Box } from '@mui/material';

interface IApprovalPoliciesUserProps {
  entityUserId: string;
}

export const ApprovalPoliciesUser = ({
  entityUserId,
}: IApprovalPoliciesUserProps) => {
  const { data: entityUser, isInitialLoading } =
    useEntityUserById(entityUserId);

  if (isInitialLoading) {
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

  if (!entityUser) {
    return null;
  }

  const name = `${entityUser.first_name} ${entityUser.last_name}`;

  return (
    <Box>
      <Chip
        avatar={<UserAvatar fileId={entityUser.userpic_file_id} />}
        label={name}
        variant="outlined"
        color="secondary"
      />
    </Box>
  );
};
