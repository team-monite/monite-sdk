import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import {
  useComponentsContext,
  EmptyScreen,
} from '@team-monite/ui-widgets-react';
import { InternalPaymentLinkResponse } from '@team-monite/sdk-api';
import { Tooltip, Box } from '@team-monite/ui-kit-react';

import PaymentPage from 'pages/PaymentPage';
import PaymentResultPage from 'pages/PaymentResultPage';
import PaymentExpiredPage from 'pages/PaymentExpiredPage';

import { fromBase64 } from 'helpers';
import { ROUTES } from 'consts';
import { URLData } from './pages/types';

let stripePromise: Promise<Stripe | null> | null = null;

const App = () => {
  const [, setStripePromise] = useState(stripePromise);

  const { search } = useLocation();
  const navigate = useNavigate();

  const rawPaymentData = new URLSearchParams(search).get('data');

  const linkData = useMemo(() => {
    if (rawPaymentData) {
      return fromBase64(rawPaymentData) as URLData;
    }
  }, [rawPaymentData]);

  const [paymentData, setPaymentData] = useState<InternalPaymentLinkResponse>();

  const [isLoading, setIsLoading] = useState(true);

  const { monite } = useComponentsContext() || {};

  const fetchPaymentData = useCallback(async () => {
    if (linkData?.id && !paymentData) {
      const data = await monite.api.payment.getPaymentLinkById(linkData.id);
      setPaymentData(data);
      // TODO: backend will add enum for statuses
      if (data?.status === 'succeeded') {
        navigate(`${ROUTES.result}${search}`, {
          replace: true,
        });
      }
      if (data?.status === 'expired') {
        navigate(ROUTES.expired);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [linkData?.id, monite.api.payment, navigate, search, paymentData]);

  useEffect(() => {
    fetchPaymentData().catch((error) => {
      console.error(error);
      setIsLoading(false);
    });
    // eslint-disable-next-line
  }, [fetchPaymentData]);

  useEffect(() => {
    if (stripePromise) {
      return;
    }
    if (paymentData?.payment_intent?.key?.publishable) {
      stripePromise = loadStripe(paymentData?.payment_intent?.key?.publishable);
      setStripePromise(stripePromise);
    }
  }, [paymentData?.payment_intent?.key?.publishable]);

  if (!stripePromise && paymentData?.payment_intent?.key?.publishable) {
    return (
      <Box width={'100%'} padding={'80px'}>
        <EmptyScreen />
      </Box>
    );
  }

  return (
    <Elements options={{}} stripe={stripePromise}>
      <div style={{ minHeight: '100vh' }}>
        <Routes>
          <Route
            path={'/*'}
            element={
              <PaymentPage paymentData={paymentData} isLoading={isLoading} />
            }
          />
          <Route
            path={ROUTES.result}
            element={<PaymentResultPage paymentData={paymentData} />}
          />
          <Route path={ROUTES.expired} element={<PaymentExpiredPage />} />
        </Routes>
      </div>
      <Tooltip />
    </Elements>
  );
};

export default App;
