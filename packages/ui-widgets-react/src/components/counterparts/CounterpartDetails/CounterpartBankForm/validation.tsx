import { TFunction } from 'react-i18next';
import * as yup from 'yup';

const getValidationSchema = (t: TFunction) =>
  yup.object().shape({
    iban: yup
      .string()
      .required(`${t('counterparts:bank.iban')}${t('errors:requiredField')}`),
    bic: yup
      .string()
      .required(`${t('counterparts:bank.bic')}${t('errors:requiredField')}`),
    name: yup
      .string()
      .required(`${t('counterparts:bank.name')}${t('errors:requiredField')}`),
  });

export default getValidationSchema;
