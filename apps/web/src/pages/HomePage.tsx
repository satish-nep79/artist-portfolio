import HomeSection from "@/components/sections/HeroSection";
import FeaturedGallerySection from "@/components/sections/FeaturedGallerySection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import ProgramSection from "@/components/sections/ProgramSection";
import  WorkWithMeSection from "@/components/sections/WorkWithMeSection";

const HomePage = () => {
  return (
    <div>
      <HomeSection />
      <FeaturedGallerySection />
      <AboutSection />
      <ProgramSection />
      <WorkWithMeSection />
      <ContactSection />
    </div>
  )
}

export default HomePage