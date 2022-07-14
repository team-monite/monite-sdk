import React from 'react';
import styled from '@emotion/styled';
import {
  Flex,
  Box,
  Card,
  Text,
  PdfViewerWithAPI,
  PaymentWidget,
} from '@monite/react-kit';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Layout from 'features/pay/Layout';

import { ROUTES } from 'features/app/consts';

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
  const navigate = useNavigate();

  if (!id) {
    return <Navigate to="/" replace />;
  }

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
                price={1000}
                fee={10.4}
                onFinish={(res) => {
                  if (
                    res.status === 'succeeded' ||
                    res.status === 'processing'
                  ) {
                    navigate(
                      `${ROUTES.payResult.replace(':id', id)}?status=${
                        res.status
                      }`
                    );
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
