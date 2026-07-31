import ArtPieceComponent from "@/core/components/ui/FeaturedArt";
import Container from "../../../core/components/ui/Container";
import Button, { ButtonType } from "@/core/components/ui/Button";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";
import CategoryBar from "../components/CategoryBar";
import { useEffect, useMemo, useState } from "react";
import CustomDialog from "@/core/components/ui/CustomDialog";
import type { Artwork } from "@/core/types/artwork";
import ArtDetailView from "@/features/art_details/ArtDetailView";

import { ArtworkApi } from "@/core/data/artwork_api";
import type { Category } from "@/core/types/category_type";
import { CategoryApi } from "@/core/data/categories_api";

const FeaturedGallerySection = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [galleryArtworks, setGalleryArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    const fetchGalleryArtworks = async () => {
      setLoading(true);
      const categories = await CategoryApi.getAll();
      const artworks = await ArtworkApi.getLatest();
      setGalleryArtworks(artworks);
      const filteredCategories = categories.filter((category) =>
        artworks.some((artwork) => artwork.category === category.id),
      );
      setCategories([{ id: "all", title: "All" }, ...filteredCategories]);
      setLoading(false);
    };

    fetchGalleryArtworks();
  }, []);

  const filteredArtworks = useMemo(() => {
    return galleryArtworks.filter(
      (artwork) =>
        activeCategory === undefined ||
        activeCategory.id === "all" ||
        artwork.category === activeCategory.id,
    );
  }, [galleryArtworks, activeCategory]);

  return (
    <>
      <Container id="gallery" className="pt-28 md:pt-44">
        <h2>Gallery</h2>
        <p className="text-body mt-4">
          A Collection Of Visual Stories created through color, texture and
          imagination.
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <CategoryBar
            categories={categories}
            initialCategory={activeCategory!}
            onCategoryClick={(index) => setActiveCategory(categories[index])}
          />
        )}
        <div
          id="gallery"
          className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 justify-center gap-5 transition-default"
        >
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            filteredArtworks.map((artwork, _) => (
              <ArtPieceComponent
                key={artwork.id}
                artwork={artwork}
                className="inline-block w-full h-auto mb-5 break-inside-avoid align-top"
                onClick={() => {
                  setIsDialogOpen(true);
                  setSelectedArtwork(artwork);
                }}
              />
            ))
          )}
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
