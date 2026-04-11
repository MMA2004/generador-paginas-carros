import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";
import { notFound, redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { BuilderClient } from "./BuilderClient";
import Link from "next/link";
import { AlertOctagon, ArrowLeft } from "lucide-react";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    return <div>No autenticado</div>;
  }

  await dbConnect();
  
  let page = null;
  try {
    page = await Page.findOne({ _id: id, userId }).lean();
  } catch (error) {
    console.error("Invalid Mongo ID", error);
  }

  if (!page) {
    notFound();
  }

  // --- ESCUDO ANTI-OVERAGE ---
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata.role as string || "user";
  const quota = (user.publicMetadata.pageQuota as number) || 0;
  
  if (role !== "admin") {
     const existingPagesCount = await Page.countDocuments({ userId });
     const overage = Math.max(0, existingPagesCount - quota);
     if (overage > 0) {
        return (
          <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent blur-sm" />
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-red-800/20 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="z-10 bg-red-950/30 border border-red-900/50 p-10 rounded-3xl max-w-lg backdrop-blur-md">
               <div className="flex justify-center mb-6 text-red-500">
                  <AlertOctagon size={64} />
               </div>
               <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white mb-2">Cuarentena de Sistema</h1>
               <p className="text-red-400 font-bold uppercase tracking-widest text-[10px] mb-8">Nivel de Almacenamiento Crítico</p>
               
               <p className="text-zinc-400 text-xs tracking-wider uppercase leading-loose mb-8">
                 Este vehículo ha sido inmovilizado. Debes destruir al menos <strong className="text-white">{overage} páginas</strong> de tu garaje para liberar espacio y recuperar el control del sistema de diseño.
               </p>
               
               <Link 
                  href="/dashboard"
                  className="flex justify-center items-center gap-3 w-full bg-red-600 hover:bg-red-500 transition-colors text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs"
               >
                 <ArrowLeft size={16} /> Retornar al Dashboard
               </Link>
            </div>
          </div>
        )
     }
  }

  // Pass JSON serializable data down to the builder format
  const initialData = {
    _id: page._id.toString(),
    title: page.title,
    brand: page.brand,
    slug: page.slug,
    blocks: page.blocks,
    template: page.template,
    published: page.published
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-white">
      <BuilderClient initialData={initialData} />
    </div>
  );
}
