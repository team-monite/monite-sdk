import React, { useMemo } from 'react';
import { Buffer } from 'buffer';

import styled from '@emotion/styled';
import {
  Flex,
  Box,
  Card,
  Text,
  PdfViewerWithAPI,
  PaymentWidget,
} from '@monite/react-kit';
import { Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Layout from 'features/pay/Layout';

const Row = styled(Flex)``;
const Col = styled(Box)``;

const PaymentPDFViewerWrapper = styled.div`
  padding: 32px 72px;
`;
const PaymentWidgetWrapper = styled.div`
  padding: 32px;

  > * + * {
    margin-top: 32px;
  }
`;

type Provider = {
  type: PaymentProvidersEnum;
  secret: string;
};

type URLData = {
  object: {
    id: string;
    type: string;
  };
  providers: Provider[];
};

enum PaymentProvidersEnum {
  STRIPE = 'stripe',
  YAPILY = 'yapily',
}

const PaymentPage = () => {
  const { search } = useLocation();

  const paymentData = useMemo(() => {
    const rawPaymentData = new URLSearchParams(search).get('data');
    return (
      rawPaymentData &&
      (JSON.parse(
        Buffer.from(rawPaymentData, 'base64').toString('utf8')
      ) as URLData)
    );
  }, [search]);

  if (!paymentData) {
    return <Navigate to="/" replace />;
  }
  const {
    object: { id },
    providers,
  } = paymentData;

  const stripeClientSecret = providers.find(
    (provider) => provider.type === PaymentProvidersEnum.STRIPE
  )?.secret;

  const yapilyClientSecret = providers.find(
    (provider) => provider.type === PaymentProvidersEnum.YAPILY
  )?.secret;

  return (
    <Layout>
      <Helmet title={`Pay invoice ${id}`} />
      <Row>
        <Col width={[1 / 2]}>
          <PaymentPDFViewerWrapper>
            <PdfViewerWithAPI id={id || ''} />
          </PaymentPDFViewerWrapper>
        </Col>
        <Col width={[1 / 2]}>
          <PaymentWidgetWrapper>
            <Text as="h2" textSize="h3">
              Pay invoice #FA-{id}
            </Text>
            <Card shadow p="32px">
              <PaymentWidget
                id={id || ''}
                //TODO hardcoded fee while backend configurator for fees is not ready
                fee={350}
                stripeClientSecret={stripeClientSecret}
                yapilyClientSecret={yapilyClientSecret}
                onFinish={(res) => {
                  if (
                    res.status === 'succeeded' ||
                    res.status === 'processing'
                  ) {
                    // navigate(
                    //   `${ROUTES.payResult.replace(':id', id)}?status=${
                    //     res.status
                    //   }`
                    // );
                  }
                }}
              />
            </Card>
          </PaymentWidgetWrapper>
        </Col>
      </Row>
    </Layout>
  );
};

export default PaymentPage;
