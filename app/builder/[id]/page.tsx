import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { BuilderClient } from "./BuilderClient";

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
