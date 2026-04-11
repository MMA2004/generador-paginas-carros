"use client";

import React, { useState } from "react";
import { 
  Gauge, 
  Fuel, 
  Zap, 
  Settings, 
  Activity, 
  Car, 
  Shield, 
  Wind, 
  Maximize, 
  Target,
  BatteryCharging,
  Info,
  Asterisk,
  Thermometer,
  Wrench,
  Clock,
  Compass,
  MapPin,
  Flame,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Diccionario de Lucide
export const vehicleIconsMap: Record<string, React.FC<any>> = {
  Asterisk,
  Gauge,
  Fuel,
  Zap,
  Settings,
  Activity,
  Car,
  Shield,
  Wind,
  Maximize,
  Target,
  BatteryCharging,
  Info,
  Thermometer,
  Wrench,
  Clock,
  Compass,
  MapPin,
  Flame,
  Award
};

export const vehicleIconNames = Object.keys(vehicleIconsMap);

// 2. Componente que invoca dinámicamente un icono
export function DynamicIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const IconComponent = vehicleIconsMap[name] || vehicleIconsMap["Asterisk"];
  return <IconComponent className={className} style={style} />;
}

// 3. UI Component Selector (mini popover/dropdown visual)
interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:border-zinc-500 transition-colors"
        title="Seleccionar Ícono"
      >
        <DynamicIcon name={value} className="w-4 h-4 text-emerald-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
           <div className="bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl p-6 w-96 max-w-[90vw] animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
             <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-widest text-center">Seleccionar Ícono</h4>
             
             <div className="grid grid-cols-5 gap-2">
               {vehicleIconNames.map(iconName => (
                 <button
                   key={iconName}
                   onClick={() => {
                     onChange(iconName);
                     setIsOpen(false);
                   }}
                   className={cn(
                     "p-3 flex flex-col items-center justify-center gap-1 rounded-lg hover:bg-emerald-500/20 hover:text-emerald-400 transition-all hover:scale-105",
                     value === iconName ? "bg-emerald-500/30 text-emerald-400 ring-1 ring-emerald-500" : "text-zinc-400 bg-black/40"
                   )}
                   title={iconName}
                 >
                    <DynamicIcon name={iconName} className="w-5 h-5" />
                 </button>
               ))}
             </div>
             
             <div className="mt-6 flex justify-center">
               <button 
                 onClick={() => setIsOpen(false)} 
                 className="px-6 py-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg font-semibold transition-colors"
               >
                 Cancelar
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
