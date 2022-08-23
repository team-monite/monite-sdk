import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, UArrowLeft, Box } from '@monite/ui';
import { useComponentsContext } from '@monite/react-kit';

const NavHeader = () => {
  const navigate = useNavigate();
  const { t } = useComponentsContext();

  return (
    <Box height={48} ml={'-10px'}>
      <Button
        color="grey"
        leftIcon={<UArrowLeft width={24} height={24} />}
        variant="text"
        onClick={() => navigate(-1)}
      >
        {t('payment:widget.back')}
      </Button>
    </Box>
  );
};

export default NavHeader;
