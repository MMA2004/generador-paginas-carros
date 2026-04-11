"use client";

import { useState, useEffect } from "react";
import { Globe, GlobeLock, Trash2, Loader2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export function PageActions({ pageId, isPublished, locked = false }: { pageId: string, isPublished: boolean, locked?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3000);
  };

  const togglePublish = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !isPublished })
      });
      if (!res.ok) throw new Error("Error toggling state");
      
      showToast(isPublished ? "Página desconectada" : "Página en línea");
      router.refresh();
    } catch (e) {
      console.error(e);
      showToast("Hubo un error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Error deleting");
      
      setConfirmDelete(false);
      showToast("Vehículo borrado", "success");
      setTimeout(() => router.refresh(), 300); // Dar tiemp a que se despache el UI
    } catch (e) {
      console.error(e);
      showToast("No se pudo borrar", "error");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2 relative z-20">
        <button 
           onClick={togglePublish}
           disabled={loading || locked}
           className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all ${
             locked ? 'bg-red-950/30 text-red-900 border border-red-900/10 opacity-50 cursor-not-allowed' :
             isPublished 
               ? 'bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 border border-emerald-400/20' 
               : 'bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 border border-amber-400/20'
           }`}
           title={locked ? "Interbloqueo de Sistema" : isPublished ? "Apagar página (Borrador)" : "Encender página (Hacer visible)"}
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : isPublished ? <Globe size={12} /> : <GlobeLock size={12} />}
          {locked ? "Bloqueado" : isPublished ? "En Línea" : "Apagado"}
        </button>

        <button 
          onClick={() => setConfirmDelete(true)}
          disabled={loading}
          className="flex items-center justify-center w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:bg-red-600 hover:text-white transition-colors"
          title="Eliminar vehículo"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* --- Confirm Modal --- */}
      {confirmDelete && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl w-full max-w-sm shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="bg-red-500/10 text-red-500 p-4 rounded-full mb-6 relative">
              <Trash2 size={36} />
               <div className="absolute top-0 right-0">
                  <AlertTriangle size={16} fill="currentColor" className="text-amber-500" />
               </div>
            </div>
            <h3 className="text-xl font-black italic tracking-tighter text-white mb-2 uppercase">Destrucción Total</h3>
            <p className="text-zinc-400 text-xs tracking-wider mb-8 leading-relaxed uppercase">
              Esta acción aplastará el vehículo bajo una prensa hidráulica y será irrecuperable. ¿Deseas aniquilarlo del sistema?
            </p>
            <div className="flex flex-col md:flex-row gap-3 w-full">
              <button 
                onClick={() => setConfirmDelete(false)} 
                className="flex-1 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors"
               >
                Cancelar
              </button>
              <button 
                onClick={deletePage} 
                className="flex-[1.5] py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors"
               >
                ¡Aniquilar!
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- Toast Notifications Premium --- */}
      {toast && mounted && createPortal(
        <div className="fixed bottom-8 right-8 z-[99999] animate-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-xl ${
            toast.type === 'success' ? 'bg-emerald-950/80 border-emerald-900/50 text-emerald-400 backdrop-blur' :
            'bg-red-950/80 border-red-900/50 text-red-500 backdrop-blur'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span className="text-xs font-bold uppercase tracking-widest leading-none mt-0.5">{toast.msg}</span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
