import React from 'react';
import { Order, PriorityLevel } from '../types';
import { Calendar, MapPin, Weight, AlertCircle } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  compact?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, compact }) => {
  const isCritical = order.priority === PriorityLevel.CRITICAL;

  return (
    <div className={`bg-white border-l-4 rounded shadow-sm p-4 mb-3 transition hover:shadow-md ${isCritical ? 'border-l-industrial-red' : 'border-l-steel-400'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-steel-800 text-sm">{order.customerName}</h3>
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${isCritical ? 'bg-red-100 text-red-800' : 'bg-steel-100 text-steel-600'}`}>
          {order.priority}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-steel-500 text-xs">
          <MapPin size={14} className="mr-2 flex-shrink-0" />
          <span className="truncate">{order.deliveryLocation.address}</span>
        </div>
        
        {!compact && (
          <>
            <div className="flex items-center text-steel-500 text-xs">
              <Weight size={14} className="mr-2 flex-shrink-0" />
              <span>{order.weightKg.toLocaleString()} kg</span>
            </div>
            <div className="flex items-center text-steel-500 text-xs">
              <Calendar size={14} className="mr-2 flex-shrink-0" />
              <span>Due: {new Date(order.timeWindowEnd).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderCard;