import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import { ROUTES } from 'features/app/consts';

import ReceivablePaymentPage from 'features/pay/PaymentPage';

const AllRoutes = lazy(() => import('./PublicArea'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.pay} element={<ReceivablePaymentPage />} />
      <Route path="*" element={<AllRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
