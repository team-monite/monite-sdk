import { Fragment } from 'react';

import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from '@mui/material';

export const FinanceOffers = ({
  isLoading,
  offers,
}: {
  isLoading?: boolean;
  offers?: components['schemas']['FinancingOffer'][];
}) => {
  const { i18n } = useLingui();

  if (isLoading) {
    return <CircularProgress color="inherit" size={20} />;
  }

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="subtitle1">{t(i18n)`Current offer`}</Typography>
      <Box
        mt={2}
        sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}
      >
        {offers.map((offer) =>
          offer.pricing_plans.map((item, index) => (
            <Box
              key={offer.total_amount}
              width="100%"
              p={3}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: 1,
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {index + 1}
                </Box>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{ flex: '1 1 0%', width: '100%' }}
                >{t(i18n)`Finance plan`}</Typography>
              </Box>
              <List sx={{ mt: 1 }}>
                <Fragment key={item.advance_rate_percentage}>
                  <ListItem sx={{ p: 0 }}>
                    <Typography variant="body1">{t(i18n)`${
                      item.advance_rate_percentage / 100
                    }% advance rate`}</Typography>
                  </ListItem>
                  <ListItem sx={{ p: 0 }}>
                    <Typography variant="body1">{t(
                      i18n
                    )`Pay in ${item.repayment_duration_days} days`}</Typography>
                  </ListItem>
                  <ListItem sx={{ p: 0 }}>
                    <Typography variant="body1">{t(i18n)`${
                      item.fee_percentage / 100
                    }% fee`}</Typography>
                  </ListItem>
                </Fragment>
              </List>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};
