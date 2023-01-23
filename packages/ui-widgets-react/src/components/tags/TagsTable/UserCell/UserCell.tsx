import React from 'react';

import { useEntityUserById } from 'core/queries';
import { Avatar, Box, Spinner } from '@team-monite/ui-kit-react';

interface Props {
  id: string;
}

const UserCell = ({ id }: Props) => {
  const { data: user, isLoading } = useEntityUserById(id);

  return user ? (
    <Box display="flex">
      {isLoading && <Spinner pxSize={24} />}
      <Avatar size={24} src={user.userpic?.url} />
      &nbsp;
      {`${user.first_name} ${user.last_name}`}
    </Box>
  ) : null;
};

export default UserCell;
