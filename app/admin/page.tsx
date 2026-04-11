import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ShieldCheck, DatabaseZap, Mail } from "lucide-react";
import { setPageQuota } from "./actions";
import { AdminQuotaInput } from "@/components/admin/AdminQuotaInput"; // Componente Cliente

export default async function AdminDashboard() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const client = await clerkClient();
  const currentUser = await client.users.getUser(userId);

  // Muro de seguridad
  if (currentUser.publicMetadata.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch a todos los usuarios
  const usersResponse = await client.users.getUserList();
  const users = usersResponse.data;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-amber-500/10 rounded-full text-amber-500">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Centro de Comando</h1>
            <p className="text-zinc-400 font-medium tracking-widest text-xs uppercase mt-1">Control de Cuotas de Servidor</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => {
            const email = u.emailAddresses[0]?.emailAddress || "Sin Correo";
            const currentQuota = (u.publicMetadata.pageQuota as number) || 0;
            const role = (u.publicMetadata.role as string) || "user";
            
            return (
              <div key={u.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                {role === "admin" && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-bl-lg">
                    SuperAdmin
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-6">
                  <img src={u.imageUrl} alt="Avatar" className="w-12 h-12 rounded-full ring-2 ring-white/10" />
                  <div>
                    <h3 className="font-bold text-white tracking-tight">{u.firstName} {u.lastName}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1 font-mono">
                      <Mail size={12} /> {email}
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                    <span className="text-zinc-500 flex items-center gap-1.5"><DatabaseZap size={14} className="text-amber-500" /> Cuota Global</span>
                    <span className="text-white text-sm">{currentQuota} Páginas</span>
                  </div>
                  
                  {role !== "admin" && (
                    <AdminQuotaInput userId={u.id} initialQuota={currentQuota} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  );
}
