import React, { useState, useEffect } from 'react';
import { MOCK_DRIVERS, MOCK_ORDERS } from './constants';
import Login from './pages/Login';
import DispatcherDashboard from './pages/DispatcherDashboard';
import DriverApp from './pages/DriverApp';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<'dispatcher' | 'driver' | null>(null);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);

  if (!currentRole) {
    return <Login onLogin={setCurrentRole} />;
  }

  if (currentRole === 'driver') {
    return <DriverApp onLogout={() => setCurrentRole(null)} />;
  }

  return <DispatcherDashboard onLogout={() => setCurrentRole(null)} />;
};

export default App;