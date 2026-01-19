import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_DRIVERS, MOCK_ORDERS } from '../constants';
import { Order, OptimizedRoute, Driver, PriorityLevel, OrderStatus, Coordinates, SteelMaterialType } from '../types';
import { optimizeRoutes } from '../services/routeOptimizer';
import MapVisualization from '../components/MapVisualization';
import OrderCard from '../components/OrderCard';
import { 
  BarChart3, LogOut, Search, 
  Cpu, Users, Package, AlertTriangle,
  Plus, X, Truck, Phone, MapPin, Calendar, Weight, Clock, Info
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardProps {
  onLogout: () => void;
}

const DispatcherDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [routes, setRoutes] = useState<OptimizedRoute[]>([]);
  const [view, setView] = useState<'map' | 'analytics'>('map');
  const [sidebarTab, setSidebarTab] = useState<'orders' | 'drivers'>('orders');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interaction State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mapFocus, setMapFocus] = useState<Coordinates | null>(null);

  // Form State for new order
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    pickupAddress: 'Peenya Industrial Area',
    deliveryAddress: '',
    weight: '',
    priority: PriorityLevel.NORMAL,
    materialType: SteelMaterialType.COILS
  });

  // Simulation: Move drivers periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDrivers(currentDrivers => 
        currentDrivers.map(driver => {
          if (driver.status === 'OFFLINE') return driver;
          
          // Random walk simulation (approx 100-200 meters jitter)
          const latChange = (Math.random() - 0.5) * 0.002;
          const lngChange = (Math.random() - 0.5) * 0.002;
          
          return {
            ...driver,
            currentLocation: {
              lat: driver.currentLocation.lat + latChange,
              lng: driver.currentLocation.lng + lngChange
            }
          };
        })
      );
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const stats = useMemo(() => {
    return {
      pending: orders.filter(o => o.status === 'PENDING').length,
      active: orders.filter(o => o.status === 'IN_TRANSIT').length,
      availableDrivers: drivers.filter(d => d.status === 'AVAILABLE').length
    };
  }, [orders, drivers]);

  // Filtered lists based on search
  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryLocation.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => 
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [drivers, searchQuery]);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    try {
      // Now async to allow for "Traffic API" calls
      const optimized = await optimizeRoutes(orders, drivers);
      setRoutes(optimized);
      
      // Update local state to reflect assignments
      const assignedOrderIds = new Set(optimized.flatMap(r => r.stops.map(s => s.orderId)));
      setOrders(prev => prev.map(o => 
        assignedOrderIds.has(o.id) ? { ...o, status: 'ASSIGNED' as any } : o
      ));
    } catch (error) {
      console.error("Optimization failed:", error);
      alert("Failed to calculate routes. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order: Order = {
      id: `ORD-BLR-${2400 + orders.length + 1}`,
      customerName: newOrder.customerName,
      pickupLocation: { address: newOrder.pickupAddress, coords: { lat: 13.0329, lng: 77.5128 } }, // Default near hub (Peenya)
      deliveryLocation: { 
        address: newOrder.deliveryAddress, 
        // Randomize location around Bangalore for demo purposes
        coords: { lat: 12.97 + (Math.random() - 0.5) * 0.1, lng: 77.59 + (Math.random() - 0.5) * 0.1 } 
      },
      weightKg: parseInt(newOrder.weight) || 1000,
      priority: newOrder.priority,
      timeWindowStart: new Date().toISOString(),
      timeWindowEnd: new Date(Date.now() + 3600000 * 4).toISOString(),
      status: OrderStatus.PENDING,
      materialType: newOrder.materialType,
      requiresCrane: [SteelMaterialType.COILS, SteelMaterialType.BEAMS, SteelMaterialType.SHEETS].includes(newOrder.materialType)
    };

    setOrders([order, ...orders]);
    setShowCreateModal(false);
    setNewOrder({ 
        customerName: '', 
        pickupAddress: 'Peenya Industrial Area', 
        deliveryAddress: '', 
        weight: '', 
        priority: PriorityLevel.NORMAL,
        materialType: SteelMaterialType.COILS
    });
  };

  const handleCenterMap = (order: Order) => {
    // Focus on delivery location
    setMapFocus(order.deliveryLocation.coords);
    // If modal is open, we can close it, or keep it open. Closing feels like "Take me there"
    setSelectedOrder(null);
  };

  const analyticsData = [
    { name: 'Mon', trips: 12, efficiency: 85 },
    { name: 'Tue', trips: 15, efficiency: 82 },
    { name: 'Wed', trips: 18, efficiency: 90 },
    { name: 'Thu', trips: 14, efficiency: 88 },
    { name: 'Fri', trips: 20, efficiency: 84 },
  ];

  return (
    <div className="flex h-screen bg-steel-100 text-steel-800 font-sans">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-steel-900 text-white flex flex-col transition-all duration-300 shadow-xl z-20">
        <div className="p-4 lg:p-6 flex items-center justify-center lg:justify-start border-b border-steel-700">
          <div className="w-8 h-8 bg-industrial-orange rounded flex items-center justify-center font-bold text-white shrink-0">ST</div>
          <span className="ml-3 font-bold text-lg hidden lg:block tracking-tight">SteelTrack</span>
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-2 lg:px-4">
          <button 
            onClick={() => setView('map')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${view === 'map' ? 'bg-industrial-orange text-white shadow-lg' : 'text-steel-400 hover:bg-steel-800 hover:text-white'}`}
          >
            <Users size={20} />
            <span className="ml-3 hidden lg:block font-medium">Operations</span>
          </button>
          
          <button 
             onClick={() => setView('analytics')}
             className={`w-full flex items-center p-3 rounded-lg transition-all ${view === 'analytics' ? 'bg-industrial-orange text-white shadow-lg' : 'text-steel-400 hover:bg-steel-800 hover:text-white'}`}
          >
            <BarChart3 size={20} />
            <span className="ml-3 hidden lg:block font-medium">Analytics</span>
          </button>
        </nav>

        <div className="p-4 border-t border-steel-700">
          <button onClick={onLogout} className="flex items-center text-steel-400 hover:text-white transition-colors w-full justify-center lg:justify-start">
            <LogOut size={20} />
            <span className="ml-3 hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-steel-200 flex items-center justify-between px-6 shadow-sm z-10">
          <h2 className="text-xl font-bold text-steel-800">{view === 'map' ? 'Live Operations' : 'Performance Analytics'}</h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" size={16} />
              <input 
                type="text" 
                placeholder="Search orders, drivers..." 
                className="pl-10 pr-4 py-2 bg-steel-50 border border-steel-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-industrial-orange/20 focus:border-industrial-orange w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-steel-600">System Online</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden p-6 relative">
          {view === 'map' ? (
            <div className="flex h-full gap-6">
              {/* Left Panel (Management) */}
              <div className="w-1/3 min-w-[320px] bg-white rounded-xl shadow-sm border border-steel-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-steel-100 bg-steel-50">
                   {/* Panel Tabs */}
                   <div className="flex p-1 bg-steel-200 rounded-lg mb-4">
                     <button 
                       onClick={() => setSidebarTab('orders')}
                       className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${sidebarTab === 'orders' ? 'bg-white text-steel-800 shadow-sm' : 'text-steel-500 hover:text-steel-700'}`}
                     >
                       Orders ({stats.pending})
                     </button>
                     <button 
                       onClick={() => setSidebarTab('drivers')}
                       className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${sidebarTab === 'drivers' ? 'bg-white text-steel-800 shadow-sm' : 'text-steel-500 hover:text-steel-700'}`}
                     >
                       Drivers ({stats.availableDrivers})
                     </button>
                   </div>
                   
                   {sidebarTab === 'orders' ? (
                      <div className="grid grid-cols-2 gap-2">
                         <button 
                           onClick={() => setShowCreateModal(true)}
                           className="py-2 px-3 bg-industrial-orange text-white rounded-lg flex items-center justify-center font-bold text-sm hover:bg-orange-600 transition"
                         >
                           <Plus size={16} className="mr-1" /> New Order
                         </button>
                         <button 
                           onClick={handleOptimize}
                           disabled={isOptimizing}
                           className="py-2 px-3 bg-steel-800 text-white rounded-lg flex items-center justify-center font-bold text-sm hover:bg-steel-700 transition disabled:opacity-70"
                         >
                           {isOptimizing ? <span className="animate-spin">⟳</span> : <Cpu size={16} className="mr-1" />} Optimize
                         </button>
                      </div>
                   ) : (
                      <div className="text-xs text-steel-500 text-center font-medium py-2">
                        Real-time Fleet Status (Updating...)
                      </div>
                   )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-steel-50/50">
                  {sidebarTab === 'orders' ? (
                    filteredOrders.length > 0 ? (
                      filteredOrders.map(order => (
                        <div key={order.id} onClick={() => setSelectedOrder(order)} className="cursor-pointer transition hover:translate-x-1">
                            <OrderCard order={order} />
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-steel-400 text-sm py-4">No orders found</div>
                    )
                  ) : (
                    <div className="space-y-3">
                      {filteredDrivers.length > 0 ? filteredDrivers.map(driver => (
                        <div key={driver.id} className="bg-white p-3 rounded-lg border border-steel-200 shadow-sm flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 ${driver.status === 'AVAILABLE' ? 'bg-industrial-green' : 'bg-steel-400'}`}>
                              {driver.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-steel-800">{driver.name}</h4>
                              <p className="text-xs text-steel-500 flex items-center">
                                <Truck size={10} className="mr-1" /> {driver.vehicleCapacityKg / 1000}T Capacity
                              </p>
                              <p className="text-[10px] text-steel-400 font-mono mt-0.5">
                                {driver.currentLocation.lat.toFixed(4)}, {driver.currentLocation.lng.toFixed(4)}
                              </p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-[10px] font-bold ${driver.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-steel-100 text-steel-600'}`}>
                            {driver.status}
                          </div>
                        </div>
                      )) : (
                        <div className="text-center text-steel-400 text-sm py-4">No drivers found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Map Panel */}
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-steel-200 overflow-hidden relative">
                <MapVisualization 
                   orders={orders} 
                   drivers={drivers} 
                   routes={routes} 
                   onOrderClick={setSelectedOrder}
                   focusedLocation={mapFocus}
                />
                
                {/* Floating Map Legend/Controls */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg border border-steel-200">
                  <h4 className="text-xs font-bold text-steel-500 uppercase mb-2">Legend</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-industrial-orange mr-2"></span> Critical</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-steel-600 mr-2"></span> Standard</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full border-2 border-dashed border-industrial-orange mr-2"></span> Active Route</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full overflow-y-auto">
               <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-steel-200 min-h-[400px]">
                 <h3 className="text-lg font-bold text-steel-800 mb-6">Fleet Efficiency Trends</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}}
                        cursor={{fill: '#f1f5f9'}}
                      />
                      <Bar dataKey="efficiency" fill="#475569" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="trips" fill="#f97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
               </div>

               <div className="bg-white p-6 rounded-xl shadow-sm border border-steel-200">
                 <h3 className="text-lg font-bold text-steel-800 mb-4">Alerts</h3>
                 <div className="space-y-4">
                    <div className="flex items-start p-3 bg-red-50 border border-red-100 rounded-lg">
                      <AlertTriangle className="text-red-500 mr-3 mt-0.5" size={18} />
                      <div>
                        <h4 className="text-sm font-bold text-red-700">Delayed Delivery</h4>
                        <p className="text-xs text-red-600 mt-1">Driver D-102 is 45 mins behind schedule due to traffic.</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                       <div className="text-yellow-600 mr-3 mt-0.5"><Truck size={18} /></div>
                      <div>
                        <h4 className="text-sm font-bold text-yellow-800">Vehicle Maintenance</h4>
                        <p className="text-xs text-yellow-700 mt-1">Truck #405 due for service in 200km.</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Create Order Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-steel-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
              <div className="px-6 py-4 bg-steel-50 border-b border-steel-200 flex justify-between items-center">
                <h3 className="font-bold text-lg text-steel-800">Create New Order</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-steel-400 hover:text-steel-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-steel-500 uppercase mb-1">Customer Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 bg-white border border-steel-300 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none transition"
                    value={newOrder.customerName}
                    onChange={e => setNewOrder({...newOrder, customerName: e.target.value})}
                    placeholder="e.g. Acme Construction"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-steel-500 uppercase mb-1">Pickup Location</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-steel-50 border border-steel-300 rounded-lg text-steel-500 cursor-not-allowed"
                      value={newOrder.pickupAddress}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-steel-500 uppercase mb-1">Delivery Address</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 bg-white border border-steel-300 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none transition"
                      value={newOrder.deliveryAddress}
                      onChange={e => setNewOrder({...newOrder, deliveryAddress: e.target.value})}
                      placeholder="e.g. 123 Industrial Pkwy"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-steel-500 uppercase mb-1">Weight (kg)</label>
                    <input 
                      required
                      type="number" 
                      className="w-full px-4 py-2 bg-white border border-steel-300 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none transition"
                      value={newOrder.weight}
                      onChange={e => setNewOrder({...newOrder, weight: e.target.value})}
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-steel-500 uppercase mb-1">Material Type</label>
                    <select 
                      className="w-full px-4 py-2 bg-white border border-steel-300 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none transition"
                      value={newOrder.materialType}
                      onChange={e => setNewOrder({...newOrder, materialType: e.target.value as SteelMaterialType})}
                    >
                      {Object.values(SteelMaterialType).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-steel-500 uppercase mb-1">Priority</label>
                    <select 
                      className="w-full px-4 py-2 bg-white border border-steel-300 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none transition"
                      value={newOrder.priority}
                      onChange={e => setNewOrder({...newOrder, priority: e.target.value as PriorityLevel})}
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                </div>
                <div className="pt-4 flex space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 text-steel-600 font-bold hover:bg-steel-50 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-industrial-orange text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition"
                  >
                    Create Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-steel-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
              <div className="bg-steel-50 px-6 py-4 border-b border-steel-200 flex justify-between items-center">
                 <div>
                    <h3 className="text-lg font-bold text-steel-800">{selectedOrder.id}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedOrder.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-steel-200 text-steel-600'}`}>{selectedOrder.priority}</span>
                        <span className="text-xs text-steel-400">•</span>
                        <span className="text-xs font-medium text-steel-500">{selectedOrder.status}</span>
                    </div>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-steel-200 rounded-full transition-colors"><X size={20} className="text-steel-500" /></button>
              </div>
              
              <div className="p-6 space-y-6">
                 {/* Customer */}
                 <div className="flex items-start">
                    <div className="bg-steel-100 p-2.5 rounded-full mr-4"><Users size={20} className="text-steel-600" /></div>
                    <div>
                        <p className="text-xs font-bold text-steel-400 uppercase tracking-wide">Customer</p>
                        <p className="text-base font-bold text-steel-800">{selectedOrder.customerName}</p>
                    </div>
                 </div>

                 {/* Route Info */}
                 <div className="relative pl-5 border-l-2 border-steel-200 ml-3.5 space-y-6">
                    <div className="relative">
                        <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 bg-steel-400 border-2 border-white rounded-full"></div>
                        <p className="text-xs font-bold text-steel-400 uppercase tracking-wide">Pickup</p>
                        <p className="text-sm font-semibold text-steel-700">{selectedOrder.pickupLocation.address}</p>
                        <p className="text-xs text-steel-500 mt-0.5 flex items-center"><Clock size={12} className="mr-1"/> 08:00 - 12:00 Window</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[29px] top-1 w-4 h-4 bg-industrial-orange border-2 border-white rounded-full shadow-sm"></div>
                        <p className="text-xs font-bold text-steel-400 uppercase tracking-wide">Delivery</p>
                        <p className="text-sm font-semibold text-steel-700">{selectedOrder.deliveryLocation.address}</p>
                        <p className="text-xs text-steel-500 mt-0.5 flex items-center"><Clock size={12} className="mr-1"/> Due by {new Date(selectedOrder.timeWindowEnd).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                    </div>
                 </div>

                 {/* Cargo Info */}
                 <div className="grid grid-cols-2 gap-4 bg-steel-50 p-4 rounded-lg border border-steel-100">
                    <div>
                        <div className="flex items-center text-xs font-bold text-steel-400 uppercase mb-1"><Weight size={14} className="mr-1.5"/> Cargo Weight</div>
                        <p className="text-lg font-bold text-steel-800">{selectedOrder.weightKg.toLocaleString()} <span className="text-sm font-normal text-steel-500">kg</span></p>
                    </div>
                    <div>
                        <div className="flex items-center text-xs font-bold text-steel-400 uppercase mb-1"><Package size={14} className="mr-1.5"/> Type</div>
                        <p className="text-sm font-bold text-steel-800">{selectedOrder.materialType || 'General Steel'}</p>
                    </div>
                 </div>
              </div>

              <div className="px-6 py-4 border-t border-steel-100 flex space-x-3 bg-white">
                  <button onClick={() => setSelectedOrder(null)} className="flex-1 py-2.5 rounded-lg border border-steel-300 text-steel-600 font-bold text-sm hover:bg-steel-50 transition-colors">
                      Close
                  </button>
                  <button 
                    onClick={() => handleCenterMap(selectedOrder)}
                    className="flex-1 py-2.5 rounded-lg bg-industrial-orange text-white font-bold text-sm shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                  >
                      <MapPin size={16} className="mr-2" /> Locate on Map
                  </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DispatcherDashboard;