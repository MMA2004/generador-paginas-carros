import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, brand, slug } = body;

    if (!title || !brand || !slug) {
       return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    await dbConnect();

    // --- Verificación de Quota Financiera ---
    const user = await currentUser();
    const role = user?.publicMetadata?.role as string;
    const quota = (user?.publicMetadata?.pageQuota as number) || 0;
    
    if (role !== "admin") {
       const existingPagesCount = await Page.countDocuments({ userId });
       if (existingPagesCount >= quota) {
          return NextResponse.json({ error: `Límite de páginas agotado (${existingPagesCount}/${quota}). Contacta soporte para ampliar tu plan.` }, { status: 402 });
       }
    }

    // Check if brand/slug already exists
    const existing = await Page.findOne({ brand, slug });
    if (existing) {
       return NextResponse.json({ error: "La URL para esta marca ya existe." }, { status: 400 });
    }

    const page = await Page.create({
      userId,
      title,
      brand,
      slug,
      published: true, // Auto publish for testing
      blocks: [],
    });

    return NextResponse.json({ success: true, pageId: page._id });
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
