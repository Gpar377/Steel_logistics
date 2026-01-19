import { Coordinates } from '../types';

export interface KarnatakaLocation {
  id: string;
  name: string;
  city: string;
  coords: Coordinates;
  hasCrane: boolean;
  maxWeightKg: number;
  type: 'industrial' | 'construction' | 'warehouse' | 'port';
}

export const KARNATAKA_LOCATIONS: KarnatakaLocation[] = [
  { id: 'BLR-001', name: 'Peenya Industrial Area', city: 'Bangalore', coords: { lat: 13.0329, lng: 77.5128 }, hasCrane: true, maxWeightKg: 30000, type: 'industrial' },
  { id: 'BLR-002', name: 'Electronic City Phase 1', city: 'Bangalore', coords: { lat: 12.8399, lng: 77.6770 }, hasCrane: true, maxWeightKg: 25000, type: 'industrial' },
  { id: 'BLR-003', name: 'Whitefield Tech Park', city: 'Bangalore', coords: { lat: 12.9698, lng: 77.7499 }, hasCrane: false, maxWeightKg: 15000, type: 'construction' },
  { id: 'BLR-004', name: 'Bommanahalli Metro Depot', city: 'Bangalore', coords: { lat: 12.9141, lng: 77.6109 }, hasCrane: true, maxWeightKg: 40000, type: 'construction' },
  { id: 'BLR-005', name: 'Yeshwanthpur Goods Yard', city: 'Bangalore', coords: { lat: 13.0280, lng: 77.5385 }, hasCrane: true, maxWeightKg: 50000, type: 'warehouse' },
  { id: 'BLR-006', name: 'Bidadi Industrial Area', city: 'Bangalore', coords: { lat: 12.7981, lng: 77.3888 }, hasCrane: true, maxWeightKg: 35000, type: 'industrial' },
  { id: 'BLR-007', name: 'Jigani Industrial Area', city: 'Bangalore', coords: { lat: 12.7789, lng: 77.6346 }, hasCrane: true, maxWeightKg: 30000, type: 'industrial' },
  { id: 'MYS-001', name: 'Mysore Steel Plant', city: 'Mysore', coords: { lat: 12.3051, lng: 76.6553 }, hasCrane: true, maxWeightKg: 50000, type: 'industrial' },
  { id: 'MYS-002', name: 'Hebbal Industrial Area', city: 'Mysore', coords: { lat: 12.3375, lng: 76.6121 }, hasCrane: true, maxWeightKg: 30000, type: 'industrial' },
  { id: 'MYS-003', name: 'Belagola Industrial Area', city: 'Mysore', coords: { lat: 12.2711, lng: 76.6040 }, hasCrane: false, maxWeightKg: 20000, type: 'warehouse' },
  { id: 'MNG-001', name: 'New Mangalore Port', city: 'Mangalore', coords: { lat: 12.9163, lng: 74.8070 }, hasCrane: true, maxWeightKg: 100000, type: 'port' },
  { id: 'MNG-002', name: 'NMPT Container Terminal', city: 'Mangalore', coords: { lat: 12.9200, lng: 74.8100 }, hasCrane: true, maxWeightKg: 80000, type: 'port' },
  { id: 'MNG-003', name: 'Baikampady Industrial Area', city: 'Mangalore', coords: { lat: 12.8850, lng: 74.8850 }, hasCrane: true, maxWeightKg: 40000, type: 'industrial' },
  { id: 'HBL-001', name: 'Hubli Industrial Estate', city: 'Hubli', coords: { lat: 15.3647, lng: 75.1240 }, hasCrane: true, maxWeightKg: 35000, type: 'industrial' },
  { id: 'HBL-002', name: 'Dharwad Steel Depot', city: 'Dharwad', coords: { lat: 15.4589, lng: 75.0078 }, hasCrane: true, maxWeightKg: 30000, type: 'warehouse' },
  { id: 'BLG-001', name: 'Belgaum Industrial Area', city: 'Belgaum', coords: { lat: 15.8497, lng: 74.4977 }, hasCrane: true, maxWeightKg: 30000, type: 'industrial' },
  { id: 'BLG-002', name: 'Udyambag Construction Site', city: 'Belgaum', coords: { lat: 15.8667, lng: 74.5167 }, hasCrane: false, maxWeightKg: 20000, type: 'construction' },
  { id: 'TMK-001', name: 'Tumkur Industrial Area', city: 'Tumkur', coords: { lat: 13.3379, lng: 77.1140 }, hasCrane: true, maxWeightKg: 25000, type: 'industrial' },
  { id: 'BLY-001', name: 'Bellary Steel Plant', city: 'Bellary', coords: { lat: 15.1394, lng: 76.9214 }, hasCrane: true, maxWeightKg: 60000, type: 'industrial' },
  { id: 'BLY-002', name: 'Hospet Mining Depot', city: 'Hospet', coords: { lat: 15.2695, lng: 76.3870 }, hasCrane: true, maxWeightKg: 50000, type: 'warehouse' },
  { id: 'DVG-001', name: 'Davangere Industrial Estate', city: 'Davangere', coords: { lat: 14.4644, lng: 75.9218 }, hasCrane: true, maxWeightKg: 30000, type: 'industrial' },
  { id: 'SHM-001', name: 'Shimoga Steel Warehouse', city: 'Shimoga', coords: { lat: 13.9299, lng: 75.5681 }, hasCrane: false, maxWeightKg: 20000, type: 'warehouse' },
  { id: 'HSN-001', name: 'Hassan Construction Hub', city: 'Hassan', coords: { lat: 13.0072, lng: 76.0962 }, hasCrane: false, maxWeightKg: 15000, type: 'construction' },
];

export const KARNATAKA_WEIGHT_LIMITS = {
  city: 16000,
  highway: 25000,
  expressway: 28000,
  bridge_old: 12000,
};

export const AXLE_WEIGHT_LIMITS = {
  single_axle: 10000,
  tandem_axle: 18000,
  tridem_axle: 24000,
};
