import React from 'react';
import { Helmet } from 'react-helmet';

import { Flex, Box, Loading } from '@team-monite/ui-kit-react';
import { PaymentDetails, EmptyScreen } from '@team-monite/ui-widgets-react';
import { InternalPaymentLinkResponse } from '@team-monite/sdk-api';

import Layout from 'pages/Layout';
import PaymentWidget from 'pages/PaymentWidget';

type PaymentPageProps = {
  paymentData: InternalPaymentLinkResponse;
  isLoading: boolean;
};
const PaymentPage = ({ paymentData, isLoading }: PaymentPageProps) => {
  return (
    <Layout>
      <Helmet
        title={`Pay invoice ${
          paymentData?.payment_intent?.payment_reference || ''
        }`}
      />

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
          {paymentData && (
            <PaymentDetails payment={paymentData.payment_intent} />
          )}
        </Box>
        <Box width={['100%', '50%']}>
          {paymentData && (
            <PaymentWidget
              paymentData={paymentData.payment_intent}
              linkId={paymentData.id}
            />
          )}
        </Box>
      </Flex>
    </Layout>
  );
};

export default PaymentPage;
