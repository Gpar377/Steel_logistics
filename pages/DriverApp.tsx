import React, { useState, useEffect } from 'react';
import { MOCK_ORDERS, MOCK_DRIVERS } from '../constants';
import { OptimizedRoute, DriverStatus, Order } from '../types';
import { optimizeRoutes } from '../services/routeOptimizer';
import { CheckCircle, Navigation, Camera, Phone, Menu, MapPin, ChevronRight, X, AlertOctagon, RefreshCw } from 'lucide-react';
import MapVisualization from '../components/MapVisualization';

const DriverApp: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  // Use a real driver profile from mocks
  const CURRENT_DRIVER_ID = MOCK_DRIVERS[0].id;
  const currentDriverProfile = MOCK_DRIVERS[0];

  const [myOrders, setMyOrders] = useState<Order[]>(MOCK_ORDERS.slice(0, 3));
  const [activeTab, setActiveTab] = useState<'route' | 'list'>('route'); // Default to route view for immediate feedback
  const [showProofModal, setShowProofModal] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(true);
  
  // Real Route State
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  
  // State for driver location simulation
  const [currentLocation, setCurrentLocation] = useState(currentDriverProfile.currentLocation);

  // Active order is the first one in the synchronized list
  const activeOrder = myOrders[0]; 

  // Load Optimized Route on Mount
  useEffect(() => {
    const fetchRoute = async () => {
        setIsRouteLoading(true);
        try {
            // Run the actual AI optimizer to get a real route
            const allRoutes = await optimizeRoutes(MOCK_ORDERS, MOCK_DRIVERS);
            const myRoute = allRoutes.find(r => r.driverId === CURRENT_DRIVER_ID);
            
            if (myRoute) {
                setOptimizedRoute(myRoute);
                
                // CRITICAL: Sync the "Manifest" list with the Route stops
                // Filter and sort the global order list to match the route stop sequence
                const routeOrderIds = myRoute.stops.map(s => s.orderId);
                // Remove duplicates (since stops have pickup AND delivery for same order)
                const uniqueOrderIds = Array.from(new Set(routeOrderIds));
                
                const sortedOrders = uniqueOrderIds
                    .map(id => MOCK_ORDERS.find(o => o.id === id))
                    .filter((o): o is Order => o !== undefined);

                if (sortedOrders.length > 0) {
                    setMyOrders(sortedOrders);
                }
            } else {
                // Fallback if no route assigned by AI
                console.warn("No route assigned to driver. Creating fallback.");
                setOptimizedRoute({
                    driverId: CURRENT_DRIVER_ID,
                    stops: myOrders.map(o => ({
                       orderId: o.id, location: o.deliveryLocation, type: 'DELIVERY', 
                       completed: false, estimatedArrival: new Date().toISOString()
                    })),
                    totalDistanceKm: 45,
                    totalTimeMinutes: 90,
                    aiConfidenceScore: 0.8
                });
            }
        } catch (e) {
            console.error("Route calculation error:", e);
        } finally {
            setIsRouteLoading(false);
        }
    };
    
    // Slight delay to ensure map container is ready
    setTimeout(fetchRoute, 500);
  }, []);

  // Simulation: Move driver towards destination
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeOrder && activeOrder.status !== 'DELIVERED') {
         const target = activeOrder.deliveryLocation.coords;
         const latDiff = target.lat - currentLocation.lat;
         const lngDiff = target.lng - currentLocation.lng;
         const speedFactor = 0.05;
         
         // Update location only if valid
         if (!isNaN(latDiff) && !isNaN(lngDiff)) {
             setCurrentLocation(prev => ({
               lat: prev.lat + (latDiff * speedFactor) + (Math.random() - 0.5) * 0.0001,
               lng: prev.lng + (lngDiff * speedFactor) + (Math.random() - 0.5) * 0.0001
             }));
         }
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [activeOrder, currentLocation]);

  // Safe distance calculation helper
  const getDistanceString = () => {
    if (!activeOrder || !currentLocation) return "--";
    const dist = Math.sqrt(
      Math.pow(activeOrder.deliveryLocation.coords.lat - currentLocation.lat, 2) + 
      Math.pow(activeOrder.deliveryLocation.coords.lng - currentLocation.lng, 2)
    ) * 111;
    return isNaN(dist) ? "--" : dist.toFixed(1);
  };

  return (
    <div className="h-screen flex flex-col bg-steel-50 overflow-hidden">
      {/* Mobile Header */}
      <header className="bg-steel-800 text-white p-4 flex justify-between items-center shadow-md z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-steel-700 rounded-full flex items-center justify-center border border-steel-600 overflow-hidden">
             <img src={currentDriverProfile.avatarUrl} alt="Driver" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">{currentDriverProfile.name}</h1>
            <p className="text-xs text-industrial-green flex items-center">
              <span className="w-2 h-2 bg-industrial-green rounded-full mr-1 animate-pulse"></span>
              Online • Truck {currentDriverProfile.id.slice(-4)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={() => setShowEmergency(true)} className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/40 animate-pulse">
                <AlertOctagon size={20} />
            </button>
            <button onClick={onLogout} className="p-2 text-steel-400 hover:text-white">
                <X size={24} />
            </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className={`flex-1 relative ${activeTab === 'route' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        
        {activeTab === 'route' && (
           <div className="w-full h-full relative">
             {isRouteLoading ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-steel-100 z-50">
                     <RefreshCw className="animate-spin text-industrial-orange mb-3" size={32} />
                     <p className="text-steel-600 font-bold text-sm">Calculating AI Route...</p>
                     <p className="text-steel-400 text-xs mt-1">Analyzing traffic & weight constraints</p>
                 </div>
             ) : (
                 <>
                     <MapVisualization 
                       orders={myOrders} 
                       drivers={[{
                         ...currentDriverProfile,
                         status: DriverStatus.BUSY,
                         currentLocation: currentLocation
                        }]}
                       routes={optimizedRoute ? [optimizedRoute] : []}
                     />
                     
                     {/* Turn by Turn overlay */}
                     {activeOrder && (
                        <div className="absolute top-4 left-4 right-4 bg-steel-900/95 text-white p-4 rounded-lg shadow-lg backdrop-blur-sm border-l-4 border-industrial-orange z-[1000]">
                          <div className="flex items-start">
                            <Navigation size={32} className="text-white mr-4 mt-1" />
                            <div>
                              <p className="text-xs text-steel-400 uppercase tracking-wider font-bold">Current Step</p>
                              <h2 className="text-xl font-bold">En Route to {activeOrder.deliveryLocation.address.split(',')[0]}</h2>
                              <p className="text-lg">
                                 {getDistanceString()} km to destination
                              </p>
                              
                              {/* NaN Protection for Confidence Score */}
                              {optimizedRoute?.aiConfidenceScore !== undefined && !isNaN(optimizedRoute.aiConfidenceScore) && (
                                <p className="text-xs text-industrial-orange mt-1">
                                  AI Predicted Delay: <span className="font-bold">{optimizedRoute.stops[0]?.predictedDelayMinutes || 0} mins</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                     )}
                 </>
             )}
           </div>
        )}

        {activeTab === 'list' && (
          <div className="p-4 space-y-4 pb-24">
            <h2 className="text-steel-800 font-bold text-lg mb-2">Today's Manifest</h2>
            
            {activeOrder ? (
            /* Active Job Card */
            <div className="bg-white rounded-lg shadow-md border border-industrial-orange overflow-hidden">
              <div className="bg-industrial-orange px-4 py-2 flex justify-between items-center">
                <span className="text-white font-bold text-sm uppercase tracking-wider">Current Job</span>
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded">Priority: {activeOrder.priority}</span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-steel-900">{activeOrder.customerName}</h3>
                    <p className="text-sm text-steel-500">{activeOrder.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-steel-800">{activeOrder.weightKg} kg</p>
                    <p className="text-xs text-steel-500">{activeOrder.materialType}</p>
                  </div>
                </div>

                <div className="space-y-4 relative pl-4 border-l-2 border-steel-200 ml-1">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-steel-400 rounded-full border-2 border-white"></div>
                    <p className="text-xs text-steel-400">Pickup</p>
                    <p className="text-sm font-medium">{activeOrder.pickupLocation.address}</p>
                    <p className="text-xs text-green-600 font-medium">Completed 08:30 AM</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[23px] top-1 w-4 h-4 bg-industrial-orange rounded-full border-2 border-white animate-pulse"></div>
                    <p className="text-xs text-steel-400">Delivery</p>
                    <p className="text-sm font-medium">{activeOrder.deliveryLocation.address}</p>
                    <p className="text-xs text-industrial-orange font-medium">ETA 10:45 AM</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setShowEmergency(true)} className="flex items-center justify-center py-3 bg-steel-100 text-steel-700 rounded-lg font-medium hover:bg-steel-200">
                    <Phone size={18} className="mr-2" /> Contact
                  </button>
                  <button 
                    onClick={() => setShowProofModal(true)}
                    className="flex items-center justify-center py-3 bg-steel-800 text-white rounded-lg font-medium hover:bg-steel-700 shadow-lg"
                  >
                    <CheckCircle size={18} className="mr-2" /> Complete
                  </button>
                </div>
              </div>
            </div>
            ) : (
                <div className="p-8 text-center text-steel-500">No active orders assigned.</div>
            )}

            {/* Upcoming Jobs */}
            <h3 className="text-steel-600 font-semibold text-sm mt-6">Upcoming</h3>
            {myOrders.slice(1).map(order => (
              <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-steel-200 flex justify-between items-center opacity-75">
                <div>
                  <h4 className="font-semibold text-steel-800">{order.customerName}</h4>
                  <p className="text-xs text-steel-500">{order.deliveryLocation.address}</p>
                </div>
                <ChevronRight className="text-steel-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proof of Delivery Modal Overlay */}
      {showProofModal && (
        <div className="absolute inset-0 z-50 bg-steel-900/90 flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-steel-900">Proof of Delivery</h3>
              <button onClick={() => setShowProofModal(false)}><X className="text-steel-500" /></button>
            </div>
            
            <div className="space-y-4 mb-6">
              <button className="w-full h-32 border-2 border-dashed border-steel-300 rounded-lg flex flex-col items-center justify-center text-steel-500 hover:bg-steel-50 hover:border-industrial-orange transition-colors">
                <Camera size={32} className="mb-2" />
                <span>Tap to take photo of signature/cargo</span>
              </button>
              
              <div className="flex items-center space-x-3 p-3 bg-steel-50 rounded-lg">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-steel-700 font-bold border">JS</div>
                <div className="text-sm text-steel-600">Signed by {currentDriverProfile.name}</div>
              </div>
            </div>

            <button 
              onClick={() => {
                setShowProofModal(false);
                alert("Delivery Completed!");
              }}
              className="w-full py-4 bg-industrial-green text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition-colors"
            >
              Confirm Delivery
            </button>
          </div>
        </div>
      )}

      {/* Emergency Contact Modal */}
      {showEmergency && (
        <div className="absolute inset-0 z-50 bg-red-900/90 flex flex-col justify-center px-6">
          <div className="bg-white rounded-xl p-6 shadow-2xl animate-scale-up">
            <div className="text-center mb-6">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertOctagon size={32} className="text-red-600" />
               </div>
               <h3 className="text-xl font-bold text-gray-900">Emergency & Support</h3>
               <p className="text-sm text-gray-500">Tap to call instantly</p>
            </div>
            
            <div className="space-y-3">
               <button onClick={() => window.location.href = 'tel:911'} className="w-full py-4 bg-red-600 text-white font-bold rounded-lg flex items-center justify-center hover:bg-red-700">
                  <Phone className="mr-2" /> Emergency (911)
               </button>
               <button onClick={() => window.location.href = 'tel:5550123'} className="w-full py-4 bg-steel-100 text-steel-800 font-bold rounded-lg flex items-center justify-center hover:bg-steel-200">
                  Dispatcher (HQ)
               </button>
               <button onClick={() => setShowEmergency(false)} className="w-full py-3 text-steel-500 font-medium">
                  Cancel
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-steel-200 flex justify-around p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0">
        <button 
          onClick={() => setActiveTab('list')}
          className={`p-3 rounded-lg flex flex-col items-center ${activeTab === 'list' ? 'text-industrial-orange' : 'text-steel-400'}`}
        >
          <Menu size={24} />
          <span className="text-[10px] font-medium mt-1">Manifest</span>
        </button>
        <button 
          className="p-3 -mt-8 bg-steel-800 rounded-full text-white shadow-xl border-4 border-steel-50 hover:scale-105 transition-transform"
        >
          <Camera size={28} />
        </button>
        <button 
          onClick={() => setActiveTab('route')}
          className={`p-3 rounded-lg flex flex-col items-center ${activeTab === 'route' ? 'text-industrial-orange' : 'text-steel-400'}`}
        >
          <MapPin size={24} />
          <span className="text-[10px] font-medium mt-1">Route</span>
        </button>
      </nav>
    </div>
  );
};

export default DriverApp;