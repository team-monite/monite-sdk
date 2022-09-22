import { TFunction } from 'react-i18next';
import { getAddressValidationSchema } from '../CounterpartAddressForm/validation';
import * as yup from 'yup';

const getValidationSchema = (t: TFunction) =>
  yup.object().shape({
    companyName: yup
      .string()
      .required(
        `${t('counterparts:organization.companyName')}${t(
          'errors:requiredField'
        )}`
      ),
    email: yup
      .string()
      .email(`${t('counterparts:organization.email')}${t('errors:validEmail')}`)
      .required(
        `${t('counterparts:organization.email')}${t('errors:requiredField')}`
      ),
    phone: yup.string(),
    counterpartType: yup.string(),
    vatNumber: yup
      .string()
      .required(
        `${t('counterparts:organization.vatNumber')}${t(
          'errors:requiredField'
        )}`
      ),
    ...getAddressValidationSchema(t),
  });

export default getValidationSchema;
