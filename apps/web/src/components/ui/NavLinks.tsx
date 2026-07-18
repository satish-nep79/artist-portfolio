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
      className={`${className || ""}`}
    >
      {title}
    </a>
  );
};

export default NavLinks;
