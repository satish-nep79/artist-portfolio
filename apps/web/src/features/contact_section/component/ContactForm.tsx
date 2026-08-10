import TextField from "@/core/components/ui/TextField";
import TextArea from "@/core/components/ui/TextArea";
import Dropdown from "@/core/components/ui/DropDown";
import type { DropdownOption } from "@/core/components/ui/DropDown";
import Button from "@/core/components/ui/Button";
import { ButtonType } from "@/core/components/ui/buttonTypes";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/index.js";
import type { GeneralInquiryValues } from "@/core/utils/custom_validator";
import { generalInquirySchema } from "@/core/utils/custom_validator";
import { useState } from "react";

import { toast } from "@/core/components/ui/toast/toast.store";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GeneralInquiryValues>({
    resolver: zodResolver(generalInquirySchema),
  });

  const onSubmit = (data: GeneralInquiryValues) => {
    setSubmittingForm(true);
    // Simulate form submission delay
    setTimeout(() => {
      console.log("Form submitted:", data);
      setSubmittingForm(false);
      toast.success({
        title: "Inquiry submitted successfully!",
        message: "Thank you for reaching out. I will get back to you soon.",
      });
    }, 2000);
  };

  const [submittingForm, setSubmittingForm] = useState(false);

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
        className="flex flex-col gap-4 flex-1 justify-between"
        onSubmit={handleSubmit(onSubmit)}
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
            validator={register("fullName")}
            error={errors.fullName?.message}
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            isRequired={true}
            validator={register("email")}
            error={errors.email?.message}
          />
        </div>
        <Dropdown
          id="purpose"
          name="purpose"
          label="Purpose of Inquiry"
          isRequired={true}
          options={purposeOptions}
          validator={register("purpose")}
          error={errors.purpose?.message}
        />
        <TextArea
          id="message"
          name="message"
          label="Message"
          placeholder="Tell me a little about your idea..."
          validator={register("message")}
          error={errors.message?.message}
        />
        <p className="text-text-body text-caption">
          I personally review every inquiry and usually reply within 2–3
          business days.
        </p>
        <Button
          label="Send Message"
          buttonType={ButtonType.PRIMARY}
          type="submit"
          isLoading={submittingForm}
          icon={ArrowCircleRightIcon}
        />
      </form>
    </div>
  );
};

export default ContactForm;
