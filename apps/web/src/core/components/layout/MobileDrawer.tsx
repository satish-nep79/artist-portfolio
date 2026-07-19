import { useEffect } from "react";
import MonoLogo from "@/assets/logos/mono_logo.svg";
import { XCircleIcon } from "@phosphor-icons/react";
import NavLinks from "@/core/components/ui/NavLinks";
import Button from "../ui/Button";
import SocialLink from "@/core/components/ui/SocialLink";
import {
  InstagramLogoIcon,
  FacebookLogoIcon,
  XLogoIcon,
  LinkedinLogoIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react";

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <nav className="fixed inset-0 z-50 h-screen flex flex-col justify-between content-between px-5 py-8 bg-bg-surface">
      <div className="flex items-center justify-between px-6 py-3 lg:px-16 ">
        <img
          data-cursor="hover"
          src={MonoLogo}
          alt="Logo"
          className="w-8 h-auto"
        />
        <XCircleIcon
          size={32}
          className="cursor-pointer"
          data-cursor="hover"
          onClick={onClose}
        />
      </div>
      <ul className="nav-links gap-8 flex flex-col  justify-center">
        <li>
          <NavLinks
            title="Home"
            href="/#hero"
            className="text-4xl font-bold font-display"
            onClick={onClose}
          />
        </li>
        <li>
          <NavLinks
            title="Gallery"
            href="/#gallery"
            className="text-4xl font-bold font-display"
            onClick={onClose}
          />
        </li>
        <li>
          <NavLinks
            title="About"
            href="/#about"
            className="text-4xl font-bold font-display"
            onClick={onClose}
          />
        </li>
        <li>
          <NavLinks
            title="Programs"
            href="/#programs"
            className="text-4xl font-bold font-display"
            onClick={onClose}
          />
        </li>
        <li>
          <NavLinks
            title="Work With Me"
            href="/#work-with-me"
            className="text-4xl font-bold font-display"
            onClick={onClose}
          />
        </li>
      </ul>
      <div>
        <Button
          label="Inquiry"
          onClick={() => {
            onClose();
            (window.location.href = "#contact")
          }}
          className="w-full"
        />
        <div className="w-full md:w-auto flex flex-row mt-6 md:mt-11 gap-4 md:gap-8 justify-between items-center">
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
          <SocialLink
            icon={EnvelopeSimpleIcon}
            href="mailto:info@bikramnepali.com"
            size={32}
          />
        </div>
      </div>
    </nav>
  );
}
