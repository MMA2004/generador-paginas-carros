import { type IPageBlock } from "@/models/Page";
import { HeroSection } from "./HeroSection";
import { GallerySection } from "./GallerySection";
import { SpecsSection } from "./SpecsSection";
import { PricingSection } from "./PricingSection";
import { ColorsSection } from "./ColorsSection";
import { FeatureSection } from "./FeatureSection";
import { VideoSection } from "./VideoSection";

const componentsMap: Record<string, React.FC<{ data: any, template?: string }>> = {
  "HeroSection": HeroSection,
  "GallerySection": GallerySection,
  "SpecsSection": SpecsSection,
  "PricingSection": PricingSection,
  "ColorsSection": ColorsSection,
  "FeatureSection": FeatureSection,
  "VideoSection": VideoSection,
};

export function ModuleRenderer({ blocks, template }: { blocks: IPageBlock[], template?: string }) {
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

        return <Component key={block.id} data={block.data} template={template} />;
      })}
    </div>
  );
}
