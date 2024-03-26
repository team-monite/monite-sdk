import React from 'react';

import { getCountries } from '@/core/utils/countries';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import EditIcon from '@mui/icons-material/Edit';
import { CardActions, Button, Divider } from '@mui/material';

import {
  useCounterpartAddressView,
  CounterpartAddressViewProps,
} from './useCounterpartAddressView';

export const CounterpartAddressView = (props: CounterpartAddressViewProps) => {
  const { i18n } = useLingui();
  const { onEdit } = useCounterpartAddressView(props);
  const { line1, line2, city, postal_code, state, country } = props.address;

  return (
    <MoniteCard
      items={[
        {
          label: t(i18n)`Address line 1`,
          value: line1,
        },
        {
          label: t(i18n)`Address line 2`,
          value: line2,
        },
        {
          label: t(i18n)`City`,
          value: city,
        },
        {
          label: t(i18n)`ZIP code`,
          value: postal_code,
        },
        {
          label: t(i18n)`State`,
          value: state,
        },
        {
          label: t(i18n)`Country`,
          value: getCountries(i18n)[country],
        },
      ]}
    >
      {props.permissions.isUpdateAllowed && (
        <>
          <Divider />
          <CardActions>
            <Button
              startIcon={<EditIcon fontSize="small" />}
              variant="text"
              color="primary"
              size="small"
              onClick={onEdit}
            >
              {t(i18n)`Edit`}
            </Button>
          </CardActions>
        </>
      )}
    </MoniteCard>
  );
};
