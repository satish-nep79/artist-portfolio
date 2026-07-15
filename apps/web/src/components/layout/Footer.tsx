import Container from "@/components/ui/Container";
import Logo from "@/assets/logos/logo_main.svg";
import NavLinks from "@/components/ui/NavLinks";
import {
  InstagramLogoIcon,
  FacebookLogoIcon,
  XLogoIcon,
  LinkedinLogoIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react";
import SocialLink from "@/components/ui/SocialLink";

function Footer() {
  return (
    <footer className="bg-glass-bg-2 border-t border-glass-border-2 py-3 sm:py-4 lg:py-6">
      <Container>
        <p className="text-text-primary text-center text-2xl md:text-3xl lg:text-3xl font-display pb-6 border-b border-glass-border-2">
          “Art invites us to slow down, look closer, and discover something
          new.”
        </p>
        <div className="flex flex-col md:flex-row gap-y-3  items-start text-center md:text-left py-6 border-b border-glass-border-2 gap-x-5 justify-between">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-y-3 lg:w-xl">
            <img src={Logo} alt="Logo" className="w-40 h-auto" />
            <p className="text-text-secondary">
              Painter exploring portrait, mixed media, and watercolor. Creating
              work that connects stories, people, and places.
            </p>
          </div>
          <div className="w-auto" />
          <div className="flex flex-row justify-between w-full md:w-auto md:gap-x-12">
            <div className="wrap text-left">
              <p className="text-text-secondary mb-6">Explore</p>
              <ul>
                <li>
                  <NavLinks title="Gallery" href="/gallery" />
                </li>
                <li>
                  <NavLinks title="About" href="/#about" />
                </li>
                <li>
                  <NavLinks title="Programs" href="/programs" />
                </li>
                <li>
                  <NavLinks title="Work With Me" href="/#work-with-me" />
                </li>
              </ul>
            </div>
            <div className="wrap text-left">
              <p className="text-text-secondary mb-6">Connect</p>
              <ul>
                <li>
                  <SocialLink
                    icon={InstagramLogoIcon}
                    label="Instagram"
                    href="https://www.instagram.com/"
                  />
                </li>
                <li>
                  <SocialLink
                    icon={XLogoIcon}
                    label="X (Twitter)"
                    href="https://x.com/"
                  />
                </li>
                <li>
                  <SocialLink
                    icon={FacebookLogoIcon}
                    label="Facebook"
                    href="https://www.facebook.com/"
                  />
                </li>
                <li>
                  <SocialLink
                    icon={LinkedinLogoIcon}
                    label="LinkedIn"
                    href="https://www.linkedin.com/"
                  />
                </li>
                <li>
                  <SocialLink
                    icon={EnvelopeSimpleIcon}
                    label="Email"
                    href="mailto:info@bikramnepali.com"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="py-6 flex flex-col md:flex-row gap-y-3 justify-between items-center text-center md:text-left ">
          <p className="text-text-body">
            &copy; {new Date().getFullYear()} Bikram Nepali. All rights
            reserved.
          </p>
          <p>
            Designed & Developed by
            <a
              href="https://www.satishnepali.com.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              Satish Nepali
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
