import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Text } from '@team-monite/ui-kit-react';

import AuthLayout from 'features/auth/Layout';
import LoginForm from './Form';

const FormWrapper = styled.div`
  padding: 0 18px;
  text-align: left;
`;

const PageLogin = () => {
  const { t } = useTranslation();

  return (
    <AuthLayout>
      <Text textSize="h2" as="h2">
        {t('login:title')}
      </Text>
      <FormWrapper>
        <LoginForm />
      </FormWrapper>
    </AuthLayout>
  );
};

export default observer(PageLogin);
