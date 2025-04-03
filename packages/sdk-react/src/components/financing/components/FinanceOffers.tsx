import { Fragment } from 'react';

import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, List, ListItem, Typography } from '@mui/material';

export const FinanceOffers = ({
  offers,
}: {
  offers?: components['schemas']['FinancingOffer'][];
}) => {
  const { i18n } = useLingui();

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ mb: 2, display: 'inline-block' }}
      >{t(i18n)`Current offer`}</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {offers.map((offer, offerIndex) =>
          offer?.pricing_plans?.map((item, index) => (
            <Box
              key={`${offer.available_amount}-${offerIndex}-${offer.total_amount}-${index}`}
              width="232px"
              height={148}
              px={3}
              py={2.5}
              sx={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '1px solid #CBCBFE',
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}
              >
                <Box
                  sx={{
                    backgroundColor: '#444',
                    color: 'white',
                    borderRadius: '4px',
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
                >{t(i18n)`Financing plan`}</Typography>
              </Box>
              <List sx={{ p: 0 }}>
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
