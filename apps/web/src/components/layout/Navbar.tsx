import Container from "@/components/ui/Container";
import MonoLogo from "@/assets/logos/mono_logo.svg";
import NavLinks from "@/components/ui/NavLinks";
import Button from "../ui/Button";
import ButtonType from "@/data/enums/ButonTypes";
import { ListIcon} from "@phosphor-icons/react";

function Navbar() {
  return (
    <header className="fixed top-8 md:top-16 left-0 w-full z-50">
      <Container>
        <nav className="flex items-center justify-between bg-glass-bg rounded-full backdrop-blur-lg px-6 py-3 lg:px-16 shadow-nav-glow border border-glass-border">
          <img
            data-cursor="hover"
            src={MonoLogo}
            alt="Logo"
            className="w-8 h-auto"
          />
          <ul className="nav-links hidden md:flex  md:gap-4 lg:gap-6">
            <li>
              <NavLinks title="Home" href="/#hero" />
            </li>
            <li>
              <NavLinks title="Gallery" href="/#gallery" />
            </li>
            <li>
              <NavLinks title="About" href="/#about" />
            </li>
            <li>
              <NavLinks title="Programs" href="/#programs" />
            </li>
            <li>
              <NavLinks title="Work With Me" href="/#work-with-me" />
            </li>
          </ul>
          <Button
            label="Inquiry"
            onClick={() => (window.location.href = "#contact")}
            className="hidden md:block"
          />
          <ListIcon
            size={32}
            className="md:hidden cursor-pointer"
            data-cursor="hover"
          />
        </nav>
      </Container>
    </header>
  );
}

export default Navbar;
