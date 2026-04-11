"use client";

import { useState, useEffect } from "react";
import { type IPageBlock } from "@/models/Page";
import { ModuleRenderer } from "@/components/page-modules/ModuleRenderer";
import { ArrowLeft, Save, Layout, Settings, Eye, Plus, Trash2, Loader2, ImagePlus, ChevronUp, ChevronDown, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableBlock } from "@/components/page-modules/SortableBlock";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { IconPicker } from "@/components/ui/icon-picker";

export function BuilderClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [blocks, setBlocks] = useState<IPageBlock[]>(initialData.blocks || []);
  const [template, setTemplate] = useState<string>(initialData.template || "luxury_minimal");
  const [activeTab, setActiveTab] = useState<"add" | "edit" | "design">("add");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [savedState, setSavedState] = useState({ blocks: initialData.blocks || [], template: initialData.template || "luxury_minimal" });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{title: string, description: string, onConfirm: () => void} | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'} | null>(null);

  const showToast = (msg: string, type: 'success'|'error'|'info' = 'info') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const isDirty = JSON.stringify(blocks) !== JSON.stringify(savedState.blocks) || template !== savedState.template;
    setHasUnsavedChanges(isDirty);
  }, [blocks, template, savedState]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Muestra el prompteo nativo de "Abandonar sitio"
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setConfirmDialog({
        title: "Cambios sin guardar",
        description: "Tienes ajustes de diseño y bloques que se perderán si sales ahora. ¿Estás seguro de abandonar esta página?",
        onConfirm: () => router.push("/dashboard")
      });
    } else {
      router.push("/dashboard");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const sortedItems = [...items].sort((a, b) => a.order - b.order);
        const oldIndex = sortedItems.findIndex(t => t.id === active.id);
        const newIndex = sortedItems.findIndex(t => t.id === over.id);
        const newItems = arrayMove(sortedItems, oldIndex, newIndex);
        return newItems.map((item, index) => ({ ...item, order: index }));
      });
    }
  };

  const moveBlockByArrow = (id: string, direction: -1 | 1) => {
    setBlocks((items) => {
      const sortedItems = [...items].sort((a, b) => a.order - b.order);
      const oldIndex = sortedItems.findIndex(t => t.id === id);
      const newIndex = oldIndex + direction;
      
      if (newIndex < 0 || newIndex >= sortedItems.length) return items;
      
      const newItems = arrayMove(sortedItems, oldIndex, newIndex);
      return newItems.map((item, index) => ({ ...item, order: index }));
    });
  };

  const addBlock = (type: string) => {
    const newBlock: IPageBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      order: blocks.length,
      data: type === "HeroSection" ? { title: "Nuevo Vehículo", subtitle: "Innovación espectacular", ctaText: "Ver Más" } 
            : type === "SpecsSection" ? { title: "Especificaciones", specs: [{label: "Motor", value: "V8"}], description: "Detalles técnicos" }
            : type === "GallerySection" ? { title: "Galería", images: [] }
            : type === "PricingSection" ? { title: "Precio Oficial", price: "$ 0 USD", description: "Configuración estándar", disclaimer: "Precios sujetos a variaciones sin previo aviso." }
            : type === "ColorsSection" ? { title: "Elige tu Color", colors: [{ label: "Blanco Astro", hexCode: "#ffffff"}], description: "Personaliza el exterior." }
            : type === "FeatureSection" ? { title: "Atributo Destacado", description: "Una descripción envolvente de la innovación del vehículo.", imagePosition: "left", imageUrl: "" }
            : type === "VideoSection" ? { title: "Ver Vehículo en Acción", videoUrl: "" } : {}
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    setActiveTab("edit");
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const updateBlockData = (id: string, field: string, value: any) => {
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
      if (imagesToDelete.length > 0) {
        const { deleteFileFromFirebase } = await import("@/lib/firebase");
        for (const url of imagesToDelete) {
          try {
            await deleteFileFromFirebase(url);
          } catch (e) {
            console.error("No se pudo borrar del storage:", url, e);
          }
        }
        setImagesToDelete([]);
      }

      const res = await fetch(`/api/pages/${initialData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks, template })
      });
      if (!res.ok) throw new Error("Error saving");
      setSavedState({ blocks, template });
      showToast("Página guardada exitosamente", "success");
    } catch (err) {
      console.error(err);
      showToast("Hubo un problema guardando. Ver consola.", "error");
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
      showToast("Imagen subida con éxito", "success");
    } catch (error) {
      showToast("Error subiendo la imagen al Storage.", "error");
      console.error(error);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleImageDelete = (fieldName: string) => {
    if (!selectedBlockId) return;
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block || !block.data[fieldName]) return;
    
    setImagesToDelete(prev => [...prev, block.data[fieldName]]);
    updateBlockData(selectedBlockId, fieldName, "");
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBlockId) return;
    
    try {
      setUploadingImage(true);
      const { uploadFileToFirebase } = await import("@/lib/firebase");
      const url = await uploadFileToFirebase(file, `pages-uploads/${initialData._id}`);
      
      const block = blocks.find(b => b.id === selectedBlockId);
      if (block) {
        const currentImages = block.data.images || [];
        updateBlockData(selectedBlockId, "images", [...currentImages, url]);
      }
      showToast("Imagen agregada a la galería", "success");
    } catch (error) {
      showToast("Error subiendo la imagen.", "error");
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeGalleryImage = (imgUrl: string) => {
    if (!selectedBlockId) return;
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block) return;
    
    setImagesToDelete(prev => [...prev, imgUrl]);
    const newImages = (block.data.images || []).filter((i: string) => i !== imgUrl);
    updateBlockData(selectedBlockId, "images", newImages);
  };

  const updateSpec = (index: number, field: "label" | "value" | "icon", val: string) => {
    if (!selectedBlockId) return;
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block) return;
    const newSpecs = [...(block.data.specs || [])];
    newSpecs[index][field] = val;
    updateBlockData(selectedBlockId, "specs", newSpecs);
  };

  const addSpec = () => {
    if (!selectedBlockId) return;
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block) return;
    const newSpecs = [...(block.data.specs || []), { label: "NUEVO", value: "" }];
    updateBlockData(selectedBlockId, "specs", newSpecs);
  };

  const removeSpec = (index: number) => {
    if (!selectedBlockId) return;
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block) return;
    const newSpecs = [...(block.data.specs || [])];
    newSpecs.splice(index, 1);
    updateBlockData(selectedBlockId, "specs", newSpecs);
  };

  const updateColorSwatch = (index: number, field: "label" | "hexCode", val: string) => {
    if (!selectedBlockId) return;
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block) return;
    const newColors = [...(block.data.colors || [])];
    newColors[index][field] = val;
    updateBlockData(selectedBlockId, "colors", newColors);
  };

  const addColorSwatch = () => {
    if (!selectedBlockId) return;
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block) return;
    const newColors = [...(block.data.colors || []), { label: "Nuevo Color", hexCode: "#000000" }];
    updateBlockData(selectedBlockId, "colors", newColors);
  };

  const removeColorSwatch = (index: number) => {
    if (!selectedBlockId) return;
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block) return;
    const newColors = [...(block.data.colors || [])];
    newColors.splice(index, 1);
    updateBlockData(selectedBlockId, "colors", newColors);
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="flex w-full h-screen bg-zinc-950 text-white overflow-hidden relative">
      
      {/* --- Custom Modal Dialog (Sustituto Premium de alert/confirm nativos) --- */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl w-full max-w-sm shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="bg-amber-500/10 text-amber-500 p-4 rounded-full mb-6">
              <AlertTriangle size={36} />
            </div>
            <h3 className="text-xl font-black italic tracking-tighter text-white mb-2 uppercase">{confirmDialog.title}</h3>
            <p className="text-zinc-400 text-xs tracking-wider mb-8 leading-relaxed uppercase">
              {confirmDialog.description}
            </p>
            <div className="flex flex-col md:flex-row gap-3 w-full">
              <button 
                onClick={() => setConfirmDialog(null)} 
                className="flex-1 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }} 
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Toast Notifications Premium --- */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-xl ${
            toast.type === 'success' ? 'bg-emerald-950/80 border-emerald-900/50 text-emerald-400 backdrop-blur' :
            toast.type === 'error' ? 'bg-red-950/80 border-red-900/50 text-red-500 backdrop-blur' : 
            'bg-zinc-900/90 border-zinc-800 text-zinc-300 backdrop-blur'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : toast.type === 'error' ? <XCircle size={20} /> : <Info size={20} />}
            <span className="text-xs font-bold uppercase tracking-widest leading-none mt-0.5">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-80 border-r border-white/10 bg-zinc-900/50 flex flex-col h-full shrink-0">
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0 bg-black">
          <button onClick={handleBack} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <div className="text-sm font-semibold truncate px-2">{initialData.title}</div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <span className="text-[9px] uppercase font-bold tracking-widest text-amber-500 flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                </span>
                Cambios sin guardar
              </span>
            )}
            <button 
              onClick={handleSave} 
              disabled={isSaving || !hasUnsavedChanges}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-300 disabled:opacity-50
                ${hasUnsavedChanges ? 'bg-amber-500 text-black hover:bg-amber-400 tracking-wide' : 'bg-white text-black hover:bg-zinc-200'}
              `}
            >
              <Save size={14} /> {isSaving ? "..." : hasUnsavedChanges ? "Guardar Ahora" : "Guardado"}
            </button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 shrink-0">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="add" className="gap-1.5 text-[10px]"><Layout size={12} /> Bloques</TabsTrigger>
              <TabsTrigger value="edit" className="gap-1.5 text-[10px]"><Settings size={12} /> Opción</TabsTrigger>
              <TabsTrigger value="design" className="gap-1.5 text-[10px]"><Eye size={12} /> Diseño</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <TabsContent value="design" className="m-0 space-y-4">
              <div className="text-center mb-6">
                <h3 className="font-bold text-white text-sm">Tema Global</h3>
                <p className="text-xs text-zinc-500 mt-1">Transforma la estructura de toda tu página instantáneamente.</p>
              </div>
              
              <div 
                className={`group border rounded-xl overflow-hidden cursor-pointer transition-all ${template === 'luxury_minimal' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-zinc-800 hover:border-zinc-500'}`}
                onClick={() => setTemplate('luxury_minimal')}
              >
                <div className="h-16 bg-white flex items-center justify-center border-b border-zinc-200">
                   <div className="w-16 h-2 bg-zinc-300 rounded-full"></div>
                </div>
                <div className="p-3 bg-zinc-950 flex flex-col items-center">
                   <span className={`text-xs font-bold uppercase tracking-wider ${template === 'luxury_minimal' ? 'text-emerald-400' : 'text-zinc-300'}`}>Luxury Minimal</span>
                </div>
              </div>

              <div 
                className={`group border rounded-xl overflow-hidden cursor-pointer transition-all ${template === 'sport_dynamic' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-zinc-800 hover:border-zinc-500'}`}
                onClick={() => setTemplate('sport_dynamic')}
              >
                <div className="h-16 bg-black flex items-center justify-center border-b border-zinc-900 border-t-4 border-t-red-600 relative overflow-hidden">
                   <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-zinc-900 rotate-45"></div>
                   <div className="w-16 h-2 bg-zinc-700 rounded-full skew-x-12"></div>
                </div>
                <div className="p-3 bg-zinc-950 flex flex-col items-center">
                   <span className={`text-xs font-bold uppercase tracking-wider ${template === 'sport_dynamic' ? 'text-emerald-400' : 'text-zinc-300'}`}>Sport Dynamic</span>
                </div>
              </div>

              <div 
                className={`group border rounded-xl overflow-hidden cursor-pointer transition-all ${template === 'classic_maserati' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-zinc-800 hover:border-zinc-500'}`}
                onClick={() => setTemplate('classic_maserati')}
              >
                <div className="h-16 bg-[#0B1528] flex flex-col items-center justify-center border-b border-[#142340]">
                   <div className="w-6 h-6 border border-[#2d436b] mb-1"></div>
                   <div className="w-16 h-1 bg-[#1a2d52]"></div>
                </div>
                <div className="p-3 bg-zinc-950 flex flex-col items-center">
                   <span className={`text-xs font-bold uppercase tracking-wider ${template === 'classic_maserati' ? 'text-emerald-400' : 'text-zinc-300'}`}>Classic Brand</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="add" className="m-0 space-y-3">
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
              <div 
                className="group flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900 rounded-xl p-6 cursor-pointer hover:border-white/50 hover:bg-zinc-800 transition-all"
                onClick={() => addBlock("SpecsSection")}
              >
                <div className="h-10 w-20 flex flex-col gap-1.5 mb-3">
                  <div className="h-2 w-full bg-zinc-800 rounded-sm border border-zinc-700 group-hover:border-zinc-500" />
                  <div className="h-2 w-full bg-zinc-800 rounded-sm border border-zinc-700 group-hover:border-zinc-500" />
                  <div className="h-2 w-3/4 bg-zinc-800 rounded-sm border border-zinc-700 group-hover:border-zinc-500" />
                </div>
                <span className="text-sm font-medium">Especificaciones</span>
              </div>
              <div 
                className="group flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900 rounded-xl p-6 cursor-pointer hover:border-white/50 hover:bg-zinc-800 transition-all"
                onClick={() => addBlock("PricingSection")}
              >
                <div className="h-10 w-20 flex flex-col items-center justify-center gap-1.5 mb-3 border border-dashed border-zinc-700 rounded-md">
                   <div className="text-xl font-serif text-emerald-500">$</div>
                </div>
                <span className="text-sm font-medium">Costos</span>
              </div>
              <div 
                className="group flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900 rounded-xl p-6 cursor-pointer hover:border-white/50 hover:bg-zinc-800 transition-all"
                onClick={() => addBlock("ColorsSection")}
              >
                <div className="h-10 w-20 flex justify-center items-center gap-1 mb-3">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
                <span className="text-sm font-medium">Colores</span>
              </div>
              <div 
                className="group flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900 rounded-xl p-6 cursor-pointer hover:border-white/50 hover:bg-zinc-800 transition-all"
                onClick={() => addBlock("FeatureSection")}
              >
                <div className="h-10 w-20 flex bg-zinc-800 rounded mb-3 overflow-hidden border border-zinc-700 group-hover:border-zinc-500">
                  <div className="w-1/2 bg-zinc-700" />
                  <div className="w-1/2 p-1 flex flex-col gap-0.5 justify-center">
                     <div className="h-1 w-full bg-zinc-600 rounded-sm" />
                     <div className="h-1 w-3/4 bg-zinc-600 rounded-sm" />
                  </div>
                </div>
                <span className="text-sm font-medium">Módulo 50/50</span>
              </div>
              <div 
                className="group flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900 rounded-xl p-6 cursor-pointer hover:border-white/50 hover:bg-zinc-800 transition-all"
                onClick={() => addBlock("VideoSection")}
              >
                <div className="h-10 w-20 flex items-center justify-center bg-zinc-800 rounded mb-3 border border-zinc-700 group-hover:border-zinc-500">
                   <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1" />
                </div>
                <span className="text-sm font-medium">Video Player</span>
              </div>
            </TabsContent>

            <TabsContent value="edit" className="m-0">
              {selectedBlock ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
                    <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">
                      {selectedBlock.type}
                    </span>
                    <button 
                      onClick={() => removeBlock(selectedBlock.id)}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                      title="Eliminar bloque"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {/* Universal Styling */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pb-4 border-b border-zinc-800/50">
                    <div className="space-y-1.5 pt-1">
                       <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Color Fondo</label>
                       <div className="flex h-9 w-full rounded-md border border-zinc-800 bg-black overflow-hidden pr-3 hover:border-zinc-500 transition-colors">
                         <input 
                           type="color" 
                           value={selectedBlock.data.bgColor || "#09090b"} 
                           onChange={(e) => updateBlockData(selectedBlock.id, "bgColor", e.target.value)}
                           className="w-12 h-14 -mt-2 -ml-2 cursor-pointer"
                         />
                         <div className="flex-1 text-[11px] text-zinc-400 font-mono flex items-center pl-2">
                           {selectedBlock.data.bgColor || "#09090b"}
                         </div>
                       </div>
                    </div>
                    <div className="space-y-1.5 pt-1">
                       <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Color Texto</label>
                       <div className="flex h-9 w-full rounded-md border border-zinc-800 bg-black overflow-hidden pr-3 hover:border-zinc-500 transition-colors">
                         <input 
                           type="color" 
                           value={selectedBlock.data.textColor || "#ffffff"} 
                           onChange={(e) => updateBlockData(selectedBlock.id, "textColor", e.target.value)}
                           className="w-12 h-14 -mt-2 -ml-2 cursor-pointer"
                         />
                         <div className="flex-1 text-[11px] text-zinc-400 font-mono flex items-center pl-2">
                           {selectedBlock.data.textColor || "#ffffff"}
                         </div>
                       </div>
                    </div>
                    <div className="space-y-1.5 pt-1">
                       <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider text-amber-500">Acento (Laser/Bordes)</label>
                       <div className="flex h-9 w-full rounded-md border border-zinc-800 bg-black overflow-hidden pr-3 hover:border-zinc-500 transition-colors">
                         <input 
                           type="color" 
                           value={selectedBlock.data.accentColor || "#dc2626"} 
                           onChange={(e) => updateBlockData(selectedBlock.id, "accentColor", e.target.value)}
                           className="w-12 h-14 -mt-2 -ml-2 cursor-pointer"
                         />
                         <div className="flex-1 text-[11px] text-zinc-400 font-mono flex items-center pl-2">
                           {selectedBlock.data.accentColor || "#dc2626"}
                         </div>
                       </div>
                    </div>
                  </div>

                  {selectedBlock.type === "HeroSection" && (
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-xs text-zinc-400">Título</label>
                        <Input 
                          value={selectedBlock.data.title || ""}
                          onChange={(e) => updateBlockData(selectedBlock.id, "title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-zinc-400">Subtítulo</label>
                        <Input 
                          value={selectedBlock.data.subtitle || ""}
                          onChange={(e) => updateBlockData(selectedBlock.id, "subtitle", e.target.value)}
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
                     <div className="space-y-5">
                       <div className="space-y-1.5">
                         <label className="text-xs text-zinc-400">Título de Galería</label>
                         <Input 
                           value={selectedBlock.data.title || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "title", e.target.value)}
                         />
                       </div>
                       <div className="space-y-3 pt-4 border-t border-zinc-800">
                         <label className="text-xs text-zinc-400 font-medium flex items-center justify-between">
                           Fotos de Galería
                           {uploadingImage && <span className="flex items-center gap-1 text-emerald-400 text-[10px]"><Loader2 size={10} className="animate-spin" /> Subiendo...</span>}
                         </label>
                         
                         <div className="grid grid-cols-2 gap-2">
                           {(selectedBlock.data.images || []).map((img: string, i: number) => (
                             <div key={i} className="relative group rounded-lg overflow-hidden border border-zinc-800 aspect-square">
                               <img src={img} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                 <button onClick={() => removeGalleryImage(img)} className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors">
                                   <Trash2 size={14} />
                                 </button>
                               </div>
                             </div>
                           ))}
                         </div>
                         
                         {(selectedBlock.data.images || []).length < 6 && (
                           <label className={`w-full cursor-pointer flex flex-col items-center justify-center py-4 bg-zinc-900 border border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg transition-all ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                             <Plus size={18} className="text-zinc-500 mb-1" />
                             <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Añadir Foto</span>
                             <input type="file" accept="image/*" className="hidden" onChange={handleGalleryImageUpload} disabled={uploadingImage}/>
                           </label>
                         )}
                       </div>
                     </div>
                  )}

                  {selectedBlock.type === "SpecsSection" && (
                    <div className="space-y-5">
                       <div className="space-y-1.5">
                         <label className="text-xs text-zinc-400">Título</label>
                         <Input 
                           value={selectedBlock.data.title || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "title", e.target.value)}
                         />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-xs text-zinc-400">Descripción (Opcional)</label>
                         <Input 
                           value={selectedBlock.data.description || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "description", e.target.value)}
                         />
                       </div>
                       
                       <div className="space-y-3 pt-4 border-t border-zinc-800">
                         <label className="text-xs text-zinc-400 font-medium">Atributos Técnicos</label>
                         {(selectedBlock.data.specs || []).map((spec: any, i: number) => (
                           <div key={i} className="flex gap-2 items-center bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                             <div className="flex-1 space-y-2">
                               <Input 
                                 placeholder="Propiedad (Ej: Motor)" 
                                 value={spec.label} 
                                 onChange={(e) => updateSpec(i, "label", e.target.value)}
                                 className="h-8 text-xs bg-zinc-900"
                               />
                               <Input 
                                 placeholder="Valor (Ej: V8)" 
                                 value={spec.value} 
                                 onChange={(e) => updateSpec(i, "value", e.target.value)}
                                 className="h-8 text-xs bg-zinc-900"
                               />
                             </div>
                             <div className="flex flex-col gap-1.5 border-l border-zinc-800 pl-2">
                               <IconPicker 
                                 value={spec.icon || "Asterisk"} 
                                 onChange={(val) => updateSpec(i, "icon", val)} 
                               />
                               <button onClick={() => removeSpec(i)} title="Borrar Atributo" className="flex items-center justify-center p-2 h-8 w-8 text-zinc-500 hover:text-red-400 bg-black/20 hover:bg-red-500/10 rounded transition-colors">
                                 <Trash2 size={14} />
                               </button>
                             </div>
                           </div>
                         ))}
                         
                         <button onClick={addSpec} className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                            <Plus size={14} /> Añadir Atributo
                         </button>
                       </div>
                    </div>
                  )}

                  {selectedBlock.type === "PricingSection" && (
                     <div className="space-y-5">
                       <div className="space-y-1.5">
                         <label className="text-xs text-zinc-400">Título Principal</label>
                         <Input 
                           value={selectedBlock.data.title || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "title", e.target.value)}
                         />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-xs text-zinc-400">Precio Final</label>
                         <Input 
                           value={selectedBlock.data.price || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "price", e.target.value)}
                           placeholder="Ej: $ 200,000 USD"
                         />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-xs text-zinc-400">Descripción / Etiqueta Métrica</label>
                         <Input 
                           value={selectedBlock.data.description || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "description", e.target.value)}
                         />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-xs text-zinc-400">Términos / Notas *</label>
                         <Input 
                           value={selectedBlock.data.disclaimer || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "disclaimer", e.target.value)}
                         />
                       </div>
                     </div>
                  )}

                  {selectedBlock.type === "ColorsSection" && (
                    <div className="space-y-5">
                       <div className="space-y-1.5">
                         <label className="text-xs text-zinc-400">Título del Showroom</label>
                         <Input 
                           value={selectedBlock.data.title || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "title", e.target.value)}
                         />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-xs text-zinc-400">Frase Comercial</label>
                         <Input 
                           value={selectedBlock.data.description || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "description", e.target.value)}
                         />
                       </div>
                       
                       <div className="space-y-3 pt-4 border-t border-zinc-800">
                         <label className="text-xs text-zinc-400 font-medium">Botes de Pintura</label>
                         {(selectedBlock.data.colors || []).map((color: any, i: number) => (
                           <div key={i} className="flex gap-2 items-center bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                             <div className="flex flex-col gap-1 w-10">
                               <input 
                                 type="color" 
                                 value={color.hexCode || "#000000"} 
                                 onChange={(e) => updateColorSwatch(i, "hexCode", e.target.value)}
                                 className="w-10 h-10 rounded border border-white/10 cursor-pointer p-0"
                               />
                             </div>
                             <div className="flex-1">
                               <Input 
                                 placeholder="Nombre Técnico (Ej: Blu Note)" 
                                 value={color.label} 
                                 onChange={(e) => updateColorSwatch(i, "label", e.target.value)}
                                 className="h-10 text-xs bg-zinc-900"
                               />
                             </div>
                             <button onClick={() => removeColorSwatch(i)} className="p-2 text-zinc-500 hover:text-red-400 shrink-0">
                               <Trash2 size={14} />
                             </button>
                           </div>
                         ))}
                         
                         <button onClick={addColorSwatch} className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                            <Plus size={14} /> Crear Nuevo Tono
                         </button>
                       </div>
                    </div>
                  )}

                  {selectedBlock.type === "FeatureSection" && (
                     <div className="space-y-5">
                       <div className="space-y-1.5">
                         <label className="text-xs text-zinc-400">Título de la Característica</label>
                         <Input 
                           value={selectedBlock.data.title || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "title", e.target.value)}
                           placeholder="Ej: Fibra de Carbono Activa"
                         />
                       </div>
                       <div className="space-y-1.5 flex flex-col">
                         <label className="text-xs text-zinc-400">Descripción Larga</label>
                         <textarea 
                           className="w-full text-sm bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg p-3 min-h-[100px] outline-none"
                           value={selectedBlock.data.description || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "description", e.target.value)}
                         />
                       </div>

                       <div className="space-y-1.5 pt-2">
                         <label className="text-xs text-zinc-400">URL del Recurso Visual (Imagen)</label>
                         <Input 
                           value={selectedBlock.data.imageUrl || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "imageUrl", e.target.value)}
                           placeholder="https://..."
                         />
                       </div>

                       <div className="space-y-1.5 pt-2">
                         <label className="text-xs text-zinc-400">Alineación de Imagen (Para 50/50)</label>
                         <div className="flex gap-2">
                            <button 
                              onClick={() => updateBlockData(selectedBlock.id, "imagePosition", "left")}
                              className={`flex-1 py-1.5 text-xs rounded border ${selectedBlock.data.imagePosition !== 'right' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}
                            >
                               Izquierda
                            </button>
                            <button 
                              onClick={() => updateBlockData(selectedBlock.id, "imagePosition", "right")}
                              className={`flex-1 py-1.5 text-xs rounded border ${selectedBlock.data.imagePosition === 'right' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}
                            >
                               Derecha
                            </button>
                         </div>
                       </div>
                     </div>
                  )}

                  {selectedBlock.type === "VideoSection" && (
                     <div className="space-y-5">
                       <div className="space-y-1.5">
                         <label className="text-xs text-zinc-400">Enlace del Video (YouTube o MP4)</label>
                         <Input 
                           value={selectedBlock.data.videoUrl || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "videoUrl", e.target.value)}
                           placeholder="https://www.youtube.com/watch?v=..."
                         />
                         <p className="text-[10px] text-zinc-500 mt-1">Si copias un enlace de YouTube, se insertará en bucle de cine sin controles.</p>
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-xs text-zinc-400">Título Empotrado Corto (Opcional)</label>
                         <Input 
                           value={selectedBlock.data.title || ""}
                           onChange={(e) => updateBlockData(selectedBlock.id, "title", e.target.value)}
                           placeholder="Ej: Mira la aerodinámica"
                         />
                       </div>
                     </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 text-zinc-500">
                  <Settings size={24} className="mb-2 opacity-50" />
                  <p className="text-sm">Selecciona un bloque en la previsualización o añade uno nuevo.</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </aside>

      {/* Main Canvas Context */}
      <main className="flex-1 relative overflow-y-auto bg-[#0a0a0a] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] bg-fixed">
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
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col relative w-full pt-4">
                      {/* Generando Módulos Ordenables */}
                      {[...blocks].sort((a,b) => a.order - b.order).map((block) => (
                        <SortableBlock 
                          key={block.id} 
                          block={block} 
                          isSelected={selectedBlockId === block.id} 
                          onSelect={() => { setSelectedBlockId(block.id); setActiveTab("edit"); }} 
                          template={template}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
           </div>
        </div>
      </main>

      {/* Right Sidebar - Layers */}
      <aside className="w-56 border-l border-white/10 bg-zinc-900/50 flex flex-col h-full shrink-0">
        <div className="h-16 flex items-center px-4 border-b border-white/10 shrink-0 bg-black">
          <span className="text-sm font-semibold text-zinc-300 flex items-center gap-2"><Layout size={16} /> Capas</span>
        </div>
        <div className="p-3 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-2">
            {[...blocks].sort((a,b) => a.order - b.order).map((block, index) => (
              <div 
                key={block.id}
                onClick={() => { setSelectedBlockId(block.id); setActiveTab("edit"); }}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-colors ${
                  selectedBlockId === block.id ? "bg-zinc-800 border-zinc-600 text-white" : "bg-zinc-900/50 border-transparent text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200"
                }`}
              >
                <div className="flex flex-col truncate overflow-hidden pr-2">
                  <span className="text-xs font-semibold truncate">{block.type}</span>
                  <span className="text-[10px] opacity-60">Orden: {index}</span>
                </div>
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button 
                    disabled={index === 0}
                    onClick={(e) => { e.stopPropagation(); moveBlockByArrow(block.id, -1); }}
                    className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button 
                    disabled={index === blocks.length - 1}
                    onClick={(e) => { e.stopPropagation(); moveBlockByArrow(block.id, 1); }}
                    className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            ))}
            {blocks.length === 0 && (
              <div className="text-[11px] text-zinc-600 text-center py-6">Selecciona o agrega bloques para ver las capas aquí.</div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
