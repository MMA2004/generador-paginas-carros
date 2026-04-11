"use client";
import { useState, useTransition } from "react";
import { setPageQuota } from "@/app/admin/actions";
import { Loader2, Plus, Minus, FileUp } from "lucide-react";

export function AdminQuotaInput({ userId, initialQuota }: { userId: string, initialQuota: number }) {
  const [quota, setQuota] = useState(initialQuota);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    startTransition(async () => {
      await setPageQuota(userId, quota);
    });
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-black border border-white/5 p-1 rounded-xl">
      <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-0.5">
        <button 
          onClick={() => setQuota(q => Math.max(0, q - 1))}
          className="w-8 h-8 flex justify-center items-center rounded-md hover:bg-zinc-800 transition-colors text-zinc-400"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center font-mono text-sm">{quota}</span>
        <button 
          onClick={() => setQuota(q => q + 1)}
          className="w-8 h-8 flex justify-center items-center rounded-md hover:bg-zinc-800 transition-colors text-zinc-400"
        >
          <Plus size={14} />
        </button>
      </div>
      
      <button 
         onClick={handleUpdate}
         disabled={isPending || quota === initialQuota}
         className="flex-1 flex justify-center items-center gap-2 h-9 text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-colors rounded-lg disabled:opacity-30"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : <><FileUp size={14} /> Guardar</>}
      </button>
    </div>
  );
}
