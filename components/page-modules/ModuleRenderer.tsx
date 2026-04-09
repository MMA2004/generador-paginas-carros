import { type IPageBlock } from "@/models/Page";
import { HeroSection } from "./HeroSection";
// We will add more imports here

const componentsMap: Record<string, React.FC<{ data: any }>> = {
  "HeroSection": HeroSection,
};

export function ModuleRenderer({ blocks }: { blocks: IPageBlock[] }) {
  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col w-full">
      {sortedBlocks.map((block) => {
        const Component = componentsMap[block.type];
        
        if (!Component) {
          return (
            <div key={block.id} className="p-4 border border-dashed border-red-500 text-red-500 m-2">
              Modulo no encontrado: {block.type}
            </div>
          );
        }

        return <Component key={block.id} data={block.data} />;
      })}
    </div>
  );
}
