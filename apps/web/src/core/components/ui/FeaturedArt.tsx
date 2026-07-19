import type { Artwork } from "@/core/types/artwork";
import { ArrowCircleUpRightIcon } from "@phosphor-icons/react";

interface ArtPieceComponent {
  artwork: Artwork;
  className?: string;
  isFeatured?: boolean;
}

const ArtPieceComponent = ({
  artwork,
  className,
  isFeatured,
}: ArtPieceComponent) => {
  return (
    <div
      className={`group overflow-hidden m-auto w-fit h-fit relative ${className || ""}`}
    >
      <img
        src={artwork.imageUrl}
        alt={artwork.title}
        className={`max-w-full  ${isFeatured ? "max-h-[60vh]" : ""} object-fit group-hover:scale-105 transition-default w-full h-fit`}
      />
      <div className="absolute inset-0 h-full w-full bg-overlay-vertical flex-col justify-between items-end px-6 py-6 flex md:opacity-0 group-hover:opacity-100 transition-default">
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

export default ArtPieceComponent;
