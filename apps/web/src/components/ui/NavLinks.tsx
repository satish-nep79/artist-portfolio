interface NavLinksProps {
  title: string;
  href: string;
  className?: string;
}

const NavLinks = ({ title, href, className }: NavLinksProps) => {
  return (
    <a
      href={href}
      data-cursor="hover"
      className={`leading-5 text-text-primary font-bold hover:text-primary hover:text-shadow-glow ${className || ""}`}
    >
      {title}
    </a>
  );
};

export default NavLinks;
