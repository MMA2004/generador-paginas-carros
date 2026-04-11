export function VideoSection({ data, template = "luxury_minimal" }: { data: any, template?: string }) {
  const { title, videoUrl, bgColor, textColor } = data || {};

  const defaultBg = template === 'classic_maserati' ? '#0a101d' : template === 'sport_dynamic' ? '#000000' : '#ffffff';
  const defaultText = template === 'luxury_minimal' ? '#000000' : '#ffffff';

  const backgroundStyle = bgColor ? { backgroundColor: bgColor } : { backgroundColor: defaultBg };
  const resolveTextColor = textColor || defaultText;

  // Extract YouTube ID if valid
  let embedUrl = videoUrl;
  if (videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'))) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    if (match && match[2].length === 11) {
      embedUrl = `https://www.youtube.com/embed/${match[2]}?autoplay=0&mute=1&controls=1&loop=1`;
    }
  }

  const VideoIframe = () => {
    if (!embedUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800">
          <span className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Video No Disponible</span>
        </div>
      );
    }
    
    if (embedUrl.includes('youtube') || embedUrl.includes('vimeo')) {
      return <iframe src={embedUrl} className="w-full h-full object-cover" allowFullScreen />;
    }
    
    // Fallback normal video player
    return <video src={embedUrl} className="w-full h-full object-cover" controls muted playsInline />;
  };

  if (template === "sport_dynamic") {
    return (
      <section className="w-full px-4 py-20" style={backgroundStyle}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase" style={{ color: resolveTextColor }}>
              {title || "En Movimiento"}
            </h2>
            <div className="hidden md:block w-32 h-1.5 bg-red-600 skew-x-12" />
          </div>
          
          <div className="w-full aspect-video p-2 md:p-4 bg-zinc-950 border border-zinc-800 shadow-2xl relative">
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-red-600" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-red-600" />
            <VideoIframe />
          </div>
        </div>
      </section>
    );
  }

  if (template === "classic_maserati") {
    return (
      <section className="w-full py-24 bg-black relative" style={backgroundStyle}>
         {/* Letterbox Cinema Effect */}
        <div className="w-full aspect-[21/9] max-w-full mx-auto bg-black relative overflow-hidden flex items-center justify-center border-y border-[#1a2d52]/30">
          <div className="absolute inset-x-0 top-0 h-10 bg-black z-20 shadow-lg" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-black z-20 shadow-lg flex items-center justify-center">
            {title && (
               <span className="text-[10px] font-serif uppercase tracking-[0.3em] text-[#8a9dbf] opacity-80">{title}</span>
            )}
          </div>
          
          <div className="w-full h-full relative z-10">
            <VideoIframe />
          </div>
        </div>
      </section>
    );
  }

  // luxury_minimal
  return (
    <section className="w-full relative h-[70vh] min-h-[500px]" style={backgroundStyle}>
      <div className="absolute inset-0">
        <VideoIframe />
      </div>
      
      {title && (
        <div className="absolute bottom-12 inset-x-0 z-20 flex justify-center pointer-events-none">
          <div className="px-8 py-3 bg-white/90 backdrop-blur shadow-2xl rounded-full pointer-events-auto">
            <span className="text-xs uppercase font-semibold tracking-widest text-black">
              {title}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
