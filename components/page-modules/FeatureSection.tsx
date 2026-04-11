export function FeatureSection({ data, template = "luxury_minimal" }: { data: any, template?: string }) {
  const { title, description, imageUrl, imagePosition = "left", bgColor, textColor, accentColor } = data || {};

  const defaultBg = template === 'classic_maserati' ? '#0a101d' : template === 'sport_dynamic' ? '#09090b' : '#ffffff';
  const defaultText = template === 'luxury_minimal' ? '#000000' : '#ffffff';

  const backgroundStyle = bgColor ? { backgroundColor: bgColor } : { backgroundColor: defaultBg };
  const resolveTextColor = textColor || defaultText;
  
  const isLeft = imagePosition === "left";

  if (template === "sport_dynamic") {
    const resolveAccent = accentColor || '#dc2626';
    const sectionStyle = {
      ...backgroundStyle,
      '--accent': resolveAccent
    } as React.CSSProperties;

    return (
      <section className="w-full relative overflow-hidden" style={sectionStyle}>
        <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} min-h-[500px]`}>
          
          {/* Image Side */}
          <div className="w-full md:w-1/2 relative bg-zinc-900 overflow-hidden">
            <div className={`absolute inset-0 bg-[var(--accent)] opacity-10 z-10 mix-blend-overlay ${isLeft ? 'translate-x-12 skew-x-12' : '-translate-x-12 -skew-x-12'}`} />
            {imageUrl ? (
              <img src={imageUrl} alt={title || "Feature"} className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <div className="w-full h-full absolute inset-0 flex items-center justify-center opacity-20">
                <span className="text-zinc-500 font-bold tracking-widest uppercase">Imagen</span>
              </div>
            )}
          </div>
          
          {/* Text Side */}
          <div className="w-full md:w-1/2 flex items-center p-12 md:p-20 relative z-20">
            <div className="max-w-md">
              <div className="w-12 h-1.5 bg-[var(--accent)] mb-6 skew-x-12" />
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-6" style={{ color: resolveTextColor }}>
                {title || "Innovación Absoluta"}
              </h2>
              <p className="text-sm font-bold uppercase tracking-widest leading-relaxed" style={{ color: resolveTextColor, opacity: 0.7 }}>
                {description || "Potencia sin restricciones. Cada elemento ha sido diseñado para desafiar los límites de la física."}
              </p>
            </div>
          </div>
          
        </div>
      </section>
    );
  }

  if (template === "classic_maserati") {
    return (
      <section className="w-full py-20" style={backgroundStyle}>
        <div className="max-w-6xl mx-auto px-6">
          <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}>
            
            <div className="w-full md:w-1/2 p-4 border border-[#1a2d52]/50">
              <div className="w-full aspect-[4/5] bg-zinc-900/50 relative overflow-hidden">
                {imageUrl && (
                  <img src={imageUrl} alt={title || "Feature"} className="w-full h-full object-cover absolute inset-0" />
                )}
              </div>
            </div>
            
            <div className="w-full md:w-1/2 py-10">
              <span className="text-xs font-serif italic mb-4 block" style={{ color: resolveTextColor, opacity: 0.6 }}>Análisis a detalle</span>
              <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight" style={{ color: resolveTextColor }}>
                {title || "Maestría Artesanal"}
              </h2>
              <div className="w-12 h-px bg-white/20 mb-8" style={textColor ? { backgroundColor: `${textColor}40` } : {}} />
              <p className="text-sm tracking-[0.1em] uppercase font-light leading-loose" style={{ color: resolveTextColor, opacity: 0.8 }}>
                {description || "Un viaje sensorial donde los materiales más finos convergen con la ingeniería óptica de mayor prestigio mundial."}
              </p>
            </div>
            
          </div>
        </div>
      </section>
    );
  }

  // luxury_minimal
  return (
    <section className="w-full" style={backgroundStyle}>
      <div className="w-full flex flex-col md:flex-row items-stretch min-h-[600px]">
        
        <div className={`w-full md:w-1/2 flex items-center justify-center p-12 md:p-24 ${isLeft ? 'order-2 md:order-1' : 'order-2'}`}>
          <div className="max-w-lg">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-8" style={{ color: resolveTextColor }}>
              {title || "Diseño que Transciende"}
            </h2>
            <p className="text-sm font-light leading-relaxed" style={{ color: resolveTextColor, opacity: 0.6 }}>
              {description || "Experimenta una interfaz de conducción que eleva tus sentidos. Cada curva dictaminada por el viento, cada superficie pensada para el clímax emocional."}
            </p>
          </div>
        </div>
        
        <div className={`w-full md:w-1/2 bg-zinc-100 relative ${isLeft ? 'order-1 md:order-2' : 'order-1'}`}>
          {imageUrl && (
            <img src={imageUrl} alt={title || "Feature"} className="w-full h-full object-cover absolute inset-0" />
          )}
        </div>
        
      </div>
    </section>
  );
}
