import { SteelMaterialType } from '../types';

export const MATERIAL_SPECS = {
  [SteelMaterialType.COILS]: {
    loadingTimeMinutes: 45,
    requiresCrane: true,
    maxStackHeight: 1, // Single layer only
    temperatureSensitive: false
  },
  [SteelMaterialType.REBAR]: {
    loadingTimeMinutes: 30,
    requiresCrane: false,
    maxStackHeight: 5,
    temperatureSensitive: false
  },
  [SteelMaterialType.SHEETS]: {
    loadingTimeMinutes: 40,
    requiresCrane: true,
    maxStackHeight: 3,
    temperatureSensitive: true // Rust risk
  },
  [SteelMaterialType.BEAMS]: {
    loadingTimeMinutes: 50,
    requiresCrane: true,
    maxStackHeight: 2,
    temperatureSensitive: false
  },
  [SteelMaterialType.PIPES]: {
    loadingTimeMinutes: 35,
    requiresCrane: false,
    maxStackHeight: 4,
    temperatureSensitive: false
  },
  [SteelMaterialType.WIRE]: {
    loadingTimeMinutes: 20,
    requiresCrane: false,
    maxStackHeight: 6,
    temperatureSensitive: true
  }
};