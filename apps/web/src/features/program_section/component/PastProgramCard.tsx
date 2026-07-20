import type { ProgramModel } from "@/features/program_section/types/program_model";
import { DateHelper } from "@/core/utils/date_helper";

interface PastProgramCardProps {
  program: ProgramModel;
}

const PastProgramCard = ({ program }: PastProgramCardProps) => {
  return (
    <div className="w-87.5 h-87.5 bg-bg-surface  shrink-0 snap-center overflow-hidden relative group hover:shadow-primary-glow">
      <img
        src={program.imageUrl}
        alt={program.title}
        className="w-full h-full object-cover hover:scale-105 transition-default"
      />
      <p className="absolute top-4 left-4 text-text-primary bg-glass-shadow backdrop-blur-sm border border-glass-border-2 text-text-on-primary px-3 py-1  text-xs font-bold">
        {program.tag.toUpperCase()}
      </p>
      <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-1 z-2 bg-overlay-75">
        <p className="text-primary">
          {DateHelper.prettyDate(program.startDate)}{" "}
          {program.endDate ? `- ${DateHelper.prettyDate(program.endDate)}` : ""}
        </p>
        <h6 className="text-[1.25rem] font-bold line-clamp-2">
          {program.title}
        </h6>
        <p className="text-text-body">{program.location}</p>
        <p className="text-text-body">
          {program.endDate
            ? `${DateHelper.prettyDuration(program.startDate, program.endDate)}`
            : "1 day"}
        </p>
      </div>
      <div className="absolute inset-0 h-full w-full z-10 border-8 border-glass-border pointer-events-none" />
    </div>
  );
};

export default PastProgramCard;
