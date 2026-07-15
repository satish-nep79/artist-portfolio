import Container from "@/components/ui/Container";
import ButtonType from "@/data/enums/ButonTypes";
import Button from "@/components/ui/Button";
import { ArrowRightIcon } from "@phosphor-icons/react";
import SocialLink from "@/components/ui/SocialLink";
import {
  InstagramLogoIcon,
  FacebookLogoIcon,
  XLogoIcon,
  LinkedinLogoIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react";

const HeroSection = () => {
  return (
    <Container id="hero">
      <div className="hidden md:block absolute right-0 top-0 w-200 h-200 rounded-full bg-radial-glow blur-400 p-0 m-0 mr-0 items-end justify-end"></div>
      <div className="w-full h-screen flex flex-col md:flex-row pb-7.5 md:pb-15  pt-28 md:pt-44">
        <div className="flex-1 h-full flex flex-col items-start justify-center">
          <div className="flex flex-col items-start">
            <h1 className="font-display font-bold text-text-primary text-4xl md:text-8xl tracking-wide leading-10 md:leading-tight">
              BIKRAM
            </h1>
            <p className="font-sans font-normal text-text-secondary text-xs md:text-2xl gap-0.5 tracking-wider">
              ARTIST <span className="text-primary">·</span> VISUAL STORYTELLER{" "}
              <span className="text-primary text-xl">·</span> CREATOR
            </p>
          </div>
          <p className="mt-6 md:mt-11 font-sans font-normal text-text-body text-xs md:text-2xl gap-0.5 tracking-wider leading-5 md:leading-9">
            Turning emotion into visual stories through <br /> color, texture,
            and form.
          </p>
          <div className="w-full md:w-auto flex flex-row mt-6 md:mt-11 gap-8 md:gap-12">
            <Button
              label="Explore Gallery"
              icon={ArrowRightIcon}
              onClick={() => {
                window.location.href = "#gallery";
              }}
            />
            <Button
              label="Get in Touch"
              buttonType={ButtonType.OUTLINED}
              onClick={() => {
                window.location.href = "#contact";
              }}
            />
          </div>
          <div className="w-full md:w-auto flex flex-row mt-6 md:mt-11 gap-4 md:gap-8">
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
        <div className="flex-1 h-full bg-glass-bg-2">Right</div>
      </div>
    </Container>
  );
};

export default HeroSection;
