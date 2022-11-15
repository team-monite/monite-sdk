import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import PageLogin from 'features/auth/PageLogin';

import { ROUTES } from 'consts';

const PublicArea = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path={ROUTES.signin} element={<PageLogin />} />
      <Route
        path="*"
        element={<Navigate to={ROUTES.signin} state={{ from: location }} />}
      />
    </Routes>
  );
};

export default PublicArea;
