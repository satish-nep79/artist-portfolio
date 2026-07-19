interface NavLinksProps {
  title: string;
  href: string;
  className?: string;
  onClick?: () => void;
}

const NavLinks = ({ title, href, className, onClick }: NavLinksProps) => {
  return (
    <a
      href={href}
      data-cursor="hover"
      className={`${className || ""}`}
      onClick={onClick}
    >
      {title}
    </a>
  );
};

export default NavLinks;
