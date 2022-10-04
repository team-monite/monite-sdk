import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { CurrencyEnum, PaymentsPaymentMethodsEnum } from '@team-monite/sdk-api';
import { Card } from '@team-monite/ui-kit-react';

import { ROUTES } from 'features/app/consts';

import StripeWidget from './StripeWidget';
import YapilyWidget from './YapilyWidget';
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
  const paymentMethods = paymentData?.payment_methods || [];

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
      paymentMethods?.length === 1 &&
      paymentMethods?.[0] === PaymentsPaymentMethodsEnum.CARD
    ) {
      navigate(`card${search}`, { replace: true });
    } else if (
      paymentMethods?.length === 1 &&
      paymentMethods?.[0] === PaymentsPaymentMethodsEnum.SEPA_CREDIT
    ) {
      navigate(`bank${search}`, { replace: true });
    } else if (
      paymentMethods?.length > 0 &&
      !paymentMethods.includes(PaymentsPaymentMethodsEnum.CARD) &&
      !paymentMethods.includes(PaymentsPaymentMethodsEnum.SEPA_CREDIT)
    ) {
      navigate(`other${search}`, { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Card shadow p="32px" className={styles.card}>
      <Routes>
        <Route
          path="/"
          element={
            paymentData && paymentMethods?.length ? (
              <SelectPaymentMethod paymentMethods={paymentMethods} />
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
                navButton={paymentMethods?.length > 1}
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
                navButton={paymentMethods?.length > 1}
                paymentLinkId={paymentData?.id}
                returnUrl={paymentData?.return_url}
                onFinish={props.onFinish}
              />
            )
          }
        />
        <Route
          path={ROUTES.bank}
          //@ts-ignore
          element={<YapilyWidget {...props} paymentData={paymentData} />}
        />
      </Routes>
    </Card>
  );
};

export default PaymentWidget;
