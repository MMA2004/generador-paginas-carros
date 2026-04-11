import mongoose, { Schema, Document } from "mongoose";

export interface IPageBlock {
  id: string; // unique literal id per block
  type: string; // e.g. "HeroSection", "GallerySection"
  order: number;
  data: any; // Flexible JSON
}

export interface IPage extends Document {
  userId: string; // The user who owns this page (clerkUserId)
  brand: string; // e.g. "toyota"
  slug: string; // e.g. "corolla-2024"
  title: string; // Internal title for the dashboard
  template: string; // "luxury_minimal", "sport_dynamic", "classic_maserati"
  published: boolean;
  blocks: IPageBlock[];
  createdAt: Date;
  updatedAt: Date;
}

const PageBlockSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  order: { type: Number, required: true },
  data: { type: Schema.Types.Mixed, default: {} }
}, { _id: false });

const PageSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    brand: { type: String, required: true, lowercase: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    template: { type: String, default: "luxury_minimal" },
    published: { type: Boolean, default: false },
    blocks: [PageBlockSchema],
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness of brand + slug
PageSchema.index({ brand: 1, slug: 1 }, { unique: true });

export default mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);
