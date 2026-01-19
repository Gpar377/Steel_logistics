import { SteelMaterialType } from '../types';
import { MATERIAL_SPECS } from '../constants/steelMaterials';

export function calculateLoadingTime(
  material: SteelMaterialType,
  weightKg: number,
  hasEquipment: boolean = true
): number {
  const specs = MATERIAL_SPECS[material] || MATERIAL_SPECS[SteelMaterialType.COILS];
  const baseTime = specs.loadingTimeMinutes;
  
  // Loading time scales with weight, but not linearly (efficiency gains)
  const weightFactor = Math.max(1, weightKg / 5000); 
  
  // Manual loading takes significantly longer
  const equipmentMultiplier = hasEquipment ? 1 : 2.5;
  
  // Add crane setup time if required
  const craneSetup = specs.requiresCrane ? 15 : 0;
  
  return Math.ceil((baseTime * weightFactor * equipmentMultiplier) + craneSetup);
}

export function checkWeightPermit(
  weightKg: number,
  routeType: 'highway' | 'city'
): { needsPermit: boolean; maxAllowed: number; warning?: string } {
  const limits = {
    highway: 25000, // 25 tons
    city: 16000     // 16 tons
  };
  
  const maxAllowed = limits[routeType];
  const needsPermit = weightKg > maxAllowed;
  
  let warning;
  if (needsPermit) {
    warning = `Load exceeds ${routeType} limit of ${maxAllowed/1000}T. Special permit required.`;
  }

  return {
    needsPermit,
    maxAllowed,
    warning
  };
}