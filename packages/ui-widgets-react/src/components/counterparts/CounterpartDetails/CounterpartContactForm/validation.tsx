import { TFunction } from 'react-i18next';
import { getAddressValidationSchema } from '../CounterpartAddressForm/validation';
import * as yup from 'yup';

const getValidationSchema = (t: TFunction) =>
  yup.object().shape({
    firstName: yup
      .string()
      .required(
        `${t('counterparts:contact.firstName')}${t('errors:requiredField')}`
      ),
    lastName: yup
      .string()
      .required(
        `${t('counterparts:contact.lastName')}${t('errors:requiredField')}`
      ),
    email: yup
      .string()
      .email(`${t('counterparts:contact.email')}${t('errors:validEmail')}`)
      .required(
        `${t('counterparts:contact.email')}${t('errors:requiredField')}`
      ),
    phone: yup.string(),
    ...getAddressValidationSchema(t),
  });

export default getValidationSchema;
