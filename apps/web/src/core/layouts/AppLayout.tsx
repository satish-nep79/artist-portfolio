import { Outlet } from "react-router-dom";

import Navbar from "@/core/components/layout/Navbar";
import Footer from "@/core/components/layout/Footer";
import ScrollToTop from "../components/ui/ScrollToTop";

const AppLayout = () => {
  return (
    <>
      {/* TODO: Add custom cursor back in when ready */}
      {/* <CustomCursor /> */}
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AppLayout;
