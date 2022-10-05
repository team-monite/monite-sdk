import { TFunction } from 'react-i18next';
import { getAddressValidationSchema } from '../../CounterpartAddressForm/validation';
import * as yup from 'yup';

const getValidationSchema = (t: TFunction) =>
  yup.object().shape({
    firstName: yup
      .string()
      .required(
        `${t('counterparts:individual.firstName')}${t('errors:requiredField')}`
      ),
    lastName: yup
      .string()
      .required(
        `${t('counterparts:individual.lastName')}${t('errors:requiredField')}`
      ),
    email: yup
      .string()
      .email(`${t('counterparts:individual.email')}${t('errors:validEmail')}`)
      .required(
        `${t('counterparts:individual.email')}${t('errors:requiredField')}`
      ),
    phone: yup.string(),
    counterpartType: yup.string(),
    taxId: yup
      .string()
      .required(
        `${t('counterparts:individual.taxId')}${t('errors:requiredField')}`
      ),
    ...getAddressValidationSchema(t),
  });

export default getValidationSchema;
