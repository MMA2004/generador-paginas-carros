import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";
import { notFound } from "next/navigation";
import { ModuleRenderer } from "@/components/page-modules/ModuleRenderer";
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white w-full overflow-x-hidden m-0 p-0">
      <ModuleRenderer blocks={page.blocks} template={page.template} />
    </div>
  );
}
