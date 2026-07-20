import ArtPieceComponent from "@/core/components/ui/FeaturedArt";
import { galleryArtworks } from "@/core/data/dummy_data/gallery_artworks";
import Container from "../../../core/components/ui/Container";
import Button, {ButtonType} from "@/core/components/ui/Button";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";
import CategoryBar from "../components/CategoryBar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  const filteredArtworks = galleryArtworks.filter(
    (artwork) =>
      activeCategory === "All Categories" ||
      artwork.category === activeCategory,
  );

  return (
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
        <AnimatePresence mode="popLayout">
          {filteredArtworks.map((artwork) => (
            <motion.div
              key={artwork.id}
              layout // Smoothly animates position changes when other elements disappear
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="inline-block w-full mb-5 break-inside-avoid" // Essential for CSS columns
            >
              <ArtPieceComponent artwork={artwork} />
            </motion.div>
          ))}
        </AnimatePresence>
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
  );
};

export default FeaturedGallerySection;
