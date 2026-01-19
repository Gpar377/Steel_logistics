import { Driver, DriverStatus, Order, OrderStatus, PriorityLevel, SteelMaterialType } from './types';

// Central Hub: Peenya Industrial Area, Bangalore
export const HUB_LOCATION = { lat: 13.0329, lng: 77.5128 };

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'KA-04-DK-1921',
    name: 'Ramesh Gowda',
    vehicleCapacityKg: 25000,
    currentLocation: { lat: 13.0329, lng: 77.5128 }, // At Hub (Peenya)
    status: DriverStatus.AVAILABLE,
    avatarUrl: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: 'KA-53-AD-4455',
    name: 'Suresh Reddy',
    vehicleCapacityKg: 20000,
    currentLocation: { lat: 12.9716, lng: 77.5946 }, // Near MG Road
    status: DriverStatus.BUSY,
    avatarUrl: 'https://picsum.photos/100/100?random=2'
  },
  {
    id: 'KA-01-XY-9988',
    name: 'Manjunath Rao',
    vehicleCapacityKg: 25000,
    currentLocation: { lat: 12.9141, lng: 77.6109 }, // BTM Layout
    status: DriverStatus.AVAILABLE,
    avatarUrl: 'https://picsum.photos/100/100?random=3'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-BLR-2401',
    customerName: 'Jindal Aluminium Ltd',
    pickupLocation: { address: 'Peenya Industrial Area', coords: { lat: 13.0329, lng: 77.5128 } },
    deliveryLocation: { address: 'Electronic City Phase 1', coords: { lat: 12.8399, lng: 77.6770 } },
    weightKg: 12000,
    priority: PriorityLevel.HIGH,
    timeWindowStart: '2023-10-27T09:00:00',
    timeWindowEnd: '2023-10-27T12:00:00',
    status: OrderStatus.PENDING,
    materialType: SteelMaterialType.COILS,
    requiresCrane: true
  },
  {
    id: 'ORD-BLR-2402',
    customerName: 'Prestige Construction Site',
    pickupLocation: { address: 'Peenya Industrial Area', coords: { lat: 13.0329, lng: 77.5128 } },
    deliveryLocation: { address: 'Whitefield Main Road', coords: { lat: 12.9698, lng: 77.7499 } },
    weightKg: 8500,
    priority: PriorityLevel.NORMAL,
    timeWindowStart: '2023-10-27T10:00:00',
    timeWindowEnd: '2023-10-27T16:00:00',
    status: OrderStatus.PENDING,
    materialType: SteelMaterialType.REBAR,
    requiresCrane: false
  },
  {
    id: 'ORD-BLR-2403',
    customerName: 'BMRCL Metro Depot',
    pickupLocation: { address: 'Peenya Industrial Area', coords: { lat: 13.0329, lng: 77.5128 } },
    deliveryLocation: { address: 'Baiyappanahalli Terminal', coords: { lat: 12.9904, lng: 77.6526 } },
    weightKg: 15000,
    priority: PriorityLevel.CRITICAL,
    timeWindowStart: '2023-10-27T08:00:00',
    timeWindowEnd: '2023-10-27T10:00:00',
    status: OrderStatus.PENDING,
    materialType: SteelMaterialType.BEAMS,
    requiresCrane: true
  },
  {
    id: 'ORD-BLR-2404',
    customerName: 'Toyota Kirloskar Auto Parts',
    pickupLocation: { address: 'Peenya Industrial Area', coords: { lat: 13.0329, lng: 77.5128 } },
    deliveryLocation: { address: 'Bidadi Industrial Area', coords: { lat: 12.7981, lng: 77.3888 } },
    weightKg: 5000,
    priority: PriorityLevel.NORMAL,
    timeWindowStart: '2023-10-27T13:00:00',
    timeWindowEnd: '2023-10-27T17:00:00',
    status: OrderStatus.PENDING,
    materialType: SteelMaterialType.SHEETS,
    requiresCrane: true
  },
  {
    id: 'ORD-BLR-2405',
    customerName: 'Bosch Adugodi',
    pickupLocation: { address: 'Peenya Industrial Area', coords: { lat: 13.0329, lng: 77.5128 } },
    deliveryLocation: { address: 'Koramangala, Hosur Rd', coords: { lat: 12.9352, lng: 77.6101 } },
    weightKg: 2000,
    priority: PriorityLevel.HIGH,
    timeWindowStart: '2023-10-27T11:00:00',
    timeWindowEnd: '2023-10-27T14:00:00',
    status: OrderStatus.PENDING,
    materialType: SteelMaterialType.WIRE,
    requiresCrane: false
  }
];