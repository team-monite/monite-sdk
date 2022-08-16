import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, UArrowLeft, Box } from '@monite/ui';

const NavHeader = () => {
  const navigate = useNavigate();

  return (
    <Box height={48}>
      <Button
        color="grey"
        leftIcon={<UArrowLeft width={24} height={24} />}
        variant="text"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </Box>
  );
};

export default NavHeader;
