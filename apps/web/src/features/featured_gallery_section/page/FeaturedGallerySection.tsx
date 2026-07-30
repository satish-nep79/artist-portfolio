import ArtPieceComponent from "@/core/components/ui/FeaturedArt";
import { galleryArtworks } from "@/core/data/dummy_data/gallery_artworks";
import Container from "../../../core/components/ui/Container";
import Button, { ButtonType } from "@/core/components/ui/Button";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";
import CategoryBar from "../components/CategoryBar";
import { useMemo, useState } from "react";
import CustomDialog from "@/core/components/ui/CustomDialog";
import type { Artwork } from "@/core/types/artwork";
import ArtDetailView from "@/features/art_details/ArtDetailView";

const FeaturedGallerySection = () => {
  const categories = [
    "All Categories",
    "Painting",
    "Photography",
    "Abstract Art",
    "Drawing",
    "Conceptual Art",
  ];

  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Memoize filtered items to prevent recalculating on every frame/render
  const filteredArtworks = useMemo(() => {
    return galleryArtworks.filter(
      (artwork) =>
        activeCategory === "All Categories" ||
        artwork.category === activeCategory,
    );
  }, [activeCategory]);

  return (
    <>
      <Container id="gallery" className="pt-28 md:pt-44">
        <h2>Gallery</h2>
        <p className="text-body mt-4">
          A Collection Of Visual Stories created through color, texture and
          imagination.
        </p>
        <CategoryBar
          categories={categories}
          initialCategory={activeCategory}
          onCategoryClick={(index) => setActiveCategory(categories[index])}
        />
        <div
          id="gallery"
          className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 justify-center gap-5 transition-default"
        >
          {filteredArtworks.map((artwork, _) => (
            <ArtPieceComponent
              key={artwork.id}
              artwork={artwork}
              className="inline-block w-full h-auto mb-5 break-inside-avoid align-top"
              onClick={() => {
                setIsDialogOpen(true);
                setSelectedArtwork(artwork);
              }}
            />
          ))}
        </div>
        <Button
          label="Explore All Artworks"
          onClick={() => {
            window.location.href = "/gallery";
          }}
          icon={ArrowCircleRightIcon}
          buttonType={ButtonType.PRIMARY}
          className="mt-12 mx-auto block"
        />
      </Container>
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => {
          console.log("Dialog closed");
          setIsDialogOpen(false);
          setSelectedArtwork(null);
        }}
      >
        {selectedArtwork && <ArtDetailView artwork={selectedArtwork} />}
      </CustomDialog>
    </>
  );
};

export default FeaturedGallerySection;
