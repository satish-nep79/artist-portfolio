import SocialLink from "@/core/components/ui/SocialLink";

import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  InstagramLogoIcon,
  FacebookLogoIcon,
  XLogoIcon,
  LinkedinLogoIcon,
  ClockIcon,
} from "@phosphor-icons/react";

const ContactDetails = () => {
  return (
    <div className="h-full w-full bg-glass-bg-2 border border-glass-border-2 p-6 flex flex-col gap-4 justify-between">
      <div className="border-b border-glass-border-2">
        <p className="text-text-secondary text-caption font-bold">BASED IN</p>
        <div className="h-4" />
        <div className="flex items-center gap-2.5 mb-3 ">
          <MapPinIcon size={16} />
          <p className="text-text-body">Pokhara, Nepal</p>
        </div>
      </div>
      <div className="border-b border-glass-border-2">
        <p className="text-text-secondary text-caption font-bold">
          AVAILABLE FOR
        </p>
        <div className="h-4" />
        <div className="flex flex-col gap-2.5 mb-3 items-start">
          <p>Original Artwork Inquiries</p>
          <p>Private Commissions</p>
          <p>Exhibitions</p>
          <p>Workshops</p>
          <p>Collaborations</p>
        </div>
      </div>
      <div className="border-b border-glass-border-2">
        <p className="text-text-secondary text-caption font-bold">EMAIL</p>
        <div className="h-4" />
        <div className="flex items-center gap-2.5 mb-3 ">
          <EnvelopeIcon size={16} />
          <p className="text-text-body">contact@artistname.com</p>
        </div>
      </div>
      <div className="border-b border-glass-border-2">
        <p className="text-text-secondary text-caption font-bold">
          CONTACT NUMBER
        </p>
        <div className="h-4" />
        <div className="flex items-center gap-2.5 mb-3 ">
          <PhoneIcon size={16} />
          <p className="text-text-body">+977 9800000000</p>
        </div>
      </div>
      <div className="border-b border-glass-border-2">
        <p className="text-text-secondary text-caption font-bold">
          FOLLOW ME ON
        </p>
        <div className="h-4" />
        <div className="flex items-center gap-4 mb-3 ">
          <SocialLink
            icon={InstagramLogoIcon}
            href="https://www.instagram.com/"
            size={32}
          />
          <SocialLink
            icon={FacebookLogoIcon}
            href="https://www.facebook.com/"
            size={32}
          />
          <SocialLink icon={XLogoIcon} href="https://x.com/" size={32} />
          <SocialLink
            icon={LinkedinLogoIcon}
            href="https://www.linkedin.com/"
            size={32}
          />
        </div>
      </div>
      <div>
        <p className="text-text-secondary text-caption font-bold">
          RESPONSE TIME
        </p>
        <div className="h-4" />
        <div className="flex items-center gap-2.5">
          <ClockIcon size={16} />
          <p className="text-text-body">Usually within 2-3 Business Days</p>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
