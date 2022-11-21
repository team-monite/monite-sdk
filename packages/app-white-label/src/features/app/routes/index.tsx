import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import useAuth from 'features/auth/useAuth';

const PublicArea = lazy(() => import('./PublicArea'));
const AuthorizedArea = lazy(() => import('./AuthorizedArea'));

const AreaRoutes = () => {
  const appAuth = useAuth();
  const isAuth = appAuth?.token;

  return (
    <Suspense fallback={null}>
      {isAuth ? <AuthorizedArea /> : <PublicArea />}
    </Suspense>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<AreaRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
