import { ReactNode } from 'react';

import {
  type CounterpartShowCategories,
  CounterpartDataTestId,
} from '@/components/counterparts/types';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Divider, CardActions, Box, Chip } from '@mui/material';

import { CounterpartOrganizationFields } from '../../CounterpartForm';
import { printCounterpartType } from '../../helpers';

type EmailDefaultDisplayProps = {
  email: string;
  isDefault?: boolean;
};

export const DefaultEmail = ({
  email,
  isDefault,
}: EmailDefaultDisplayProps) => {
  const { i18n } = useLingui();
  return (
    <Box display="flex" alignItems="center">
      <Box
        maxWidth={250}
        sx={{
          textWrap: 'nowrap',
          overflow: 'hidden', // truncate value if it's too long, to keep the "default" label visible
          textOverflow: 'ellipsis',
        }}
        title={email} // to show the non-truncated value on hover
      >
        {email}
      </Box>
      {isDefault && (
        <Box ml={2} mr={1} display="inline">
          <Chip
            label={t(i18n)`default`}
            variant="filled"
            color="default"
            sx={{
              // workaround to prevent the layout from shifting when the "default" label is visible
              display: 'inline',
              verticalAlign: 'inherit',
              py: 0.84,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

type CounterpartOrganizationViewProps = {
  actions: ReactNode;
  counterpart: CounterpartOrganizationFields & { taxId: string | undefined };
  isEmailDefault: boolean;
} & CounterpartShowCategories;

export const CounterpartOrganizationView = ({
  actions,
  counterpart: { companyName, phone, email, isVendor, taxId, isCustomer },
  showCategories,
  isEmailDefault,
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
          value: <DefaultEmail email={email} isDefault={isEmailDefault} />,
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
