import { ProtectedRoute } from './components/ProtectedRoute';
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
  TemplateSettingsPage,
  SignInPage,
} from './pages';
import {
  BillPayPage as DropinBillPayPage,
  InvoicingPage as DropinInvoicingPage,
} from './pages/Dropin';
import { Routes, Route } from 'react-router-dom';

// Protected App Layout Component
function ProtectedApp() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto p-4">
        <Routes>
          <Route path="/" element={<BillPayPage />} />
          <Route path="/bill-pay" element={<BillPayPage />} />
          <Route path="/invoicing" element={<InvoicingPage />} />
          <Route path="/approval-requests" element={<ApprovalRequestsPage />} />
          <Route path="/counterparts" element={<CounterpartsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/roles-and-approvals" element={<RolesApprovalsPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/template-settings" element={<TemplateSettingsPage />} />
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
  );
}

function App() {
  return (
    <Routes>
      {/* Public routes for authentication */}
      <Route path="/sign-in" element={<SignInPage />} />

      {/* All other routes are protected */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ProtectedApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
