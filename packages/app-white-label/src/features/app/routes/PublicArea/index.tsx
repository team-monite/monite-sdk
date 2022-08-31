import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import PageLogin from 'features/auth/PageLogin';

import { ROUTES } from 'features/app/consts';

const PublicArea = () => {
  return (
    <Routes>
      <Route path={ROUTES.signin} element={<PageLogin />} />
      <Route path="*" element={<Navigate to={ROUTES.signin} />} />
    </Routes>
  );
};

export default observer(PublicArea);
