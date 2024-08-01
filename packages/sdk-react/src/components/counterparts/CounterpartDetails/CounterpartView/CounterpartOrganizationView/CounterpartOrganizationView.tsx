import { ReactNode } from 'react';

import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Divider, CardActions } from '@mui/material';

import type { CounterpartShowCategories } from '../../../Counterpart.types';
import { CounterpartDataTestId } from '../../../Counterpart.types';
import { CounterpartOrganizationFields } from '../../CounterpartForm';
import { printCounterpartType } from '../../helpers';

type CounterpartOrganizationViewProps = {
  actions: ReactNode;
  counterpart: CounterpartOrganizationFields & { taxId: string | undefined };
} & CounterpartShowCategories;

export const CounterpartOrganizationView = ({
  actions,
  counterpart: { companyName, phone, email, isVendor, taxId, isCustomer },
  showCategories,
}: CounterpartOrganizationViewProps) => {
  const { i18n } = useLingui();

  return (
    <MoniteCard
      items={[
        {
          label: t(i18n)`Company name`,
          value: companyName,
        },
        {
          label: t(i18n)`Category`,
          value:
            showCategories &&
            printCounterpartType(
              isCustomer ? t(i18n)`Customer` : undefined,
              isVendor ? t(i18n)`Vendor` : undefined
            ),
        },
        {
          label: t(i18n)`Phone number`,
          value: phone,
        },
        {
          label: t(i18n)`Email`,
          value: email,
        },
        {
          label: t(i18n)`Tax ID`,
          value: taxId,
        },
      ]}
      data-testid={CounterpartDataTestId.OrganizationView}
    >
      {actions && (
        <>
          <Divider />
          <CardActions>{actions}</CardActions>
        </>
      )}
    </MoniteCard>
  );
};
