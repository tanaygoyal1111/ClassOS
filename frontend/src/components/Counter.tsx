import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface CounterProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  disabled?: boolean;
}

export const Counter = ({ value, onChange, min = 1, disabled = false }: CounterProps) => {
  return (
    <div className={`flex items-center justify-between border rounded-full px-2 py-1.5 w-[90px] transition-colors ${disabled ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-white border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'}`}>
      <button 
        onClick={() => !disabled && onChange(Math.max(min, value - 1))}
        disabled={disabled}
        className={`w-6 h-6 flex items-center justify-center transition-colors ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-900'}`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className={`text-sm font-bold ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>{value}</span>
      <button 
        onClick={() => !disabled && onChange(value + 1)}
        disabled={disabled}
        className={`w-6 h-6 flex items-center justify-center transition-colors ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-900'}`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
