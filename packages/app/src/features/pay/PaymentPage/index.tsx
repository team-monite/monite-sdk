import React from 'react';
import styled from '@emotion/styled';
import { Flex, Box, Card, Text } from '@monite/react-kit';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { PdfViewerWithAPI } from '@monite/react-kit';

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

const PaymentPage = () => {
  const { id } = useParams();

  return (
    <Layout>
      <Helmet title={`Pay invoice ${id}`} />
      <Row>
        <Col width={[1 / 2]}>
          <PaymentPDFViewerWrapper>
            <PdfViewerWithAPI
              id={
                id === 'test'
                  ? '431fcffa-ab67-4a79-9286-566f30bdb654'
                  : id || ''
              } //TODO it is for testing
            />
          </PaymentPDFViewerWrapper>
        </Col>
        <Col width={[1 / 2]}>
          <PaymentWidgetWrapper>
            <Text as="h2" textSize="h3">
              Pay invoice #FA-{id}
            </Text>
            <Card shadow p="32px">
              Stripe Payment Widget
            </Card>
          </PaymentWidgetWrapper>
        </Col>
      </Row>
    </Layout>
  );
};

export default PaymentPage;
