import { Coordinates } from '../types';

export type TrafficLevel = 'LOW' | 'MODERATE' | 'HEAVY' | 'SEVERE';

export interface TrafficMetrics {
  distanceKm: number;
  durationMins: number;
  trafficLevel: TrafficLevel;
  incidents: string[];
}

// CONSTANTS
const GOOGLE_MAPS_API_KEY = '' as string; // TODO: Add your Google Maps API Key here for live traffic data

// Helper: Haversine for fallback
const calculateHaversineDistance = (a: Coordinates, b: Coordinates) => {
  const R = 6371; 
  const dLat = (b.lat - a.lat) * (Math.PI / 180);
  const dLng = (b.lng - a.lng) * (Math.PI / 180);
  const temp =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(a.lat * (Math.PI / 180)) * Math.cos(b.lat * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(temp), Math.sqrt(1 - temp));
};

const calculateFallbackMetrics = (from: Coordinates, to: Coordinates): TrafficMetrics => {
  const dist = calculateHaversineDistance(from, to);
  // Assume 35km/h avg city/industrial speed for fallback
  const durationMins = (dist / 35) * 60; 
  
  return {
    distanceKm: parseFloat(dist.toFixed(2)),
    durationMins: Math.round(durationMins),
    trafficLevel: 'MODERATE',
    incidents: []
  };
};

export const fetchTrafficMetrics = async (from: Coordinates, to: Coordinates): Promise<TrafficMetrics> => {
  
  // 1. Try Google Routes API (Requires Key)
  if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.length > 0) {
    try {
      const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration'
        },
        body: JSON.stringify({
          origin: { location: { latLng: { latitude: from.lat, longitude: from.lng } } },
          destination: { location: { latLng: { latitude: to.lat, longitude: to.lng } } },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const route = data.routes?.[0];
        
        if (route) {
          const distanceKm = route.distanceMeters / 1000;
          // Duration format is "123s"
          const durationSeconds = parseInt(route.duration.replace('s', ''));
          const durationMins = durationSeconds / 60;

          // Infer traffic level from speed
          const speedKmh = distanceKm / (durationMins / 60);
          let trafficLevel: TrafficLevel = 'LOW';
          if (speedKmh < 15) trafficLevel = 'SEVERE';
          else if (speedKmh < 30) trafficLevel = 'HEAVY';
          else if (speedKmh < 50) trafficLevel = 'MODERATE';

          return {
            distanceKm: parseFloat(distanceKm.toFixed(2)),
            durationMins: Math.round(durationMins),
            trafficLevel,
            incidents: [] 
          };
        }
      }
    } catch (error) {
      console.warn("Google Maps Traffic API failed, falling back...", error);
    }
  }

  // 2. Try OSRM (Open Source Routing Machine) - Free, no key required
  // Note: OSRM provides "typical" driving times, not always real-time traffic jam data
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`
    );
    
    if (response.ok) {
      const data = await response.json();
      const route = data.routes?.[0];
      
      if (route) {
        const distanceKm = route.distance / 1000;
        const durationMins = route.duration / 60;

        // OSRM durations are usually optimistic free-flow
        const impliedSpeed = distanceKm / (durationMins / 60);
        let trafficLevel: TrafficLevel = 'LOW';
        // Adjust thresholds for OSRM's optimistic nature
        if (impliedSpeed < 25) trafficLevel = 'HEAVY';
        else if (impliedSpeed < 45) trafficLevel = 'MODERATE';

        return {
          distanceKm: parseFloat(distanceKm.toFixed(2)),
          durationMins: Math.round(durationMins),
          trafficLevel,
          incidents: []
        };
      }
    }
  } catch (error) {
    console.warn("OSRM API failed, falling back to calculation...", error);
  }

  // 3. Final Fallback
  return calculateFallbackMetrics(from, to);
};