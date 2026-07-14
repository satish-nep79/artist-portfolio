import { Outlet } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const AppLayout = () => {
  return (
    <main>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </main>
  );
};

export default AppLayout;
