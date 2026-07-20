import Button from "@/core/components/ui/Button";
import Container from "@/core/components/ui/Container";

import ServiceCard from "@/features/work_with_me_section/component/ServiceCard";

import {
  PaletteIcon,
  MagicWandIcon,
  ImageIcon,
  ChalkboardTeacherIcon,
  HandshakeIcon,
  BankIcon,
  ArrowDownIcon,
} from "@phosphor-icons/react";
import { title } from "framer-motion/m";

const WorkWithMeSection = () => {
  return (
    <Container id="work-with-me" className="pt-28 md:pt-44 min-h-screen">
      <p className="text-primary font-bold">WORK WITH ME</p>
      <div className="h-2.5" />
      <h2>Let's Create Something Meaningful</h2>
      <div className="h-2.5" />
      <p className="text-text-body">
        Whether you're looking to acquire original artwork, commission a bespoke
        piece, exhibit a collection, or transform a space through art, I'd love
        to explore the possibilities with you.
      </p>
      <div className="h-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard
          icon={PaletteIcon}
          title="Original Artwork"
          description="Purchase original paintings and one-of-a-kind works directly from the studio or current exhibitions.1"
        />
        <ServiceCard
          icon={MagicWandIcon}
          title="Commissioned Artwork"
          description="Collaborate on a bespoke piece tailored to your ideas, creating artwork that is deeply personal and uniquely yours."
        />
        <ServiceCard
          icon={ImageIcon}
          title="Exhibitions & Galleries"
          description="Available for solo and group exhibitions, gallery partnerships, cultural events, and curated artistic showcases."
        />
        <ServiceCard
          icon={ChalkboardTeacherIcon}
          title="Workshops & Art Programs"
          description="Engaging workshops, artist talks, and creative programs designed to inspire, educate, and bring communities together through art."
        />
        <ServiceCard
          icon={HandshakeIcon}
          title="Creative Collaborations"
          description="Open to partnerships with brands, organizations, publishers, designers, and fellow creatives on meaningful artistic projects."
        />
        <ServiceCard
          icon={BankIcon}
          title="Art for Spaces"
          description="Create custom artwork that complements homes, cafés, restaurants, hotels, offices, and other spaces with a distinctive artistic identity."
        />
      </div>
      <div className="py-16 text-center my-16">
        <h3>“Every canvas begins as a blank space.</h3>
        <h3> Every collaboration begins with a shared vision”</h3>
      </div>
      <Button
        label="Get in Touch"
        icon={ArrowDownIcon}
        onClick={() => {
          window.location.href = "#contact";
        }}
        className="mx-auto"
      />
    </Container>
  );
};

export default WorkWithMeSection;
