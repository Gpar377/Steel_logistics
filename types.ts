export enum OrderStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  DELAYED = 'DELAYED'
}

export enum PriorityLevel {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE'
}

export enum SteelMaterialType {
  COILS = 'Steel Coils',
  REBAR = 'Reinforcement Bars',
  SHEETS = 'Steel Sheets',
  BEAMS = 'I-Beams/H-Beams',
  PIPES = 'Steel Pipes',
  WIRE = 'Steel Wire'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  address: string;
  coords: Coordinates;
}

export interface Order {
  id: string;
  customerName: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  weightKg: number;
  priority: PriorityLevel;
  timeWindowStart: string; // ISO String
  timeWindowEnd: string; // ISO String
  status: OrderStatus;
  assignedDriverId?: string;
  
  // Steel Specifics
  materialType: SteelMaterialType;
  requiresCrane: boolean;
  loadingEquipmentAvailable?: boolean;
}

export interface Driver {
  id: string;
  name: string;
  vehicleCapacityKg: number;
  currentLocation: Coordinates;
  status: DriverStatus;
  avatarUrl?: string;
}

export interface RouteStop {
  orderId: string;
  type: 'PICKUP' | 'DELIVERY';
  location: Location;
  estimatedArrival: string;
  completed: boolean;
  
  // AI/Traffic Metadata
  predictedDelayMinutes?: number;
  trafficLevel?: 'LOW' | 'MODERATE' | 'HEAVY' | 'SEVERE';
}

export interface OptimizedRoute {
  driverId: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  totalTimeMinutes: number;
  
  // AI Metrics
  aiConfidenceScore?: number; // 0-1
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}