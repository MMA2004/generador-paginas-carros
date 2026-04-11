export function HeroSection({ data, template = "luxury_minimal" }: { data: any, template?: string }) {
  const { title, subtitle, imageUrl, ctaText, bgColor, textColor } = data || {};

  const hasImage = !!imageUrl;
  
  // Default Colors based on Template
  const defaultBg = template === 'classic_maserati' ? '#0a101d' : template === 'sport_dynamic' ? '#000000' : '#ffffff';
  const defaultText = template === 'luxury_minimal' && !hasImage ? '#000000' : '#ffffff';

  const backgroundStyle = bgColor ? { backgroundColor: bgColor } : { backgroundColor: defaultBg };
  const resolveTextColor = textColor || defaultText;
  if (template === "sport_dynamic") {
    return (
      <section 
        className="relative w-full h-[80vh] min-h-[600px] flex items-end justify-start overflow-hidden pt-20 pb-24 px-8 md:px-16"
        style={backgroundStyle}
      >
        {imageUrl ? (
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105" style={{ backgroundImage: `url(${imageUrl})` }} />
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-tr ${!bgColor ? 'from-black via-zinc-900 to-black' : ''}`} style={backgroundStyle} />
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-red-600/20 blur-3xl rounded-full" />
            <div className="absolute top-1/2 -left-20 w-[120%] h-32 bg-red-600/10 -skew-y-6" />
          </>
        )}
        
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start text-left">
          {title && (
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter mb-2 uppercase"
              style={{ color: resolveTextColor }}
            >
              {title}
            </h1>
          )}
          
          {subtitle && (
            <div className="flex items-center mt-2 gap-4">
              <div className="w-12 h-1.5 bg-red-600" />
              <p 
                className="text-lg md:text-2xl font-bold tracking-widest uppercase"
                style={{ color: resolveTextColor, opacity: 0.9 }}
              >
                {subtitle}
              </p>
            </div>
          )}

          {ctaText && (
            <div className="mt-10">
              <button 
                className="rounded-none px-10 py-4 text-sm font-black uppercase tracking-widest border-2 transition-all hover:bg-white hover:text-black hover:border-white"
                style={{
                  backgroundColor: textColor ? "transparent" : "rgba(255,0,0,0.8)",
                  borderColor: resolveTextColor,
                  color: resolveTextColor
                }}
              >
                {ctaText}
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (template === "classic_maserati") {
    return (
      <section 
        className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden border-b-8 border-[#1a2d52]/30"
        style={backgroundStyle}
      >
        {imageUrl ? (
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${imageUrl})` }} />
        ) : (
           <div className={`absolute inset-0 bg-gradient-to-b ${!bgColor ? 'from-[#0b1221] to-[#070b14]' : ''}`} style={backgroundStyle} />
        )}
        
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-12">
          {title && (
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-normal mb-8"
              style={{ color: resolveTextColor }}
            >
              {title}
            </h1>
          )}
          
          {subtitle && (
            <p 
              className="mt-6 text-sm md:text-md uppercase tracking-[0.3em] font-light max-w-2xl mx-auto"
              style={{ color: resolveTextColor, opacity: 0.8 }}
            >
              {subtitle}
            </p>
          )}

          {ctaText && (
            <div className="mt-12">
               <div className="w-px h-12 bg-white/20 mx-auto mb-6" style={textColor ? { backgroundColor: `${textColor}40` } : {}} />
               <button 
                className="px-12 py-3 text-xs font-medium tracking-[0.2em] uppercase border transition-colors hover:bg-white/10"
                style={{
                  borderColor: resolveTextColor,
                  color: resolveTextColor
                }}
              >
                {ctaText}
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // luxury_minimal
  return (
    <section 
      className={`relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden`}
      style={backgroundStyle}
    >
      {/* Background Image */}
      {imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      
      {/* Overlay solo si hay imagen */}
      {hasImage && <div className="absolute inset-0 bg-black/30" />}

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {title && (
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8"
            style={{ color: resolveTextColor }}
          >
            {title}
          </h1>
        )}
        
        {subtitle && (
          <p 
            className="mt-4 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto"
            style={{ color: resolveTextColor, opacity: 0.6 }}
          >
            {subtitle}
          </p>
        )}

        {ctaText && (
          <div className="mt-12">
            <button 
              className="rounded-full px-8 py-3.5 text-[11px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
              style={{
                backgroundColor: resolveTextColor,
                color: backgroundStyle.backgroundColor
              }}
            >
              {ctaText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
