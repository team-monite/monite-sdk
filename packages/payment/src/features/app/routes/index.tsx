import { Routes, Route } from 'react-router-dom';

import { ROUTES } from 'features/app/consts';

import PaymentPage from 'features/pay/PaymentPage';
import PaymentResultPage from 'features/pay/PaymentResultPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={'/*'} element={<PaymentPage />} />
      <Route path={ROUTES.payResult} element={<PaymentResultPage />} />
    </Routes>
  );
};

export default AppRoutes;
