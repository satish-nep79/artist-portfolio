import Button, { ButtonType } from "@/core/components/ui/Button";
import type { Artwork } from "@/core/types/artwork";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";

interface ArtDetailViewProps {
  artwork: Artwork;
}

const ArtDetailView = ({ artwork }: ArtDetailViewProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 md:gap-11 lg:items-stretch">
      <div className="p-4 flex flex-col items-center justify-center">
        <div className=" w-fit group p-6 bg-glass-bg-2 border border-glass-border-2 hover:shadow-primary-glow transition-default">
          <img
            src={`${artwork.imageUrl}`}
            alt="Artist Portrait"
            className="max-h-[40vh] lg:max-h-[70vh] object-cover group-hover:scale-105 transition-default"
          />
        </div>
      </div>
      <div className="flex-1  p-4 flex flex-col justify-between">
        <div>
          <p className="text-primary font-bold">
            {artwork.category.toUpperCase()}
          </p>
          <h3>{artwork.title}</h3>
          <p className="text-text-body">
            <span>{artwork.medium}</span> · <span>{artwork.year}</span>
          </p>
          <div className="h-4" />
          <p className="font-bold">Size</p>
          <p className="text-text-body">
            {artwork.width} × {artwork.height} {artwork.measurementUnit}
          </p>
          <div className="h-4" />
          <p className="font-bold">About This Piece</p>
          <p className="text-text-body">
            {artwork.description ||
              "No description available for this artwork."}
          </p>
          <div className="h-4" />
          <p className="bg-glass-bg-2 border border-success text-success px-6 py-3 w-fit rounded-full text font-bold">
            {artwork.status.toUpperCase()}
          </p>
        </div>
        <div className="h-4" />
        <div>
          <h3 className="font-bold ">
            ${artwork.price?.toFixed(2)}
          </h3>
          <div className="h-12" />
          <div className="flex flex-col lg:flex-row w-full gap-4 items-start lg:items-center">
            <Button
              label="Request Purchase"
              icon={ArrowCircleRightIcon}
              onClick={() => {}}
              className="w-full lg:w-fit"
            />
            <Button
              label="Commission Similar"
              buttonType={ButtonType.SECONDARY}
              onClick={() => {}}
              className="w-full lg:w-fit"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtDetailView;
