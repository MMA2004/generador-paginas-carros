import { DynamicIcon } from "@/components/ui/icon-picker";

export function SpecsSection({ data, template = "luxury_minimal" }: { data: any, template?: string }) {
  const specs: { label: string; value: string; icon?: string }[] = data?.specs || [];
  const { bgColor, textColor } = data || {};
  
  const defaultBg = template === 'classic_maserati' ? '#0a101d' : template === 'sport_dynamic' ? '#000000' : '#f9fafb';
  const defaultText = template === 'luxury_minimal' ? '#000000' : '#ffffff';

  const backgroundStyle = bgColor ? { backgroundColor: bgColor } : { backgroundColor: defaultBg };
  const resolveTextColor = textColor || defaultText;

  if (specs.length === 0) {
    return (
      <div 
        className="w-full py-20 flex flex-col items-center justify-center border-y border-zinc-200/10"
        style={backgroundStyle}
      >
        <h3 className="font-medium tracking-widest text-sm uppercase opacity-50" style={{ color: resolveTextColor }}>Especificaciones Técnicas</h3>
      </div>
    );
  }

  if (template === "sport_dynamic") {
    return (
      <section className="w-full py-12 px-4" style={backgroundStyle}>
        <div className="max-w-7xl mx-auto border border-zinc-800 bg-zinc-950 p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 justify-between shadow-2xl">
          <div className="md:w-1/4 shrink-0 border-l-4 border-red-600 pl-4">
            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase" style={{ color: resolveTextColor }}>
              {data.title || "Datos Técnicos"}
            </h2>
            <p className="text-xs uppercase tracking-widest mt-2" style={{ color: resolveTextColor, opacity: 0.5 }}>
              {data.description || "Rendimiento extremo"}
            </p>
          </div>
          
          <div className="flex-1 flex flex-wrap gap-x-12 gap-y-8 justify-center md:justify-end">
            {specs.map((spec, i) => (
              <div key={i} className="flex flex-col items-center text-center w-24">
                <DynamicIcon name={spec.icon || "Asterisk"} className="w-6 h-6 mb-2 text-red-500" />
                <span className="text-2xl font-bold tracking-tighter" style={{ color: resolveTextColor }}>{spec.value}</span>
                <span className="text-[9px] uppercase tracking-widest mt-1 font-bold" style={{ color: resolveTextColor, opacity: 0.6 }}>{spec.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (template === "classic_maserati") {
    return (
      <section className="w-full py-20" style={backgroundStyle}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif mb-4" style={{ color: resolveTextColor }}>
              {data.title || "Especificaciones de Ingeniería"}
            </h2>
            <div className="w-16 h-px bg-white/20 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specs.map((spec, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-8 bg-[#0d162a]/50 text-center transition-colors hover:bg-[#111e38]">
                <DynamicIcon name={spec.icon || "Asterisk"} className="w-5 h-5 mb-4 text-[#8a9dbf]" />
                <span className="text-[10px] uppercase tracking-[0.2em] mb-2 font-semibold" style={{ color: resolveTextColor, opacity: 0.8 }}>{spec.label}</span>
                <span className="text-xl font-light font-serif" style={{ color: resolveTextColor }}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // luxury_minimal
  return (
    <section className="w-full py-24" style={backgroundStyle}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          <div className="md:w-1/3 shrink-0">
            <h2 className="text-3xl font-light tracking-tight mb-4" style={{ color: resolveTextColor }}>
              {data.title || "Especificaciones"}
            </h2>
            <p className="text-sm font-light leading-relaxed" style={{ color: resolveTextColor, opacity: 0.6 }}>
              {data.description || "Descubre los detalles técnicos y capacidades que destacan el poder de este vehículo."}
            </p>
          </div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
            {specs.map((spec, i) => (
              <div key={i} className="flex flex-col gap-2 pb-4 border-b border-black/5">
                <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: resolveTextColor, opacity: 0.5 }}>
                  {spec.label}
                </span>
                <div className="flex items-center gap-3">
                  <DynamicIcon name={spec.icon || "Asterisk"} className="w-4 h-4 opacity-40" style={{ color: resolveTextColor }} />
                  <span className="text-xl font-medium" style={{ color: resolveTextColor }}>
                    {spec.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
