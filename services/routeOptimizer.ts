import { Driver, Order, OptimizedRoute } from '../types';
import { GeneticRouteOptimizer } from './geneticAlgorithm';

const gaOptimizer = new GeneticRouteOptimizer();

export const optimizeRoutes = async (orders: Order[], drivers: Driver[]): Promise<OptimizedRoute[]> => {
  console.log("🚀 Starting AI Optimization...");
  
  const routes = await gaOptimizer.optimize(orders, drivers);
  
  console.log("✅ Optimization Complete. Routes:", routes.length);
  return routes;
};