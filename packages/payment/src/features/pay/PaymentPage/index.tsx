import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Flex, Box } from '@team-monite/ui-kit-react';
// import { useComponentsContext } from '@monite/ui-widgets-react';
import {
  PaymentMethodsEnum,
  PaymentsPaymentLinkStatuses,
  PaymentsPaymentsCurrencyEnum,
} from '@team-monite/sdk-api';

import { ROUTES, fromBase64 } from 'features/app/consts';

import Layout from 'features/pay/Layout';
import PaymentWidget from 'features/pay/PaymentWidget';

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

  const [paymentData, setPaymentData] = useState<any>();

  // const { monite } = useComponentsContext() || {};

  console.log('paymentData', paymentData);
  useEffect(() => {
    (async () => {
      // if (linkData?.id) {
      //   const res = await monite.api.payment.getPaymentLinkById(linkData.id);

      const data = {
        id: '2e2db48e-ff4e-4c52-b500-9e7df4c72494',
        currency: PaymentsPaymentsCurrencyEnum.EUR,
        status: PaymentsPaymentLinkStatuses.CREATED,
        payment_status: 'succeeded',
        recipient: {
          id: '9ed91192-457a-4c14-bcf0-71842fbd6e4a',
          type: 'entity',
        },
        payment_reference: '1212dw-2323-ng',
        amount: 1500,
        payment_intents: [
          {
            id: 'c4e1eb30-3fe3-476e-9ad8-bb1d3b1c8169',
            was_used_for_payment: false,
            application_fee_amount: null,
            payment_method: 'others',
            key: {
              publishable:
                'pk_test_51IJivRCq0HpJYRYNxdxMiSromL6P4QicTwwdfYKICAXXTNzkVVkBzF308zNVoYXHw53TPb7aGBptDupflQjxzmGW00jBrBoehE',
              secret:
                'pi_3LmGYECq0HpJYRYN1HqMS5DL_secret_YKxgTO7334CusJErWlYtEmAXB',
            },
            provider: 'stripe',
          },
        ],
        payment_methods: ['others'],
        total: null,
        return_url: 'https://pay.dev.monite.com/result',
      };
      //@ts-ignore
      setPaymentData(data);
      // }
    })();

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
  }, [linkData]);

  useEffect(() => {
    if (paymentData?.status === PaymentsPaymentLinkStatuses.FINISHED_FLOW) {
      console.log('if payment data');
      navigate(
        `${ROUTES.payResult}?data=${rawPaymentData}&payment_reference=${paymentData.payment_reference}&amount=${paymentData.amount}&currency=${paymentData.currency}&recipient_type=${paymentData.recipient.type}&redirect_status=${paymentData.payment_status}&return_url=${paymentData.return_url}`,
        {
          replace: true,
        }
      );
    }
  }, [paymentData, navigate, rawPaymentData]);

  return (
    <Layout>
      <Helmet title={`Pay invoice ${linkData?.id || ''}`} />
      <Flex justifyContent="center">
        <Box width={600} p={4} pt={80}>
          {paymentData && (
            <PaymentWidget
              paymentData={paymentData}
              // onFinish={(res) => {
              //   if (
              //     res.status !== 'requires_payment_method' &&
              //     res.status !== 'requires_action' &&
              //     res.status !== 'requires_confirmation'
              //   ) {
              //     navigate(
              //       `${ROUTES.payResult}?payment_reference=${paymentData.payment_reference}&amount=${paymentData.amount}&currency=${paymentData.currency}&recipient=${paymentData.recipient.type}&redirect_status=${res.status}`,
              //       {
              //         replace: true,
              //       }
              //     );
              //   }
              // }}
            />
          )}
        </Box>
      </Flex>
    </Layout>
  );
};

export default PaymentPage;
