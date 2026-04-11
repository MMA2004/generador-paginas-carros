import { type IPageBlock } from "@/models/Page";

export function GallerySection({ data, template = "luxury_minimal" }: { data: any, template?: string }) {
  const images: string[] = data?.images || [];
  const { bgColor, textColor } = data || {};

  const defaultBg = template === 'classic_maserati' ? '#0a101d' : template === 'sport_dynamic' ? '#09090b' : '#ffffff';
  const defaultText = template === 'luxury_minimal' ? '#000000' : '#ffffff';

  const backgroundStyle = bgColor ? { backgroundColor: bgColor } : { backgroundColor: defaultBg };
  const resolveTextColor = textColor || defaultText;

  if (images.length === 0) {
    return (
      <div 
        className="w-full py-20 flex flex-col items-center justify-center border-y border-zinc-200/10"
        style={backgroundStyle}
      >
        <h3 className="font-medium tracking-widest text-sm uppercase opacity-50" style={{ color: resolveTextColor }}>Galería Vacía</h3>
        <p className="text-xs mt-2 opacity-60" style={{ color: resolveTextColor }}>Añade fotos desde las propiedades</p>
      </div>
    );
  }

  // SPORT DYNAMIC
  if (template === "sport_dynamic") {
    return (
      <section className="w-full py-16" style={backgroundStyle}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-red-600 skew-x-12" />
            <h2 className="text-3xl font-black italic tracking-tighter uppercase" style={{ color: resolveTextColor }}>
              {data.title || "Galería"}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4 mt-6 md:mt-12">
            {images.map((img, i) => {
              // Patrón Mosaico Dinámico (solo útil en Desktop)
              let spanClass = "col-span-1 row-span-1";
              if (i === 0) spanClass = "md:col-span-2 md:row-span-2";
              else if (i === 3) spanClass = "md:col-span-2 md:row-span-1";
              else if (i === 4) spanClass = "md:col-span-4 md:row-span-2";
              
              return (
                <div 
                  key={i} 
                  className={`relative overflow-hidden group w-full aspect-[4/3] md:aspect-auto ${spanClass} bg-zinc-900 border border-zinc-800/50`}
                >
                  <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  
                  {/* Lock-on Corners overlay */}
                  <div className="absolute inset-x-8 inset-y-8 border border-white/0 group-hover:border-white/10 transition-colors pointer-events-none z-10 hidden md:block" />
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-red-600/0 group-hover:border-red-600 transition-colors z-20" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-600/0 group-hover:border-red-600 transition-colors z-20" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 bg-red-900/0 transition-colors group-hover:bg-red-900/20 mix-blend-overlay" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // CLASSIC MASERATI
  if (template === "classic_maserati") {
    return (
      <section className="w-full py-20 border-b border-zinc-800/20" style={backgroundStyle}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-serif text-center mb-16" style={{ color: resolveTextColor }}>
            {data.title || "Una experiencia irrepetible"}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 px-4 md:px-0">
            {images.map((img, i) => (
              <div key={i} className="relative w-full aspect-[4/5] overflow-hidden group">
                <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                
                {/* Cuadro de Arte */}
                <div className="absolute inset-0 border-[10px] border-[#0a101d]/20 transition-all duration-700 group-hover:border-[0px]" />
                
                {/* Tinte Elegante Azul Marino */}
                <div className="absolute inset-0 bg-[#070e1c]/40 group-hover:bg-transparent transition-colors duration-700" />
                
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                  <div className="w-8 h-px bg-white mb-2" />
                  <span className="text-[10px] font-serif uppercase tracking-[0.3em] text-white">Fotografía {i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // LUXURY MINIMAL
  return (
    <section className="w-full py-24" style={backgroundStyle}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-light tracking-widest uppercase text-center mb-16" style={{ color: resolveTextColor }}>
          {data.title || "Galería Visual"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {images.map((img: string, i: number) => (
             <div key={i} className="relative aspect-square overflow-hidden bg-zinc-50 group">
               <img 
                 src={img} 
                 alt="Gallery" 
                 className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
               />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
