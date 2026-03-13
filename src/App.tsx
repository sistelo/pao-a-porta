import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/CalendarPage';
import { PlansPage } from './pages/PlansPage';
import { CustomPlanPage } from './pages/CustomPlanPage';
import { ExtrasPage } from './pages/ExtrasPage';
import { AdminPage } from './pages/AdminPage';
import { WalletPage } from './pages/WalletPage';
import { DeliveryPersonPage } from './pages/DeliveryPersonPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { BakerPage } from './pages/BakerPage';
import { ProtectedRoute, RoleBasedRedirect } from './components/ProtectedRoute';

import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { ProductsProvider } from './context/ProductsContext';
import { PlansProvider } from './context/PlansContext';
import { SettingsProvider } from './context/SettingsContext';
import { DeliveryProvider } from './context/DeliveryContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <ProductsProvider>
            <PlansProvider>
            <WalletProvider>
              <DeliveryProvider>
                <div className="app-shell">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                      {/* Customers / Shared Base */}
                      <Route path="/custom-plan" element={<CustomPlanPage />} />
                      <Route path="/extras" element={<ExtrasPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/wallet" element={<WalletPage />} />
                    </Route>

                    {/* Customer Only (Role is checked strictly to avoid weird redirects or maybe let everybody access it initially, but let's allow Customers) */}
                    <Route element={<ProtectedRoute allowedRoles={['Customer']} />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/plan" element={<PlansPage />} />
                    </Route>

                    {/* Admin Only */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                      <Route path="/admin" element={<AdminPage />} />
                    </Route>

                    {/* Delivery Only */}
                    <Route element={<ProtectedRoute allowedRoles={['Delivery']} />}>
                      <Route path="/delivery-mode" element={<DeliveryPersonPage />} />
                    </Route>

                    {/* Baker Only */}
                    <Route element={<ProtectedRoute allowedRoles={['Baker']} />}>
                      <Route path="/baker" element={<BakerPage />} />
                    </Route>

                    {/* Root Redirect */}
                    <Route element={<ProtectedRoute allowedRoles={['Customer', 'Admin', 'Baker', 'Delivery']} fallback={<LandingPage />} />}>
                      <Route path="/" element={<RoleBasedRedirect />} />
                    </Route>
                  </Routes>
                </div>
              </DeliveryProvider>
            </WalletProvider>
          </PlansProvider>
        </ProductsProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
