import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { CurrencyEnum, PaymentMethodsEnum } from '@monite/js-sdk';
import { Card } from '@monite/ui';

import { ROUTES } from 'features/app/consts';

import StripeWidget from './StripeWidget';
// import YapilyWidget from './YapilyWidget';
import SelectPaymentMethod from './SelectPaymentMethod';
import EmptyScreen from 'features/pay/EmptyScreen';

import { URLData } from '../types';

import styles from './styles.module.scss';

type PaymentWidgetProps = {
  paymentData?: URLData;
  fee?: number;
  currency?: CurrencyEnum;
  onFinish?: (result: any) => void;
  returnUrl?: string;
  stripeEnabled?: boolean;
};

const PaymentWidget = (props: PaymentWidgetProps) => {
  // const [receivableData, setReceivableData] = useState<ReceivableResponse>();

  const { paymentData } = props;

  const { search } = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    // (async () => {
    //   if (paymentData?.object?.id) {
    //     const receivableData =
    //       await monite.api.payment.getPaymentReceivableById(
    //         paymentData?.object.id
    //       );

    //     setReceivableData(receivableData);
    //   }
    // })();

    if (
      paymentData?.payment_methods?.length === 1 &&
      paymentData?.payment_methods?.[0] === PaymentMethodsEnum.CARD
    ) {
      navigate(`card${search}`, { replace: true });
    }
    //  else if (
    //   paymentData?.payment_methods?.length === 1 &&
    //   paymentData?.payment_methods?.[0] === 'bank'
    // ) {
    //   navigate(`bank${search}`, { replace: true });
    // }
    // eslint-disable-next-line
  }, []);

  return (
    <Card shadow p="32px" className={styles.card}>
      <Routes>
        <Route
          path="/"
          element={
            paymentData && paymentData?.payment_methods?.length ? (
              <SelectPaymentMethod
                paymentMethods={paymentData?.payment_methods}
              />
            ) : (
              <EmptyScreen />
            )
          }
        />
        <Route
          path={ROUTES.card}
          element={
            paymentData?.stripe?.secret && (
              <StripeWidget
                clientSecret={paymentData?.stripe.secret.card}
                {...props}
                price={paymentData?.amount}
                currency={paymentData?.currency}
                navButton={paymentData?.payment_methods?.length > 1}
                paymentLinkId={paymentData?.id}
                returnUrl={paymentData?.return_url}
              />
            )
          }
        />
        <Route
          path={ROUTES.other}
          element={
            paymentData?.stripe?.secret && (
              <StripeWidget
                clientSecret={paymentData?.stripe.secret.others}
                {...props}
                price={paymentData?.amount}
                currency={paymentData?.currency}
                navButton={paymentData?.payment_methods?.length > 1}
                paymentLinkId={paymentData?.id}
                returnUrl={paymentData?.return_url}
                onFinish={props.onFinish}
              />
            )
          }
        />
        {/* <Route
          path={ROUTES.bank}
          element={<YapilyWidget {...props} receivableData={receivableData} />}
        /> */}
      </Routes>
    </Card>
  );
};

export default PaymentWidget;
