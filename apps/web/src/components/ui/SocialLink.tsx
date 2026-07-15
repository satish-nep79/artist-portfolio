import React from "react";

interface SocialLinkProps {
  icon: React.ElementType;
  label?: string;
  href: string;
  size?: number;
}

const SocialLink = ({ icon: Icon, label, href, size = 16 }: SocialLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-text-primary flex items-center gap-2 hover:text-primary hover:text-shadow-glow"
    >
      <Icon width={size} height={size} /> {label}
    </a>
  );
};

export default SocialLink;
