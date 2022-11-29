import * as yup from 'yup';
import { TFunction } from 'react-i18next';

const getValidationSchema = (t: TFunction) =>
  yup
    .object()
    .shape({
      customer: yup
        .object()
        .shape({
          value: yup
            .string()
            .required(`${t('common:customer')}${t('errors:requiredField')}`),
          label: yup.string().required(),
        })
        .required(),
      message: yup
        .string()
        .required(`${t('receivables:message')}${t('errors:requiredField')}`),
      paymentTerm: yup
        .object()
        .shape({
          value: yup
            .string()
            .required(
              `${t('receivables:paymentTerm')}${t('errors:requiredField')}`
            ),
          label: yup.string().required(),
        })
        .required(),
      bankAccount: yup
        .object()
        .shape({
          value: yup
            .string()
            .required(
              `${t('receivables:bankAccount')}${t('errors:requiredField')}`
            ),
          label: yup.string().required(),
        })
        .required(),
    })
    .required();

export default getValidationSchema;
