import React from 'react';
import { Truck, Monitor, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'dispatcher' | 'driver') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-steel-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-steel-800 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-industrial-orange rounded-full mb-4 shadow-lg">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SteelTrack Logistics</h1>
          <p className="text-steel-400 text-sm mt-2">Secure Enterprise Access</p>
        </div>
        
        <div className="p-8 space-y-4">
          <button 
            onClick={() => onLogin('dispatcher')}
            className="w-full flex items-center justify-between p-4 bg-steel-50 hover:bg-steel-100 border border-steel-200 rounded-lg group transition-all"
          >
            <div className="flex items-center">
              <div className="bg-steel-200 p-3 rounded-full mr-4 group-hover:bg-steel-300 transition">
                <Monitor className="text-steel-700" size={20} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-steel-800">Dispatcher Portal</p>
                <p className="text-xs text-steel-500">Fleet management & routing</p>
              </div>
            </div>
            <span className="text-steel-400">→</span>
          </button>

          <button 
            onClick={() => onLogin('driver')}
            className="w-full flex items-center justify-between p-4 bg-steel-50 hover:bg-steel-100 border border-steel-200 rounded-lg group transition-all"
          >
            <div className="flex items-center">
              <div className="bg-industrial-orange/10 p-3 rounded-full mr-4 group-hover:bg-industrial-orange/20 transition">
                <Truck className="text-industrial-orange" size={20} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-steel-800">Driver Companion</p>
                <p className="text-xs text-steel-500">Routes & Deliveries</p>
              </div>
            </div>
            <span className="text-steel-400">→</span>
          </button>
        </div>
        
        <div className="bg-steel-50 p-4 text-center border-t border-steel-100">
          <p className="text-xs text-steel-400">System Version 2.4.0 • Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
};

export default Login;