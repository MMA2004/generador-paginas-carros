export function PricingSection({ data, template = "luxury_minimal" }: { data: any, template?: string }) {
  const { title, description, price, disclaimer, bgColor, textColor, accentColor } = data || {};

  const defaultBg = template === 'classic_maserati' ? '#0a101d' : template === 'sport_dynamic' ? '#09090b' : '#ffffff';
  const defaultText = template === 'luxury_minimal' ? '#000000' : '#ffffff';

  const backgroundStyle = bgColor ? { backgroundColor: bgColor } : { backgroundColor: defaultBg };
  const resolveTextColor = textColor || defaultText;

  if (template === "sport_dynamic") {
    const resolveAccent = accentColor || '#dc2626';
    const sectionStyle = {
      ...backgroundStyle,
      '--accent': resolveAccent
    } as React.CSSProperties;

    return (
      <section className="w-full py-20 px-6 border-t-[16px] border-black" style={sectionStyle}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between p-8 bg-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--accent)] to-transparent" />
          
          <div className="md:w-1/2 text-left z-10 space-y-2">
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase" style={{ color: resolveTextColor }}>
              {title || "Configuración Base"}
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: resolveTextColor, opacity: 0.6 }}>
              {description || "Precio base no incluye IVA ni equipamiento."}
            </p>
          </div>
          
          <div className="md:w-1/2 z-10 flex flex-col items-center md:items-end mt-8 md:mt-0">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-[var(--accent)] text-white px-3 py-1 mb-2">Precio Inicial</span>
            <div className="text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter" style={{ color: resolveTextColor }}>
              {price || "$ 150,000"}
            </div>
            {disclaimer && (
              <span className="text-[9px] uppercase tracking-widest mt-4 text-right" style={{ color: resolveTextColor, opacity: 0.5 }}>
                {disclaimer}
              </span>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (template === "classic_maserati") {
    return (
      <section className="w-full py-28" style={backgroundStyle}>
        <div className="max-w-3xl mx-auto text-center px-6">
          <div className="w-8 h-px bg-white/20 mx-auto mb-8" style={textColor ? { backgroundColor: `${textColor}40` } : {}} />
          <h2 className="text-3xl font-serif mb-6" style={{ color: resolveTextColor }}>
            {title || "Valoración Oficial"}
          </h2>
          <p className="text-sm tracking-[0.2em] uppercase font-light mb-12" style={{ color: resolveTextColor, opacity: 0.8 }}>
            {description || "Adquiere el arte del automovilismo."}
          </p>
          
          <div className="py-12 border-y border-[#1a2d52]/50">
            <span className="text-sm font-serif italic mb-2 block" style={{ color: resolveTextColor, opacity: 0.7 }}>A partir de</span>
            <div className="text-5xl md:text-6xl font-serif font-light" style={{ color: resolveTextColor }}>
              {price || "$ 150,000 USD"}
            </div>
          </div>
          
          {disclaimer && (
            <p className="mt-8 text-xs font-light max-w-lg mx-auto" style={{ color: resolveTextColor, opacity: 0.5 }}>
              * {disclaimer}
            </p>
          )}
        </div>
      </section>
    );
  }

  // luxury_minimal
  return (
    <section className="w-full py-32" style={backgroundStyle}>
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase mb-4" style={{ color: resolveTextColor }}>
          {title || "Sumario de Costos"}
        </h2>
        <p className="text-sm font-light mb-16" style={{ color: resolveTextColor, opacity: 0.6 }}>
          {description || "Valores sugeridos por el fabricante."}
        </p>

        <div className="text-6xl md:text-8xl font-light tracking-tighter" style={{ color: resolveTextColor }}>
          {price || "$ 150,000"}
        </div>
        
        {disclaimer && (
          <p className="mt-12 text-xs font-light tracking-wide uppercase" style={{ color: resolveTextColor, opacity: 0.4 }}>
            {disclaimer}
          </p>
        )}
      </div>
    </section>
  );
}
