import { Navbar } from "@/components/Navbar";
import { Plus, FileText, ExternalLink, Lock } from "lucide-react";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { PageActions } from "@/components/dashboard/PageActions";

export default async function DashboardPage() {
  const { userId } = await auth();

  // -- AUTO-PROMOCIÓN DE GIBRA A ADMIN --
  if (userId) {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    if (email === "gibra.company@gmail.com" && user?.publicMetadata?.role !== "admin") {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, { publicMetadata: { role: "admin", pageQuota: 9999 } });
    }
  }

  // Fetch user's pages
  await dbConnect();
  const pages = userId ? await Page.find({ userId }).sort({ updatedAt: -1 }).lean() : [];

  // Lógica de Límite y Overage
  let role = "user";
  let quota = 0;
  if (userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    role = user.publicMetadata.role as string || "user";
    quota = (user.publicMetadata.pageQuota as number) || 0;
  }

  const overage = role !== "admin" ? Math.max(0, pages.length - quota) : 0;
  const isCapped = role !== "admin" && pages.length >= quota;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tus Páginas</h1>
            <p className="text-zinc-400 mt-1">Gestiona los sitios de vehículos que has creado.</p>
          </div>
          <div className="flex gap-4">
            {isCapped && overage === 0 && (
              <div className="hidden sm:flex items-center text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-4 rounded-full border border-amber-500/20">
                Límite de Tu Plan Alcanzado
              </div>
            )}
            {!isCapped && (
              <Link
                href="/dashboard/new"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:bg-zinc-200"
              >
                <Plus size={16} />
                Crear Página
              </Link>
            )}
          </div>
        </div>

        {overage > 0 && (
          <div className="mb-10 w-full rounded-2xl bg-red-950/50 border border-red-900/50 backdrop-blur-md p-6 flex flex-col md:flex-row gap-6 items-center shadow-2xl">
            <div className="w-16 h-16 shrink-0 rounded-full bg-red-500/20 border border-red-500/30 text-red-500 flex items-center justify-center">
              <span className="text-2xl font-black italic">!</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-black italic tracking-tighter uppercase text-red-500 mb-1">Capacidad de Cuenta Excedida</h2>
              <p className="text-zinc-400 text-xs tracking-widest font-bold uppercase leading-relaxed max-w-2xl">
                Tu plan actual permite <strong className="text-white">{quota} páginas</strong>, pero tienes <strong className="text-white">{pages.length}</strong> creadas.
                Debido a un cambio en tu membresía, <span className="text-red-400">tienes que eliminar {overage} página{overage > 1 ? 's' : ''}</span> antes de poder continuar o publicar nuevos sitios.
              </p>
            </div>
            <div className="shrink-0 animate-pulse">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-50 bg-red-500/10 text-red-500 px-3 py-1.5 rounded-full">Acción Requerida</span>
            </div>
          </div>
        )}

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
                  <div className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest bg-zinc-800 text-zinc-300">
                    {page.brand}
                  </div>
                  <PageActions pageId={page._id.toString()} isPublished={page.published} locked={overage > 0} />
                </div>

                <div className="relative z-10 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">{page.title}</h3>
                  <p className="text-sm text-zinc-400 flex items-center gap-1">
                    /{page.brand}/{page.slug}
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-3">
                  {overage > 0 ? (
                    <div className="flex-1 text-center rounded-lg bg-red-950 border border-red-900/50 py-2 text-sm font-semibold text-red-500/50 flex justify-center items-center gap-2 cursor-not-allowed">
                      <Lock size={16} /> Página deshabilitada
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
