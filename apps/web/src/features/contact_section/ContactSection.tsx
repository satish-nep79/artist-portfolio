import Container from "@/core/components/ui/Container";
import ContactDetails from "@/features/contact_section/component/ContactDetails";
import ContactForm from "@/features/contact_section/component/ContactForm";

const ContactSection = () => {
  return (
    <Container id="contact" className="pt-28 md:pt-44 min-h-screen pb-10 md:pb-20">
      <div className="flex flex-col w-full h-fit lg:flex-row gap-8 md:gap-11">
        <div className="flex-1 h-auto p-4 flex flex-col">
          <ContactForm />
        </div>
        <div className="flex-1 h-auto p-4">
          <ContactDetails />
        </div>
      </div>
    </Container>
  );
};

export default ContactSection;
