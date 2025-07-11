import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { AppSidebar } from './components/app-sidebar';
import { SidebarProvider } from './components/ui/sidebar';
import {
  BillPayPage,
  InvoicingPage,
  ApprovalRequestsPage,
  CounterpartsPage,
  ProductsPage,
  RolesApprovalsPage,
  TagsPage,
  OnboardingPage,
  IntegrationsPage,
} from './pages';
import {
  BillPayPage as DropinBillPayPage,
  InvoicingPage as DropinInvoicingPage,
} from './pages/Dropin';

function App() {
  return (
    <Router>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            <Route path="/" element={<BillPayPage />} />
            <Route path="/bill-pay" element={<BillPayPage />} />
            <Route path="/invoicing" element={<InvoicingPage />} />
            <Route
              path="/approval-requests"
              element={<ApprovalRequestsPage />}
            />
            <Route path="/counterparts" element={<CounterpartsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route
              path="/roles-and-approvals"
              element={<RolesApprovalsPage />}
            />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/dropin/bill-pay" element={<DropinBillPayPage />} />
            <Route path="/dropin/invoicing" element={<DropinInvoicingPage />} />
            <Route
              path="*"
              element={
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    404 - Page Not Found
                  </h1>
                  <p className="text-gray-600">
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
      </SidebarProvider>
    </Router>
  );
}

export default App;
