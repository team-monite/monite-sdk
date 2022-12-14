import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Flex, Box, Loading } from '@team-monite/ui-kit-react';
import {
  useComponentsContext,
  PaymentDetails,
  EmptyScreen,
} from '@team-monite/ui-widgets-react';
import { PaymentsPaymentLinkResponse } from '@team-monite/sdk-api';

import { ROUTES } from 'consts';
import { fromBase64 } from 'helpers';

import Layout from 'pages/Layout';
import PaymentWidget from 'pages/PaymentWidget';

import { URLData } from '../types';

const PaymentPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const rawPaymentData = new URLSearchParams(search).get('data');

  const linkData = useMemo(() => {
    if (rawPaymentData) {
      return fromBase64(rawPaymentData) as URLData;
    }
  }, [rawPaymentData]);

  const [paymentData, setPaymentData] = useState<PaymentsPaymentLinkResponse>();

  const [isLoading, setIsLoading] = useState(true);

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      if (linkData?.id) {
        const data = await monite.api.payment.getPaymentLinkById(linkData.id);
        setPaymentData(data);

        // TODO: backend will add enum for statuses
        if (data?.status === 'succeeded') {
          navigate(
            `${ROUTES.payResult}?data=${rawPaymentData}&payment_reference=${data.payment_reference}&amount=${data.amount}&currency=${data.currency}&recipient_type=${data.recipient.type}&redirect_status=${data.status}&return_url=${data.return_url}`,
            {
              replace: true,
            }
          );
        }
        if (data?.status === 'expired') {
          navigate(ROUTES.expired);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, [linkData]);

  return (
    <Layout>
      <Helmet title={`Pay invoice ${paymentData?.payment_reference || ''}`} />

      {isLoading && <Loading />}

      {!paymentData && !isLoading && (
        <Box width={'100%'} padding={'80px'}>
          <EmptyScreen />
        </Box>
      )}

      <Flex
        p={32}
        justifyContent="space-between"
        sx={{
          gap: [16, 32],
        }}
        flexDirection={['column', 'row']}
      >
        <Box width={['100%', '50%']}>
          {paymentData && <PaymentDetails payment={paymentData} />}
        </Box>
        <Box width={['100%', '50%']}>
          {paymentData && linkData?.id && (
            <PaymentWidget paymentData={paymentData} id={linkData?.id} />
          )}
        </Box>
      </Flex>
    </Layout>
  );
};

export default PaymentPage;
