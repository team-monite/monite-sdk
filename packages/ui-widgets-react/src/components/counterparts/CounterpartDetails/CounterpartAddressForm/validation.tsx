import { TFunction } from 'react-i18next';
import * as yup from 'yup';

export const getAddressValidationSchema = (t: TFunction) => ({
  line1: yup
    .string()
    .required(`${t('counterparts:address.line1')}${t('errors:requiredField')}`),
  line2: yup.string(),
  city: yup
    .string()
    .required(`${t('counterparts:address.city')}${t('errors:requiredField')}`),
  state: yup
    .string()
    .required(`${t('counterparts:address.state')}${t('errors:requiredField')}`),
  country: yup
    .object()
    .shape({
      value: yup
        .string()
        .required(
          `${t('counterparts:address.country')}${t('errors:requiredField')}`
        ),
      label: yup
        .string()
        .required(
          `${t('counterparts:address.country')}${t('errors:requiredField')}`
        ),
    })
    .required(),
  postalCode: yup
    .string()
    .required(
      `${t('counterparts:address.postalCode')}${t('errors:requiredField')}`
    ),
});

export default getAddressValidationSchema;
