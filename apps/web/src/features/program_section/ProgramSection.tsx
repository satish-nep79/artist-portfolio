import Container from "@/core/components/ui/Container";
import Carousel from "@/core/components/ui/Carousel";
import UpcomingProgramCard from "@/features/program_section/component/UpcomingProgramCard";
import { ProgramData } from "@/features/program_section/data/program_data";

const ProgramSection = () => {
  return (
    <Container id="programs" className="pt-28 md:pt-44 min-h-screen">
      <p className="text-primary font-bold">Programs</p>
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
          <UpcomingProgramCard
            programModel={program}
            className="h-96"
          />
        ))}
        autoPlay={true}
        loop={true}
        className="w-full h-96"
      ></Carousel>
    </Container>
  );
};

export default ProgramSection;
