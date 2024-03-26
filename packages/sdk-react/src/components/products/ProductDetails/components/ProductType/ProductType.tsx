import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ProductServiceTypeEnum } from '@monite/sdk-api';
import { Box, Typography } from '@mui/material';

import { UBox } from '../../../ProductsTable/components/icons/UBox';
import { UBusiness } from '../../../ProductsTable/components/icons/UBusiness';

const getTypeComponent = (
  type: ProductServiceTypeEnum,
  i18n: I18n
): React.ReactElement => {
  switch (type) {
    case ProductServiceTypeEnum.PRODUCT:
      return (
        <>
          <UBox width={16} />
          <Typography ml={1}>{t(i18n)`Product`}</Typography>
        </>
      );
    case ProductServiceTypeEnum.SERVICE:
      return (
        <>
          <UBusiness width={18} />
          <Typography ml={1}>{t(i18n)`Service`}</Typography>
        </>
      );
  }
};

export const ProductType = ({ type }: { type: ProductServiceTypeEnum }) => {
  const { i18n } = useLingui();

  return (
    <Box display="flex" alignItems="center">
      {getTypeComponent(type, i18n)}
    </Box>
  );
};
