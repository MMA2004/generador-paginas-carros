import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col justify-center items-center">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]" />

      <main className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm mx-auto">
          <Sparkles className="h-4 w-4 text-zinc-400" />
          <span className="text-sm text-zinc-300">Generador de Páginas Premium</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
          Crea páginas de vehículos <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">excepcionales</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          Diseña, personaliza y publica sitios interactivos web para tus marcas sin escribir código.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/sign-up" 
            className="group relative flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium transition-all hover:scale-105"
          >
            Comenzar Gratis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            href="/sign-in" 
            className="flex items-center gap-2 px-8 py-4 rounded-full font-medium text-white border border-white/20 hover:bg-white/5 transition-all"
          >
            Iniciar Sesión
          </Link>
        </div>
      </main>
    </div>
  );
}
