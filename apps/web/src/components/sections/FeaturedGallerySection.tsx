import FeaturedArt from "@/components/ui/FeaturedArt";
import { galleryArtworks } from "@/data/dummy_data/gallery_artworks";
import Container from "../ui/Container";

const FeaturedGallerySection = () => {
  return (
    <Container id="gallery">
      <h2>Gallery</h2>
      <p className="text-body mb-8 mt-4">
        A Collection Of Visual Stories created through color, texture and
        imagination.
      </p>
      <div
        id="gallery"
        className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 justify-center gap-5"
      >
        {galleryArtworks.map((artwork) => (
          <div key={artwork.id} className="mb-4 break-inside-avoid">
            <FeaturedArt artwork={artwork} />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default FeaturedGallerySection;
