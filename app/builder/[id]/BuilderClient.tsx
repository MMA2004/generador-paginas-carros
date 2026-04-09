"use client";

import { useState } from "react";
import { type IPageBlock } from "@/models/Page";
import { ModuleRenderer } from "@/components/page-modules/ModuleRenderer";
import { ArrowLeft, Save, Layout, Settings, Eye, Plus, Trash2, Loader2, ImagePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function BuilderClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [blocks, setBlocks] = useState<IPageBlock[]>(initialData.blocks || []);
  const [activeTab, setActiveTab] = useState<"add" | "edit">("add");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const addBlock = (type: string) => {
    const newBlock: IPageBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      order: blocks.length,
      data: type === "HeroSection" ? { title: "Nuevo Vehículo", subtitle: "Innovación espectacular", ctaText: "Ver Más" } : {}
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    setActiveTab("edit");
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const updateBlockData = (id: string, field: string, value: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === id) {
        return { ...b, data: { ...b.data, [field]: value } };
      }
      return b;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/pages/${initialData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks })
      });
      if (!res.ok) throw new Error("Error saving");
      alert("Página guardada exitosamente");
    } catch (err) {
      console.error(err);
      alert("Hubo un problema guardando. Ver consola.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBlockId) return;
    
    try {
      setUploadingImage(true);
      const { uploadFileToFirebase } = await import("@/lib/firebase");
      
      const url = await uploadFileToFirebase(file, `pages-uploads/${initialData._id}`);
      updateBlockData(selectedBlockId, fieldName, url);
    } catch (error) {
      alert("Error subiendo la imagen a Firebase Storage. Verifica tus credenciales.");
      console.error(error);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleImageDelete = async (fieldName: string) => {
    if (!selectedBlockId) return;
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block || !block.data[fieldName]) return;
    
    try {
      setUploadingImage(true);
      const { deleteFileFromFirebase } = await import("@/lib/firebase");
      
      await deleteFileFromFirebase(block.data[fieldName]);
      updateBlockData(selectedBlockId, fieldName, "");
    } catch (error) {
      alert("Error eliminando la imagen de Firebase.");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="flex w-full h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/10 bg-zinc-900/50 flex flex-col h-full shrink-0">
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0 bg-black">
          <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="text-sm font-semibold truncate px-2">{initialData.title}</div>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-1.5 text-xs bg-white text-black px-3 py-1.5 rounded-full font-medium hover:bg-zinc-200 disabled:opacity-50"
          >
            <Save size={14} /> {isSaving ? "..." : "Guardar"}
          </button>
        </div>

        <div className="flex border-b border-white/10 shrink-0">
          <button 
            className={`flex-1 py-3 text-xs font-medium border-b-2 flex justify-center items-center gap-2 ${activeTab === 'add' ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            onClick={() => setActiveTab("add")}
          >
            <Layout size={14} /> Añadir Bloques
          </button>
          <button 
            className={`flex-1 py-3 text-xs font-medium border-b-2 flex justify-center items-center gap-2 ${activeTab === 'edit' ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            onClick={() => setActiveTab("edit")}
          >
            <Settings size={14} /> Propiedades
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === "add" ? (
            <div className="space-y-3">
              <div 
                className="group flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900 rounded-xl p-6 cursor-pointer hover:border-white/50 hover:bg-zinc-800 transition-all"
                onClick={() => addBlock("HeroSection")}
              >
                <div className="h-10 w-20 bg-zinc-800 rounded-md mb-3 border border-zinc-700 group-hover:border-zinc-500 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                </div>
                <span className="text-sm font-medium">Hero de Vehículo</span>
              </div>
              <div 
                className="group flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900 rounded-xl p-6 cursor-pointer hover:border-white/50 hover:bg-zinc-800 transition-all"
                onClick={() => addBlock("GallerySection")}
              >
                <div className="h-10 w-20 flex gap-1 mb-3">
                  <div className="flex-1 bg-zinc-800 rounded-sm border border-zinc-700 group-hover:border-zinc-500" />
                  <div className="flex-1 bg-zinc-800 rounded-sm border border-zinc-700 group-hover:border-zinc-500" />
                </div>
                <span className="text-sm font-medium">Galería</span>
              </div>
            </div>
          ) : (
            <div>
              {selectedBlock ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-zinc-500 tracking-wider">
                      Editando: {selectedBlock.type}
                    </span>
                    <button 
                      onClick={() => removeBlock(selectedBlock.id)}
                      className="text-red-400 hover:text-red-300 bg-red-400/10 p-1.5 rounded-lg"
                      title="Eliminar bloque"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {selectedBlock.type === "HeroSection" && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-zinc-400">Título</label>
                        <input 
                          type="text" 
                          value={selectedBlock.data.title || ""}
                          onChange={(e) => updateBlockData(selectedBlock.id, "title", e.target.value)}
                          className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-white transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-zinc-400">Subtítulo</label>
                        <input 
                          type="text" 
                          value={selectedBlock.data.subtitle || ""}
                          onChange={(e) => updateBlockData(selectedBlock.id, "subtitle", e.target.value)}
                          className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5 pt-4 border-t border-zinc-800">
                        <label className="text-xs text-zinc-400 font-medium flex items-center justify-between">
                          Imagen Principal (Firebase)
                          {uploadingImage && <span className="flex items-center gap-1 text-emerald-400 text-[10px]"><Loader2 size={10} className="animate-spin" /> Subiendo...</span>}
                        </label>
                        
                        {selectedBlock.data.imageUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video flex-shrink-0 w-full mt-2">
                            <img src={selectedBlock.data.imageUrl} className="w-full h-full object-cover" alt="fondo" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all backdrop-blur-sm">
                              <label className={`cursor-pointer bg-white text-black px-4 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-lg ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                                Reemplazar
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "imageUrl")} disabled={uploadingImage}/>
                              </label>
                              <button 
                                onClick={() => handleImageDelete("imageUrl")} 
                                disabled={uploadingImage}
                                title="Eliminar Imagen"
                                className="bg-red-500/80 text-white p-2 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className={`w-full cursor-pointer flex flex-col items-center justify-center py-6 bg-black border border-dashed border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900/50 rounded-xl transition-all h-32 mt-2 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                            {uploadingImage ? (
                               <Loader2 size={24} className="text-emerald-400 mb-2 animate-spin" />
                            ) : (
                               <ImagePlus size={24} className="text-zinc-600 mb-2" />
                            )}
                            <span className="text-xs font-medium text-zinc-400">{uploadingImage ? "Subiendo archivo..." : "Subir desde PC"}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "imageUrl")} disabled={uploadingImage}/>
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedBlock.type === "GallerySection" && (
                     <div className="text-sm text-zinc-400 text-center py-10">
                        Opciones de galería en progreso...
                     </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 text-zinc-500">
                  <Settings size={24} className="mb-2 opacity-50" />
                  <p className="text-sm">Selecciona un bloque en la previsualización o añade uno nuevo.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Canvas Context */}
      <main className="flex-1 relative bg-[#0a0a0a] overflow-y-auto">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative flex flex-col justify-center items-center py-12 px-4 md:px-8 min-h-full min-w-full">
           <div className={`w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border border-white/10 bg-black min-h-[600px]`}>
              
              {/* Fake Browser header */}
              <div className="h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-1.5 shrink-0">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <div className="flex-1 flex justify-center">
                  <div className="h-4 w-32 bg-zinc-800 rounded text-[9px] text-zinc-500 text-center flex items-center justify-center font-mono truncate px-2">
                    {initialData.brand}/{initialData.slug}
                  </div>
                </div>
              </div>

              {blocks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-32 text-zinc-500 min-h-[500px]">
                  <Layout size={40} className="mb-4 opacity-20" />
                  <h3 className="text-xl font-semibold mb-2 text-zinc-300">Lienzo Vacío</h3>
                  <p className="text-sm">Añade módulos desde la barra lateral izquierda para comenzar.</p>
                </div>
              ) : (
                <div className="flex flex-col relative w-full">
                  {/* Block Wrapper to allow selection */}
                  {blocks.sort((a,b) => a.order - b.order).map((block) => (
                    <div 
                      key={block.id}
                      className={`relative group ring-inset ring-2 transition-all cursor-pointer ${
                        selectedBlockId === block.id 
                          ? "ring-blue-500 z-10" 
                          : "ring-transparent hover:ring-white/20"
                      }`}
                      onClick={() => {
                        setSelectedBlockId(block.id);
                        setActiveTab("edit");
                      }}
                    >
                      <div className={`absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur text-white text-[10px] rounded border border-white/10 uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none ${selectedBlockId === block.id ? "opacity-100 bg-blue-600 border-blue-500" : ""}`}>
                        {block.type}
                      </div>
                      
                      <div className="pointer-events-none">
                        <ModuleRenderer blocks={[block]} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}
