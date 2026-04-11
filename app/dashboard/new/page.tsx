"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    slug: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let errDesc = "Error al crear la página. Asegúrate de que no haya URLs repetidas.";
        try {
           const errPayload = await res.json();
           if (errPayload.error) errDesc = errPayload.error;
        } catch { }
        throw new Error(errDesc);
      }

      const data = await res.json();
      router.push(`/builder/${data.pageId}`);
    } catch (error: any) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Volver al dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Crear Página</h1>
            <p className="text-sm text-zinc-400 mt-2">Configura los detalles básicos de la nueva URL del vehículo.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium flex gap-3">
               <div>⚠️</div>
               <div>{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-zinc-200">
                Título Interno
              </label>
              <input
                id="title"
                required
                type="text"
                placeholder="Ej. Campaña Corolla 2024"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white transition-all"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="brand" className="text-sm font-medium text-zinc-200">
                  Marca
                </label>
                <input
                  id="brand"
                  required
                  type="text"
                  placeholder="ej. toyota"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all lowercase"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium text-zinc-200">
                  URL Slug
                </label>
                <input
                  id="slug"
                  required
                  type="text"
                  placeholder="ej. corolla-2024"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all lowercase"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                />
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-zinc-500 mb-4 text-center">
                La URL será: <br/> gibracompany.com/<span className="text-white">{formData.brand || "marca"}</span>/<span className="text-white">{formData.slug || "slug"}</span>
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-white text-black py-3 rounded-xl font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Crear e ir al Editor"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
