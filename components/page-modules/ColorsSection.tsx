export function ColorsSection({ data, template = "luxury_minimal" }: { data: any, template?: string }) {
  const colors: { label: string; hexCode: string }[] = data?.colors || [];
  const { title, description, bgColor, textColor } = data || {};

  const defaultBg = template === 'classic_maserati' ? '#0a101d' : template === 'sport_dynamic' ? '#000000' : '#f9fafb';
  const defaultText = template === 'luxury_minimal' ? '#000000' : '#ffffff';

  const backgroundStyle = bgColor ? { backgroundColor: bgColor } : { backgroundColor: defaultBg };
  const resolveTextColor = textColor || defaultText;

  if (colors.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center border-y border-zinc-200/5" style={backgroundStyle}>
        <h3 className="font-medium tracking-widest text-sm uppercase opacity-50" style={{ color: resolveTextColor }}>Paleta de Colores</h3>
        <p className="text-xs mt-2 opacity-60" style={{ color: resolveTextColor }}>Añade colores para que se dibujen las muestras.</p>
      </div>
    );
  }

  if (template === "sport_dynamic") {
    return (
      <section className="w-full py-16 px-6" style={backgroundStyle}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3 shrink-0 text-center md:text-left">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2" style={{ color: resolveTextColor }}>
              {title || "Gama de Pintura"}
            </h2>
            <div className="w-12 h-1 bg-red-600 mx-auto md:mx-0 mb-4" />
            <p className="text-sm tracking-widest uppercase font-bold" style={{ color: resolveTextColor, opacity: 0.6 }}>
              {description || "Cobertura de alto octanaje."}
            </p>
          </div>
          
          <div className="flex-1 flex flex-wrap justify-center gap-6 md:gap-10">
            {colors.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-28 group">
                <div className="w-16 h-16 rounded-full border-4 border-zinc-800 p-1 bg-zinc-950 transition-transform group-hover:scale-110">
                  <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: color.hexCode }} />
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest text-center" style={{ color: resolveTextColor, opacity: 0.8 }}>
                  {color.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (template === "classic_maserati") {
    return (
      <section className="w-full py-24" style={backgroundStyle}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif mb-4" style={{ color: resolveTextColor }}>
              {title || "Selección de Acabados"}
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase font-light" style={{ color: resolveTextColor, opacity: 0.6 }}>
              {description || "Personalidad en cada tono."}
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {colors.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group">
                <div className="w-12 h-20 shadow-xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2" style={{ backgroundColor: color.hexCode, boxShadow: `0 10px 20px -5px ${color.hexCode}40` }}>
                   <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
                </div>
                <span className="text-xs font-serif italic text-center" style={{ color: resolveTextColor, opacity: 0.8 }}>
                  {color.label}
                </span>
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
      <div className="max-w-6xl mx-auto px-6 text-center shadow-sm">
        <h2 className="text-xl font-light tracking-widest uppercase mb-12" style={{ color: resolveTextColor }}>
          {title || "Colores Disponibles"}
        </h2>
        
        <div className="flex flex-wrap justify-center gap-12 md:gap-16">
          {colors.map((color, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 skew-y-3 shadow-lg transition-transform hover:skew-y-0" style={{ backgroundColor: color.hexCode }} />
              <span className="text-[10px] uppercase font-semibold tracking-widest" style={{ color: resolveTextColor, opacity: 0.5 }}>
                {color.label}
              </span>
            </div>
          ))}
        </div>
        
        {description && (
          <p className="mt-16 text-xs font-light max-w-md mx-auto" style={{ color: resolveTextColor, opacity: 0.4 }}>
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
