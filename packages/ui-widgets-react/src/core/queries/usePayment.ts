import { useQuery, useMutation } from 'react-query';
import {
  PaymentsPaymentsPaymentsPaymentsBanksResponse,
  PaymentsYapilyCountriesCoverageCodes,
  MoniteAllPaymentMethodsTypes,
  PaymentsPaymentMethodsCountriesResponse,
  PaymentsPaymentMethodsCalculatePaymentsPaymentsFeeResponse,
} from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';

const PAYMENT_INSTITUTIONS = 'paymentInstitutions';
const PAYMENT_COUNTRIES = 'paymentCountries';
const PAYMENT_FEE = 'paymentFee';
const PAYMENT_AUTHORIZE = 'paymentAuthorize';

export const useInstitutionList = (
  paymentMethod: MoniteAllPaymentMethodsTypes.SEPA_CREDIT,
  country?: PaymentsYapilyCountriesCoverageCodes
) => {
  const { monite } = useComponentsContext();

  return useQuery<
    PaymentsPaymentsPaymentsPaymentsBanksResponse | undefined,
    Error
  >(
    [PAYMENT_INSTITUTIONS],
    () =>
      !!country
        ? monite.api.payment.getInstitutions(paymentMethod, country)
        : undefined,
    {
      onError: (error) => {
        toast.error(error.message);
      },
      enabled: !!country,
    }
  );
};

export const useCountryList = (
  paymentMethod: MoniteAllPaymentMethodsTypes.SEPA_CREDIT
) => {
  const { monite } = useComponentsContext();

  return useQuery<PaymentsPaymentMethodsCountriesResponse | undefined, Error>(
    [PAYMENT_COUNTRIES],
    () => monite.api.payment.getPaymentMethodCountries(paymentMethod),
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useFeeByPaymentMethod = (
  paymentMethod?: MoniteAllPaymentMethodsTypes,
  id?: string
) => {
  const { monite } = useComponentsContext();

  return useQuery<
    PaymentsPaymentMethodsCalculatePaymentsPaymentsFeeResponse | undefined,
    Error
  >(
    [PAYMENT_FEE, paymentMethod],
    () =>
      !!paymentMethod && !!id
        ? monite.api.payment.getFeeByPaymentMethod(id, {
            payment_method: paymentMethod,
          })
        : undefined,
    {
      onError: (error) => {
        toast.error(error.message);
      },
      enabled: !!paymentMethod && !!id,
    }
  );
};

export type AuthorizePaymentLinkPayload = {
  bank_id: string;
  payer_account_identification: {
    type: string;
    value: string;
  };
};

export const useAuthorizePaymentLink = (id: string) => {
  const { monite } = useComponentsContext();

  return useMutation<
    { authorization_link: string } | undefined,
    Error,
    AuthorizePaymentLinkPayload
  >(
    [PAYMENT_AUTHORIZE],
    (body) => {
      return monite.api.payment.authorizePaymentLink(id, body);
    },
    {
      onSuccess: () => {
        // toast.success('Saved');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};
