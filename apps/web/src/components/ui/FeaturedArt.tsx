import type { Artwork } from "@/types/artwork";
import { ArrowCircleUpRightIcon } from "@phosphor-icons/react";

interface FeaturedArtProps {
  artwork: Artwork;
}

const FeaturedArt = ({ artwork }: FeaturedArtProps) => {
  return (
    <div className="group overflow-hidden m-auto w-fit relative">
      <img
        src={artwork.imageUrl}
        alt={artwork.title}
        className="max-w-full max-h-[65vh] object-fit group-hover:scale-105 transition-default"
      />
      <div className="absolute inset-0 h-full w-full bg-overlay-horizontal flex-col justify-between items-end px-6 py-6 hidden group-hover:flex transition-default">
        <ArrowCircleUpRightIcon
          height={32}
          width={32}
          className="text-primary"
        />
        <div className="w-full text-left">
          <p className="text-base text-primary">{artwork.category}</p>
          <h6>{artwork.title}</h6>
          <p className="text-text-body">
            <span>{artwork.medium}</span> · <span>{artwork.year}</span>
          </p>
        </div>
      </div>
      <div className="absolute inset-0 h-full w-full z-10 border-8 border-glass-border-2 pointer-events-none"></div>
    </div>
  );
};

export default FeaturedArt;
