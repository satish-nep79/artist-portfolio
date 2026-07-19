import ArtPieceComponent from "@/core/components/ui/FeaturedArt";
import { galleryArtworks } from "@/core/data/dummy_data/gallery_artworks";
import Container from "../../../core/components/ui/Container";
import Button from "@/core/components/ui/Button";
import ButtonType from "@/core/data/enums/ButonTypes";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";

const FeaturedGallerySection = () => {
  return (
    <Container id="gallery" className="pt-28 md:pt-44">
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
            <ArtPieceComponent artwork={artwork} />
          </div>
        ))}
      </div>
      <Button
        label="Explore All Artworks"
        onClick={() => {window.location.href = "/gallery"}}
        icon={ArrowCircleRightIcon}
        buttonType={ButtonType.PRIMARY}
        className="mt-12 mx-auto block"
      />
    </Container>
  );
};

export default FeaturedGallerySection;
