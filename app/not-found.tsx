import Link from 'next/link';
import { NavigationOff, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
      {/* Fondo inmersivo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
        <span className="text-[40vw] font-black italic tracking-tighter">404</span>
      </div>
      
      {/* Luces y Grid decorativo */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent blur-sm" />
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-red-800/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center max-w-md">
        <div className="w-20 h-20 mb-8 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center relative shadow-2xl">
          <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full" />
          <NavigationOff className="text-zinc-500 relative z-10" size={32} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4">
          Fuera de Ruta
        </h1>
        
        <div className="w-12 h-1 bg-red-600 mb-6 skew-x-12" />

        <p className="text-zinc-500 text-xs md:text-sm leading-loose tracking-widest uppercase font-bold mb-10">
          El vehículo que buscas no figura en los registros.
          <br/>
          Es posible que el enlace esté dañado o haya sido sacado de circulación.
        </p>

      </div>
    </div>
  );
}
