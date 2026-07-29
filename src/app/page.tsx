import { MasonryGallery } from "@/components/MasonryGallery";
import { getAllImages } from "@/data/portfolio";

export default function HomePage() {
  const images = getAllImages();

  return <MasonryGallery images={images} />;
}
