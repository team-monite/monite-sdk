import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormField,
  Input,
  PasswordInput,
} from '@team-monite/ui-kit-react';
import { useTranslation, TFunction } from 'react-i18next';
import * as yup from 'yup';
import React from 'react';

import { useRootStore } from 'features/mobx';

interface IFormInputs {
  email: string;
  password: string;
}

const getValidationSchema = ({ t }: { t: TFunction }) => {
  return yup
    .object({
      email: yup
        .string()
        // .email(t('forms:invalidEmail')) // TODO: enable when sign-in by email will be ready
        .required(
          t('forms:errors.required', { field: t('forms:fields.email') })
        ),
      password: yup
        .string()
        .required(
          t('forms:errors.required', { field: t('forms:fields.password') })
        ),
    })
    .required();
};

const LoginBaseForm = () => {
  const { t } = useTranslation();
  const rootStore = useRootStore();

  const { control, handleSubmit, formState, getValues, setError } =
    useForm<IFormInputs>({
      resolver: yupResolver(getValidationSchema({ t })),
      mode: 'onChange',
    });

  const onSubmit = async (data: IFormInputs) => {
    const res = await rootStore.auth.authorizeByLoginPassword(data);
    if (!res.success) {
      setError('password', {
        type: 'custom',
        message: t('login:errors.emailPassword'),
      });
    }
  };

  const { errors, isSubmitting, isDirty, isValid } = formState;
  const values = getValues();

  return (
    <div>
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => {
              return (
                <Input
                  id="email"
                  required
                  isInvalid={!!errors.email}
                  {...field}
                />
              );
            }}
          />
        </FormField>

        <FormField
          id="password"
          label={t('forms:fields.password')}
          error={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => {
              return (
                <PasswordInput
                  id="password"
                  required
                  isInvalid={!!errors.password}
                  {...field}
                />
              );
            }}
          />
        </FormField>

        {isSubmitting ? (
          <Button type="submit" disabled isLoading block>
            {t('login:submit')}
          </Button>
        ) : (
          <Button
            block
            type="submit"
            tooltip={{
              tip:
                (!isDirty || !isValid || !values.password || !values.email) &&
                t('login:errors.emptyFieldTooltip'),
            }}
            disabled={!isDirty || !isValid || isSubmitting}
          >
            {t('login:submit')}
          </Button>
        )}
      </form>
    </div>
  );
};

export default LoginBaseForm;
