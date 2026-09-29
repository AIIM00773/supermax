import { useState } from 'react';
import LoadingPage from './pages/LoadingPage';
import LoginPage from './pages/LoginPage';
import { useUser } from './contexts/user';

// Import all role-based dashboards
import StoreManagerDashboard from './pages/Dashboards/StoreManagerDashboard';
import InventoryAdminDashboard from './pages/Dashboards/InventoryAdminDashboard';
import FinanceManagerDashboard from './pages/Dashboards/FinanceManagerDashboard';

export default function App() {
  const { is_authenticated, user, authentication_state } = useUser();

  const [authState, setAuthState] = useState<
    "loading" | "authenticated" | "validating" | "not_validated"
  >("not_validated");

  // Show loading spinner while resolving auth state
  if (authentication_state === "loading") {
    return <LoadingPage />;
  }

  // Render role-specific dashboard when user is authenticated
  if (user && is_authenticated) {
   switch (user.role) {
  case "Store Manager":
    return <StoreManagerDashboard />;

  case "Inventory Admin":
    return <InventoryAdminDashboard />;

  case "Finance Manager":
    return <FinanceManagerDashboard />;
}
  }

  return <LoginPage setAuthState={setAuthState} />;
}