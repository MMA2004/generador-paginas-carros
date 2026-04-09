export function HeroSection({ data }: { data: any }) {
  const { title, subtitle, imageUrl, ctaText } = data;

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background Image */}
      {imageUrl ? (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 to-black" />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
        {title && (
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 uppercase">
            {title}
          </h1>
        )}
        
        {subtitle && (
          <p className="mt-4 text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto font-light">
            {subtitle}
          </p>
        )}

        {ctaText && (
          <div className="mt-10">
            <button className="rounded-full bg-white text-black px-8 py-3.5 text-sm font-semibold hover:bg-zinc-200 transition-colors">
              {ctaText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
