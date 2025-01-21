import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CalendarToday as CalendarTodayIcon,
  Sell as SellIcon,
} from '@mui/icons-material';
import { Card, CardContent, Button } from '@mui/material';

import { PaymentTermSummaryItem } from './PaymentTermsSummaryItem';

export interface PaymentTermsSummaryProps {
  paymentTerm: components['schemas']['PaymentTermsResponse'];
  openEditDialog: () => void;
}

export const PaymentTermsSummary = ({
  paymentTerm,
  openEditDialog,
}: PaymentTermsSummaryProps) => {
  const { i18n } = useLingui();
  const { term_final, term_1, term_2 } = paymentTerm;

  return (
    <Card sx={{ backgroundColor: '#fafafa' }} elevation={0}>
      <CardContent sx={{ color: 'secondary.main' }}>
        {term_1 && (
          <PaymentTermSummaryItem
            renderIcon={(props) => <SellIcon {...props} />}
            leftLine={t(i18n)`Pay in the first ${term_1.number_of_days} days`}
            rightLine={t(i18n)`${term_1.discount}% discount`}
            sx={{ mb: 2 }}
          />
        )}
        {term_2 && (
          <PaymentTermSummaryItem
            renderIcon={(props) => <SellIcon {...props} />}
            leftLine={t(i18n)`Pay in the first ${term_2.number_of_days} days`}
            rightLine={t(i18n)`${term_2.discount}% discount`}
            sx={{ mb: 2 }}
          />
        )}
        <PaymentTermSummaryItem
          renderIcon={(props) => <CalendarTodayIcon {...props} />}
          leftLine={t(i18n)`Payment due`}
          rightLine={t(i18n)`${term_final?.number_of_days} days`}
        />
        <Button sx={{ mt: 2 }} variant="outlined" onClick={openEditDialog}>{t(
          i18n
        )`Edit term`}</Button>
      </CardContent>
    </Card>
  );
};
