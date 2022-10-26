import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, UArrowLeft, Box } from '@team-monite/ui-kit-react';

type NavHeaderProps = {
  handleBack?: () => void;
};

const NavHeader = ({ handleBack }: NavHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Box height={48} ml={-10}>
      <Button
        color="grey"
        leftIcon={<UArrowLeft width={24} height={24} />}
        variant="text"
        onClick={handleBack}
      >
        {t('payment:widget.back')}
      </Button>
    </Box>
  );
};

export default NavHeader;
