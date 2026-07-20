import Button, {ButtonType} from "@/core/components/ui/Button";
import { DateHelper } from "@/core/utils/date_helper";
import type { ProgramModel } from "@/features/program_section/types/program_model";
import {
  ArrowCircleRightIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
} from "@phosphor-icons/react";

interface UpcomingProgramCardProps {
  programModel: ProgramModel;
  className?: string;
}

const UpcomingProgramCard = ({
  programModel,
  className,
}: UpcomingProgramCardProps) => {
  return (
    <div className={`relative w-full ${className} overflow-hidden`}>
      <img
        src={programModel.imageUrl}
        alt={`Artistic Program Image for ${programModel.title}`}
        className="absolute w-full h-full object-cover"
      />
      <div className="absolute bg-overlay-mask h-full w-full" />
      <div className="absolute h-full flex flex-col px-5 md:px-24 py-5 md:py-7 justify-between">
        <div className="flex flex-col gap-2">
          <div className="px-2 md:px-3 py-1 md:py-2 border border-primary text-primary font-bold w-fit">
            {programModel.tag.toUpperCase()}
          </div>
          <h3 className="text-2xl md:text-[2.5rem]">{programModel.title}</h3>
          <div className="flex flex-col md:flex-row gap-0 md:gap-8 text-text-primary">
            <div className="flex flex-row items-center gap-2">
              <CalendarIcon />
              {DateHelper.prettyDate(programModel.startDate)}{" "}
              {programModel.endDate
                ? ` - ${DateHelper.prettyDate(programModel.endDate)}`
                : ""}
            </div>
            <div className="flex flex-row items-center gap-2">
              <ClockIcon />
              {DateHelper.timeOnly(programModel.startDate)}{" "}
              {programModel.endDate
                ? ` - ${DateHelper.timeOnly(programModel.endDate)}`
                : ""}
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <MapPinIcon />
            {programModel.location}
          </div>
          <p className="line-clamp-1 md:line-clamp-2">
            {programModel.description}
          </p>
        </div>
        <Button
          label="Reserve Your Spot"
          icon={ArrowCircleRightIcon}
          buttonType={ButtonType.PRIMARY}
          onClick={() =>
            window.open(
              "https://www.example.com/botanical-watercolour-workshop",
              "_blank",
            )
          }
        />
      </div>
    </div>
  );
};

export default UpcomingProgramCard;
