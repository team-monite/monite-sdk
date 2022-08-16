import { Routes, Route } from 'react-router-dom';

import { ROUTES } from 'features/app/consts';

import ReceivablePaymentPage from 'features/pay/PaymentPage';
import ReceivablePaymentResultPage from 'features/pay/PaymentResultPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={'pay/*'} element={<ReceivablePaymentPage />} />
      <Route
        path={ROUTES.payResult}
        element={<ReceivablePaymentResultPage />}
      />
    </Routes>
  );
};

export default AppRoutes;
