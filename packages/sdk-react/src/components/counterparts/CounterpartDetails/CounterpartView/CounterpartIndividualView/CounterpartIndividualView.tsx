import { ReactNode } from 'react';

import {
  type CounterpartShowCategories,
  CounterpartDataTestId,
} from '@/components/counterparts/types';
import { getIndividualName } from '@/core/utils';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CardActions, Divider } from '@mui/material';

import { CounterpartIndividualFields } from '../../CounterpartForm';
import { printCounterpartType } from '../../helpers';

type CounterpartIndividualViewProps = {
  actions: ReactNode;
  counterpart: CounterpartIndividualFields & { taxId: string | undefined };
} & CounterpartShowCategories;

export const CounterpartIndividualView = ({
  actions,
  counterpart: {
    firstName,
    lastName,
    phone,
    email,
    isVendor,
    isCustomer,
    taxId,
  },
  showCategories,
}: CounterpartIndividualViewProps) => {
  const { i18n } = useLingui();

  return (
    <MoniteCard
      data-testid={CounterpartDataTestId.IndividualView}
      items={[
        {
          label: t(i18n)`Name`,
          value: getIndividualName(firstName, lastName),
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
