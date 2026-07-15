import Container from "@/components/ui/Container";
import MonoLogo from "@/assets/logos/mono_logo.svg";
import NavLinks from "@/components/ui/NavLinks";
import CustomButton from "../ui/CustomButton";
import ButtonType from "@/data/enums/ButonTypes";

function Navbar() {
  return (
    <header className="fixed top-16 left-0 w-full z-50">
      <Container>
        <nav className="flex items-center justify-between bg-glass-bg rounded-full backdrop-blur-lg px-16 py-3 shadow-nav-glow border border-glass-border">
          <img
            data-cursor="hover"
            src={MonoLogo}
            alt="Logo"
            width="32px"
            className="bg-transparent"
          />
          <ul className="nav-links flex gap-8">
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
          <CustomButton
            label="Inquiry"
            onClick={() => (window.location.href = "#contact")}
            buttonType={ButtonType.PRIMARY}
          />
        </nav>
      </Container>
    </header>
  );
}

export default Navbar;
