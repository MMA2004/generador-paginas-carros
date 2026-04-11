import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";
import { notFound } from "next/navigation";
import { ModuleRenderer } from "@/components/page-modules/ModuleRenderer";
import { clerkClient } from "@clerk/nextjs/server";
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ marca: string, idpagina: string }> }): Promise<Metadata> {
  const { marca, idpagina } = await params;
  
  await dbConnect();
  
  const page = await Page.findOne({ 
    brand: marca, 
    slug: idpagina,
    published: true
  }).lean();

  if (!page) {
    return {
      title: "No encontrado",
    }
  }

  // Find the first block that is a hero to extract title if needed, otherwise use page title
  const heroBlock = page.blocks.find((b: any) => b.type === "HeroSection");
  const metaTitle = heroBlock?.data?.title || page.title;
  const metaDescription = heroBlock?.data?.subtitle || `Página oficial interactiva de ${marca}`;

  return {
    title: `${metaTitle} | ${marca.toUpperCase()}`,
    description: metaDescription,
  }
}

export default async function PublicDynamicPage({ params }: { params: Promise<{ marca: string, idpagina: string }> }) {
  const { marca, idpagina } = await params;
  
  await dbConnect();
  
  const page = await Page.findOne({ 
    brand: marca, 
    slug: idpagina,
    published: true
  }).lean();

  if (!page) {
    notFound();
  }

  // --- ESCUDO PUBLICO DE CUARENTENA ---
  let isOverage = false;
  try {
    const client = await clerkClient();
    const owner = await client.users.getUser(page.userId);
    const role = owner.publicMetadata.role as string || "user";
    const quota = (owner.publicMetadata.pageQuota as number) || 0;
    
    if (role !== "admin") {
       const existingPagesCount = await Page.countDocuments({ userId: page.userId });
       if (existingPagesCount > quota) {
          isOverage = true;
       }
    }
  } catch (err) {
    console.error("Error verificando cuota publica", err);
  }

  if (isOverage) {
    notFound(); // Tumbamos la página si está en mora (afuera del try-catch)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white w-full overflow-x-hidden m-0 p-0 flex flex-col">
      <div className="flex-1">
        <ModuleRenderer blocks={page.blocks} template={page.template} />
      </div>

      {/* Marca de agua global - GIBRA */}
      <footer className="w-full py-8 text-center bg-[#09090b] border-t border-white/5 relative z-50">
        <p className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-600 cursor-default select-none">
          Powered by <span className="text-zinc-300">GIBRA</span>
        </p>
      </footer>
    </div>
  );
}
