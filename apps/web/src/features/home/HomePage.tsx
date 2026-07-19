import HomeSection from "@/features/hero_section/page/HeroSection";
import FeaturedGallerySection from "@/features/featured_gallery_section/page/FeaturedGallerySection";
import AboutSection from "@/features/about_section/AboutSection";
import ContactSection from "@/features/contact_section/ContactSection";
import ProgramSection from "@/features/program_section/ProgramSection";
import  WorkWithMeSection from "@/features/work_with_me_section/WorkWithMeSection";

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