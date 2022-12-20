//@ts-nocheck
//TODO: add types when on backend will be ready
import React, { useEffect, useState, useMemo } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { useComponentsContext } from '@team-monite/ui-widgets-react';
import { PublicPaymentLinkResponse } from '@team-monite/sdk-api';
import { Tooltip } from '@team-monite/ui-kit-react';

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

  const [paymentData, setPaymentData] = useState<PublicPaymentLinkResponse>();

  const [isLoading, setIsLoading] = useState(true);

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      try {
        if (linkData?.id) {
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
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, [linkData?.id]);

  useEffect(() => {
    if (stripePromise) {
      return;
    }
    if (paymentData?.payment_intent?.key.publishable) {
      stripePromise = loadStripe(paymentData?.payment_intent?.key.publishable);
      setStripePromise(stripePromise);
    }
  }, [paymentData?.payment_intent?.key.publishable]);

  if (!stripePromise) {
    return null;
  }

  return (
    <Elements options={{}} stripe={stripePromise}>
      <div style={{ minHeight: '100vh' }}>
        <Routes>
          <Route
            path={'/*'}
            element={
              paymentData?.payment_intent?.key.publishable ? (
                <PaymentPage paymentData={paymentData} isLoading={isLoading} />
              ) : null
            }
          />
          <Route path={ROUTES.result} element={<PaymentResultPage />} />
          <Route path={ROUTES.expired} element={<PaymentExpiredPage />} />
        </Routes>
      </div>
      <Tooltip />
    </Elements>
  );
};

export default App;
