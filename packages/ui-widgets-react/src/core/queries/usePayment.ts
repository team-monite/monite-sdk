import { useQuery } from 'react-query';
import {
  PaymentsPaymentsPaymentsPaymentsBanksResponse,
  PaymentsYapilyCountriesCoverageCodes,
  PaymentsPaymentMethodsEnum,
  PaymentsPaymentMethodsCountriesResponse,
  PaymentMethodsCalculateFeeResponse,
} from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';

const PAYMENT_INSTITUTIONS = 'paymentInstitutions';
const PAYMENT_COUNTRIES = 'paymentCountries';
const PAYMENT_FEE = 'paymentFee';

export const useInstitutionList = (
  paymentMethod: PaymentsPaymentMethodsEnum.SEPA_CREDIT,
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
  paymentMethod: PaymentsPaymentMethodsEnum.SEPA_CREDIT
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
  paymentMethod?: PaymentsPaymentMethodsEnum,
  id?: string
) => {
  const { monite } = useComponentsContext();

  return useQuery<PaymentMethodsCalculateFeeResponse | undefined, Error>(
    [PAYMENT_FEE, paymentMethod],
    () =>
      !!paymentMethod && !!id
        ? monite.api.payment.getFeeByPaymentMethod(paymentMethod, {
            payment_link_id: id,
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
