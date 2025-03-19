import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Stack, Typography, Chip } from '@mui/material';

import { UBox } from '../../../ProductsTable/components/icons/UBox';
import { UBusiness } from '../../../ProductsTable/components/icons/UBusiness';

const getTypeComponent = (type: ProductServiceTypeEnum, i18n: I18n) => {
  switch (type) {
    case 'product':
      return (
        <>
          <Chip
            icon={<UBox width={16} />}
            label={t(i18n)`Product`}
            size="small"
            sx={{
              backgroundColor: '#F5F5F5',
              color: '#707070',
            }}
          />
        </>
      );
    case 'service':
      return (
        <>
          <Chip
            icon={<UBusiness width={16} />}
            label={t(i18n)`Service`}
            size="small"
            sx={{
              backgroundColor: '#F5F5F5',
              color: '#707070',
            }}
          />
        </>
      );
  }
};

export const ProductType = ({ type }: { type: ProductServiceTypeEnum }) => {
  const { i18n } = useLingui();

  return <Stack direction="row">{getTypeComponent(type, i18n)}</Stack>;
};

type ProductServiceTypeEnum = components['schemas']['ProductServiceTypeEnum'];
