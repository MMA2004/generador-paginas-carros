import { Navbar } from "@/components/Navbar";
import { Plus, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  // Fetch user's pages
  await dbConnect();
  const pages = userId ? await Page.find({ userId }).sort({ updatedAt: -1 }).lean() : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tus Páginas</h1>
            <p className="text-zinc-400 mt-1">Gestiona los sitios de vehículos que has creado.</p>
          </div>
          
          <Link 
            href="/dashboard/new"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:bg-zinc-200"
          >
            <Plus size={16} />
            Crear Página
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/50 py-32 text-center backdrop-blur-sm">
            <div className="flex justify-center items-center h-16 w-16 mb-4 rounded-full bg-zinc-800">
              <FileText className="text-zinc-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tienes páginas aún</h3>
            <p className="text-zinc-400 max-w-sm mb-6">Comienza creando tu primera página interactiva para mostrar un vehículo con estilo.</p>
            <Link 
              href="/dashboard/new"
              className="rounded-full border border-white/20 bg-white/5 py-2 px-6 hover:bg-white/10 transition-colors"
            >
              Comenzar Ahora
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page: any) => (
              <div 
                key={page._id.toString()} 
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div className="rounded-full px-3 py-1 text-xs font-medium bg-zinc-800 text-zinc-300">
                    {page.brand}
                  </div>
                  <div className="flex gap-2">
                    {page.published ? (
                      <span className="flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-emerald-400 bg-emerald-400/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Publicado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-amber-400 bg-amber-400/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Borrador
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="relative z-10 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">{page.title}</h3>
                  <p className="text-sm text-zinc-400 flex items-center gap-1">
                    /{page.brand}/{page.slug}
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center gap-3">
                  <Link 
                    href={`/builder/${page._id}`}
                    className="flex-1 text-center rounded-lg bg-white py-2 text-sm font-semibold text-black hover:bg-zinc-200 transition-colors"
                  >
                    Editar
                  </Link>
                  <Link 
                    href={`/${page.brand}/${page.slug}`}
                    target="_blank"
                    className="flex justify-center items-center rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                  >
                    <ExternalLink size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
