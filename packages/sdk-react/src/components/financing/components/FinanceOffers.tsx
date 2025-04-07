import { Fragment } from 'react';

import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { MonetizationOnOutlined } from '@mui/icons-material';
import {
  Box,
  lighten,
  List,
  ListItem,
  Typography,
  useTheme,
} from '@mui/material';

export const FinanceOffers = ({
  offers,
}: {
  offers?: components['schemas']['FinancingOffer'][];
}) => {
  const { i18n } = useLingui();
  const theme = useTheme();

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <Box width="100%">
      <Typography
        variant="subtitle1"
        sx={{ mb: 3, display: 'inline-block' }}
      >{t(i18n)`Current offer`}</Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {offers.map((offer, offerIndex) =>
          offer?.pricing_plans?.map((item, index) => (
            <Box
              key={`${offer.available_amount}-${offerIndex}-${offer.total_amount}-${index}`}
              width={232}
              height={148}
              px={3}
              py={2.5}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '16px',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <MonetizationOnOutlined
                  sx={{
                    fontSize: 24,
                    color: lighten(theme.palette.primary.main, 0.6),
                  }}
                />
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{ flex: '1 1 0%', width: '100%' }}
                >{t(i18n)`Financing plan`}</Typography>
              </Box>
              <List sx={{ p: 0 }}>
                <Fragment key={item.advance_rate_percentage}>
                  <ListItem sx={{ p: 0 }}>
                    <Typography variant="body1" fontWeight={400}>{t(i18n)`${
                      item.advance_rate_percentage / 100
                    }% advance rate`}</Typography>
                  </ListItem>
                  <ListItem sx={{ p: 0 }}>
                    <Typography variant="body1" fontWeight={400}>{t(
                      i18n
                    )`Pay in ${item.repayment_duration_days} days`}</Typography>
                  </ListItem>
                  <ListItem sx={{ p: 0 }}>
                    <Typography variant="body1" fontWeight={400}>{t(i18n)`${
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
