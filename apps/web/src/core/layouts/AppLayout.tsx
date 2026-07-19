import { Outlet } from "react-router-dom";

import Navbar from "@/core/components/layout/Navbar";
import Footer from "@/core/components/layout/Footer";
import CustomCursor from "@/core/components/ui/CustomCursor";

const AppLayout = () => {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AppLayout;
