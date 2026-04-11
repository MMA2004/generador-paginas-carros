import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { blocks, template } = body;

    await dbConnect();

    const page = await Page.findOneAndUpdate(
      { _id: id, userId },
      { blocks, template },
      { returnDocument: 'after' }
    );

    if (!page) {
      return NextResponse.json({ error: "Página no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error("Error saving page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { published } = body;

    await dbConnect();

    const page = await Page.findOneAndUpdate(
      { _id: id, userId },
      { published },
      { returnDocument: 'after' }
    );

    if (!page) {
      return NextResponse.json({ error: "Página no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error("Error toggling publish:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await dbConnect();

    const page = await Page.findOneAndDelete({ _id: id, userId });

    if (!page) {
      return NextResponse.json({ error: "Página no encontrada" }, { status: 404 });
    }

    // Nota arquitectónica: Si se necesitaran limpiar las imágenes de Firebase 
    // se iteraría sobre 'page.blocks' extrayendo todas las URLs de imágenes y llamando un bucket-delete.
    // De momento se borra lógicamente de Mongo.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
