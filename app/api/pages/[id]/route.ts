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
    const { blocks } = body;

    await dbConnect();

    const page = await Page.findOneAndUpdate(
      { _id: id, userId },
      { blocks },
      { new: true }
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
