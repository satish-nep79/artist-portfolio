import TextField from "@/core/components/ui/TextField";
import TextArea from "@/core/components/ui/TextArea";
import Dropdown from "@/core/components/ui/DropDown";
import type { DropdownOption } from "@/core/components/ui/DropDown";
import Button, { ButtonType } from "@/core/components/ui/Button";
import {ArrowCircleRightIcon} from "@phosphor-icons/react";

const purposeOptions: DropdownOption[] = [
  { value: "creative-collaboration", label: "Creative Collaboration" },
  { value: "exhibition-opportunity", label: "Exhibition Opportunity" },
  { value: "workshop-art-program", label: "Workshop / Art Program" },
  { value: "commercial-project", label: "Commercial Project" },
  { value: "press-media", label: "Press & Media" },
  { value: "speaking-invitation", label: "Speaking Invitation" },
  { value: "general-inquiry", label: "General Inquiry" },
];

const ContactForm = () => {
  return (
    <div className="h-full w-full flex flex-col justify-between">
      <p className="text-primary font-bold">INQUIRE</p>
      <div className="h-2.5" />
      <h2>Let's Start a Conversation</h2>
      <div className="h-2.5" />
      <p className="text-text-body">
        Whether you're interested in a commission, a collaboration, or simply
        wish to say hello, I'd love to hear from you.
      </p>
      <div className="h-6" />
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
        action=""
        method="post"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <TextField
            id="name"
            name="name"
            type="text"
            label="Full Name"
            isRequired={true}
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            isRequired={true}
          />
        </div>
        <Dropdown
          id="purpose"
          name="purpose"
          label="Purpose of Inquiry"
          options={purposeOptions}
          isRequired={true}
        />
        <TextArea
          id="message"
          name="message"
          label="Message"
          placeholder="Tell me a little about your idea..."
        />
        <p className="text-text-body text-caption">
          I personally review every inquiry and usually reply within 2–3
          business days.
        </p>
        <div className="h-12" />
        <Button
          label="Send Message"
          buttonType={ButtonType.PRIMARY}
          onClick={() => {}}
          icon={ArrowCircleRightIcon}
        />
      </form>
    </div>
  );
};

export default ContactForm;
