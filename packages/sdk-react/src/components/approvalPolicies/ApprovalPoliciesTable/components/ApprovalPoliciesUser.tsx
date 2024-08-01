import React from 'react';

import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import { useEntityUserById } from '@/core/queries';
import { Chip, Skeleton } from '@mui/material';

interface ApprovalPoliciesUserProps {
  entityUserId: string;
}

export const ApprovalPoliciesUser = ({
  entityUserId,
}: ApprovalPoliciesUserProps) => {
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

  const name = `${entityUser.first_name ?? ''} ${
    entityUser.last_name ?? ''
  }`.trim();

  return (
    <Chip
      avatar={<UserAvatar fileId={entityUser.userpic_file_id} />}
      label={name}
      variant="outlined"
      color="secondary"
    />
  );
};
