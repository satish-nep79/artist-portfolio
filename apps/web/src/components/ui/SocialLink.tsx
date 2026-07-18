import React from "react";

interface SocialLinkProps {
  icon: React.ElementType;
  label?: string;
  href: string;
  size?: number;
}

const SocialLink = ({
  icon: Icon,
  label,
  href,
  size = 16,
}: SocialLinkProps) => {
  return (
    <a
      data-cursor="hover"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2"
    >
      <Icon
        width={size}
        height={size}
        className="hover:scale-110 transition-default"
      />{" "}
      {label}
    </a>
  );
};

export default SocialLink;
