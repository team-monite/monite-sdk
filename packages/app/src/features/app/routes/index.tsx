import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { ROUTES } from 'features/app/consts';
import { useRootStore } from 'features/mobx';

import ReceivablePaymentPage from 'features/pay/PaymentPage';
import ReceivablePaymentResultPage from 'features/pay/PaymentResultPage';

const PublicArea = lazy(() => import('./PublicArea'));
const AuthorizedArea = lazy(() => import('./AuthorizedArea'));

const AreaRoutes = observer(() => {
  const rootStore = useRootStore();
  const { isAuth } = rootStore.auth;

  return (
    <Suspense fallback={null}>
      {isAuth ? <AuthorizedArea /> : <PublicArea />}
    </Suspense>
  );
});

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.pay} element={<ReceivablePaymentPage />} />
      <Route
        path={ROUTES.payResult}
        element={<ReceivablePaymentResultPage />}
      />
      <Route path="*" element={<AreaRoutes />} />
    </Routes>
  );
};

export default observer(AppRoutes);
