import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import PageCounterparts from 'features/counterparts/PageCounterparts';
import PageCounterpartsCreate from 'features/counterparts/PageCounterpartsCreate';
import PagePayables from 'features/payables/PagePayables';
import EmptyPage from 'features/app/Layout/EmptyPage';

import { ROUTES, navigationData } from 'features/app/consts';

const AuthorizedArea = () => {
  return (
    <Routes>
      <Route path={ROUTES.counterparts} element={<PageCounterparts />} />
      <Route
        path={ROUTES.counterpartsCreate}
        element={<PageCounterpartsCreate />}
      />
      <Route path={ROUTES.payables}>
        <Route index element={<PagePayables />} />
        <Route path=":id" element={<PagePayables />} />
      </Route>
      <Route
        path={ROUTES.settings}
        element={<Navigate to={ROUTES.approvalPolicies} />}
      />
      <Route
        path={ROUTES.approvalPolicies}
        element={
          <EmptyPage
            label={navigationData.settings?.children?.approvalPolicies.label}
            renderIcon={
              navigationData.settings?.children?.approvalPolicies.renderIcon
            }
            apiLink={
              navigationData.settings?.children?.approvalPolicies.apiLink
            }
          />
        }
      />
      <Route
        path={ROUTES.dashboard}
        element={
          <EmptyPage
            label={navigationData.dashboard.label}
            renderIcon={navigationData.dashboard.renderIcon}
            apiLink={navigationData.dashboard.apiLink}
          />
        }
      />
      <Route
        path={ROUTES.receivables}
        element={
          <EmptyPage
            label={navigationData.receivables.label}
            renderIcon={navigationData.receivables.renderIcon}
            apiLink={navigationData.receivables.apiLink}
          />
        }
      />
      <Route
        path={ROUTES.products}
        element={
          <EmptyPage
            label={navigationData.products.label}
            renderIcon={navigationData.products.renderIcon}
            apiLink={navigationData.products.apiLink}
          />
        }
      />
      <Route
        path={ROUTES.audit}
        element={
          <EmptyPage
            label={navigationData.audit.label}
            renderIcon={navigationData.audit.renderIcon}
            apiLink={navigationData.audit.apiLink}
          />
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.counterparts} />} />
    </Routes>
  );
};

export default observer(AuthorizedArea);
