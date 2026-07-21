import Container from "@/core/components/ui/Container";
import InfoCard from "@/features/about_section/components/InfoCard";
import { InfoData } from "@/features/about_section/data/info_data";

const AboutSection = () => {
  return (
    <Container id="about" className="pt-28 md:pt-44 min-h-screen">
      <div className="flex flex-col w-full lg:flex-row gap-8 md:gap-11 ">
        <div className="flex-1 h-full p-4">
          <div className="group  w-full h-full p-6 overflow-hidden bg-glass-bg-2 border border-glass-border-2 hover:shadow-primary-glow transition-default">
            <img
              src="https://res.cloudinary.com/ioltw4a4/image/upload/f_auto,q_60,w_600/v1784217051/fauzan-saari-CWNXlkekBeA-unsplash_tummaf.jpg"
              alt="Artist Portrait"
              className="w-full h-full object-cover group-hover:scale-105 transition-default"
            />
          </div>
        </div>
        <div className="flex-1 h-full p-4 justify-center flex flex-col">
          <p className="text-primary font-bold">About The Artist</p>
          <h2>Bikram Nepali</h2>
          <div className="h-6" />
          <p>
            Born in Vienna and now based in Berlin, Elena Voss creates
            large-scale abstract works that exist at the intersection of emotion
            and materiality. Her practice spans over fifteen years of dedicated
            exploration.
          </p>
          <div className="h-4" />
          <p>
            Drawing inspiration from the natural world, architectural forms, and
            the human psyche, each piece is a meditation on the intangible —
            capturing fleeting moments of beauty, tension, and transcendence
            through layers of pigment, texture, and light.
          </p>
          <div className="h-12" />
          <h6 className="text-text-primary font-bold font-display">
            “I believe art should create a space for stillness—a quiet
            invitation to pause, reflect, and feel.”
          </h6>
          <div className="h-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {InfoData.map((info, index) => (
              <InfoCard
                key={index}
                label={info.label}
                title={info.title}
                description={info.description}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AboutSection;
