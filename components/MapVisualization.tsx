import React, { useEffect, useRef } from 'react';
import { Driver, Order, OptimizedRoute, Coordinates } from '../types';

interface MapVisualizationProps {
  orders: Order[];
  drivers: Driver[];
  routes?: OptimizedRoute[];
  onOrderClick?: (order: Order) => void;
  focusedLocation?: Coordinates | null;
}

// Leaflet types (mocking strictly for TS within this file if pure JS lib is loaded globally)
declare global {
  interface Window {
    L: any;
  }
}

const MapVisualization: React.FC<MapVisualizationProps> = ({ orders, drivers, routes, onOrderClick, focusedLocation }) => {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Keep track of layers to remove them cleanly on updates
  const layersRef = useRef<{
    drivers: any[];
    orders: any[];
    routes: any[];
  }>({ drivers: [], orders: [], routes: [] });

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || !window.L) return;

    if (!mapRef.current) {
      // Create map centered on Bangalore
      const map = window.L.map(containerRef.current, {
        zoomControl: false // We can add custom zoom controls if needed, or keep default
      }).setView([12.9716, 77.5946], 11);

      // Re-enable zoom control at specific position
      window.L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Use CartoDB Positron for industrial/clean look
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapRef.current = map;
    }

    // Force map resize calculation when component mounts/updates
    setTimeout(() => {
        mapRef.current?.invalidateSize();
    }, 100);
  }, []);

  // Handle Focus Change
  useEffect(() => {
    if (mapRef.current && focusedLocation) {
        mapRef.current.flyTo([focusedLocation.lat, focusedLocation.lng], 14, {
            animate: true,
            duration: 1.5
        });
    }
  }, [focusedLocation]);

  // Render/Update Layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.L) return;
    const L = window.L;
    let isMounted = true; // Async safety flag

    // --- Helper for Icons ---
    const createTruckIcon = (color: string) => L.divIcon({
      className: 'custom-truck-icon',
      html: `<div style="background-color: white; border: 2px solid ${color}; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="13" x="2" y="5" rx="2" ry="2"/><path d="M16 12h6"/><path d="M23 9h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
             </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const createOrderIcon = (color: string, type: 'pickup' | 'delivery') => L.divIcon({
      className: 'custom-order-icon',
      html: `<div style="background-color: ${color}; border: 2px solid white; border-radius: 50%; width: ${type === 'pickup' ? 12 : 16}px; height: ${type === 'pickup' ? 12 : 16}px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // --- CLEAR OLD LAYERS ---
    layersRef.current.drivers.forEach(l => map.removeLayer(l));
    layersRef.current.orders.forEach(l => map.removeLayer(l));
    layersRef.current.routes.forEach(l => map.removeLayer(l));
    layersRef.current.drivers = [];
    layersRef.current.orders = [];
    layersRef.current.routes = [];

    // --- RENDER ORDERS ---
    orders.forEach(order => {
        // Pickup Marker
        if (order.status !== 'DELIVERED') {
            const pickupMarker = L.marker([order.pickupLocation.coords.lat, order.pickupLocation.coords.lng], {
                icon: createOrderIcon('#64748b', 'pickup')
            })
            .bindPopup(`<div class="font-sans">
                <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Pickup</div>
                <div class="font-bold text-sm">${order.customerName}</div>
                <div class="text-xs text-gray-600">${order.pickupLocation.address}</div>
            </div>`)
            .on('click', () => onOrderClick && onOrderClick(order))
            .addTo(map);
            layersRef.current.orders.push(pickupMarker);
        }

        // Delivery Marker
        const isCritical = order.priority === 'CRITICAL';
        const color = isCritical ? '#f97316' : '#334155';
        
        const deliveryMarker = L.marker([order.deliveryLocation.coords.lat, order.deliveryLocation.coords.lng], {
            icon: createOrderIcon(color, 'delivery')
        })
        .bindPopup(`<div class="font-sans">
            <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Delivery</div>
            <div class="font-bold text-sm text-steel-800">${order.customerName}</div>
            <div class="text-xs text-gray-600 mb-1">${order.deliveryLocation.address}</div>
            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold ${isCritical ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}">${order.priority}</span>
        </div>`)
        .on('click', () => onOrderClick && onOrderClick(order))
        .addTo(map);
        layersRef.current.orders.push(deliveryMarker);
    });

    // --- RENDER DRIVERS ---
    drivers.forEach(driver => {
        const color = driver.status === 'AVAILABLE' ? '#10b981' : (driver.status === 'BUSY' ? '#f59e0b' : '#64748b');
        
        const marker = L.marker([driver.currentLocation.lat, driver.currentLocation.lng], {
            icon: createTruckIcon(color),
            zIndexOffset: 1000 // Keep drivers on top
        })
        .bindTooltip(driver.name, { permanent: true, direction: 'bottom', className: 'bg-white/90 border border-gray-200 text-[10px] px-1 py-0 rounded font-bold shadow-sm text-steel-800' })
        .addTo(map);
        layersRef.current.drivers.push(marker);
    });

    // --- RENDER ROUTES (With Road Geometry) ---
    if (routes && routes.length > 0) {
        routes.forEach((route, idx) => {
            const driver = drivers.find(d => d.id === route.driverId);
            if (!driver) return;

            const isPrimary = idx === 0;
            const color = isPrimary ? '#f97316' : '#64748b'; 
            
            const routeGroup = L.featureGroup().addTo(map);
            layersRef.current.routes.push(routeGroup);

            // 1. Prepare Waypoints
            const waypoints = [
                `${driver.currentLocation.lng},${driver.currentLocation.lat}`,
                ...route.stops.map(s => `${s.location.coords.lng},${s.location.coords.lat}`)
            ];

            // 2. Draw Temporary Straight Line (Dashed)
            const latlngs = [
                [driver.currentLocation.lat, driver.currentLocation.lng],
                ...route.stops.map(s => [s.location.coords.lat, s.location.coords.lng])
            ];
            
            const straightLine = L.polyline(latlngs, {
                color: color,
                weight: 3,
                opacity: 0.5,
                dashArray: '10, 10' // Dashed to indicate "Calculating..."
            }).addTo(routeGroup);

            // 3. Fetch Actual Road Geometry
            const url = `https://router.project-osrm.org/route/v1/driving/${waypoints.join(';')}?overview=full&geometries=geojson`;

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (!isMounted) return; // Cleanup check
                    
                    if (data.routes && data.routes[0]) {
                        routeGroup.removeLayer(straightLine);

                        // Draw Road Polyline
                        L.geoJSON(data.routes[0].geometry, {
                            style: {
                                color: color,
                                weight: isPrimary ? 5 : 3,
                                opacity: 0.9,
                                lineCap: 'round',
                                lineJoin: 'round'
                            }
                        }).addTo(routeGroup);

                        // Transparent buffer line for easier clicking
                        L.geoJSON(data.routes[0].geometry, {
                            style: { color: 'transparent', weight: 20 }
                        })
                        .bindTooltip(
                           `<div class="text-center">
                              <div class="font-bold text-xs uppercase text-gray-500">Route Plan</div>
                              <div class="font-bold text-sm">${driver.name}</div>
                              <div class="text-xs">${(data.routes[0].distance/1000).toFixed(1)} km • ${Math.round(data.routes[0].duration/60)} min</div>
                            </div>`
                        , { sticky: true }).addTo(routeGroup);
                    }
                })
                .catch(err => {
                    if (!isMounted) return;
                    console.warn("Routing API fetch failed, keeping straight lines.", err);
                    // Straight line remains as fallback
                });
        });
    }

    return () => {
        isMounted = false;
    };

  }, [orders, drivers, routes, onOrderClick]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-steel-200 shadow-inner bg-steel-100">
      <div id="map-container" ref={containerRef} className="w-full h-full z-0"></div>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-steel-200 z-[1000] text-xs pointer-events-auto">
         <div className="flex items-center mb-1"><span className="w-3 h-3 rounded-full border-2 border-white bg-industrial-orange shadow-sm mr-2"></span> Critical Delivery</div>
         <div className="flex items-center mb-1"><span className="w-3 h-3 rounded-full border-2 border-white bg-steel-700 shadow-sm mr-2"></span> Standard Delivery</div>
         <div className="flex items-center mb-1"><span className="w-2 h-2 rounded-full border border-white bg-steel-400 mr-2 ml-0.5"></span> Pickup Point</div>
         <div className="flex items-center"><span className="w-4 h-0.5 bg-industrial-orange border-t-2 border-dashed border-industrial-orange mr-2"></span> Active Route</div>
      </div>
    </div>
  );
};

export default MapVisualization;