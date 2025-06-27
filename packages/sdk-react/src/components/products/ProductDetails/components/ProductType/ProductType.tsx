import { components } from '@/api';
import { Badge } from '@/ui/components/badge';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { Box, BriefcaseBusiness } from 'lucide-react';

type ProductServiceTypeEnum = components['schemas']['ProductServiceTypeEnum'];

const getTypeComponent = (type: ProductServiceTypeEnum, i18n: I18n) => {
  const icon =
    type === 'product' ? (
      <Box width={16} height={16} />
    ) : (
      <BriefcaseBusiness width={16} height={16} />
    );
  const label = type === 'product' ? t(i18n)`Product` : t(i18n)`Service`;

  return (
    <Badge variant="secondary">
      {icon} {label}
    </Badge>
  );
};

export const ProductType = ({ type }: { type: ProductServiceTypeEnum }) => {
  const { i18n } = useLingui();

  return getTypeComponent(type, i18n);
};
