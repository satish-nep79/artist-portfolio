import Container from "@/core/components/ui/Container";
import Carousel from "@/core/components/ui/Carousel";
import UpcomingProgramCard from "@/features/program_section/component/UpcomingProgramCard";
import PastProgramCard from "@/features/program_section/component/PastProgramCard";
import { ProgramData } from "@/features/program_section/data/program_data";
import { PastProgramData } from "@/features/program_section/data/past_program";

const ProgramSection = () => {
  return (
    <Container id="programs" className="pt-28 md:pt-44 min-h-screen">
      <p className="text-primary font-bold">PROGRAMS</p>
      <div className="h-2.5" />
      <h2>Creating Art Beyond the Canvas</h2>
      <div className="h-2.5" />
      <p className="text-text-body">
        Sharing creativity through workshops, exhibitions and community
        experiences.
      </p>
      <div className="h-6" />
      <Carousel
        items={ProgramData.map((program) => (
          <UpcomingProgramCard programModel={program} className="h-96" />
        ))}
        autoPlay={true}
        loop={true}
        className="w-full h-96"
      ></Carousel>
      <div className="h-9" />
      <p className="text-primary font-bold">ARCHIVE</p>
      <div className="h-2.5" />
      <p className="text-text-body">
        Browse workshops, exhibitions and creative experiences from previous
        years.
      </p>
      <div className="flex overflow-x-auto snap-x mandatory gap-6 scroll-auto scrollbar-hide scrollbar-none px-3 py-3 md:px-6 md:py-6">
        {PastProgramData.map((program) => (
          <PastProgramCard program={program} key={program.id} />
        ))}
      </div>
    </Container>
  );
};

export default ProgramSection;
