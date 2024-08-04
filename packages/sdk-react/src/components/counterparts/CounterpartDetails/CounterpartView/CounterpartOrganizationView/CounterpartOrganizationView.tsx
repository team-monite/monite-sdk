import { ReactNode } from 'react';

import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Divider, CardActions, Box, Typography, Chip } from '@mui/material';

import type { CounterpartShowCategories } from '../../../Counterpart.types';
import { CounterpartDataTestId } from '../../../Counterpart.types';
import { CounterpartOrganizationFields } from '../../CounterpartForm';
import { printCounterpartType } from '../../helpers';

type EmailDefaultDisplayProps = {
  email: string;
  isDefault?: boolean;
};

export const EmailDefaultDisplay = ({
  email,
  isDefault,
}: EmailDefaultDisplayProps) => {
  const { i18n } = useLingui();
  return (
    <Box display="flex" alignItems="center">
      <Typography noWrap sx={{ maxWidth: 250 }} title={email} component="div">
        {email}
      </Typography>
      {isDefault && (
        <Box ml="auto" mr={1}>
          <Chip label={t(i18n)`default`} variant="filled" color="default" />
        </Box>
      )}
    </Box>
  );
};

type CounterpartOrganizationViewProps = {
  actions: ReactNode;
  counterpart: CounterpartOrganizationFields & { taxId: string | undefined };
  defaultEmail?: boolean;
} & CounterpartShowCategories;

export const CounterpartOrganizationView = ({
  actions,
  counterpart: { companyName, phone, email, isVendor, taxId, isCustomer },
  showCategories,
  defaultEmail,
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
          value: <EmailDefaultDisplay email={email} isDefault={defaultEmail} />,
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
