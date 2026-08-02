import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/core/router/routes";

import AppLayout from "@/core/layouts/AppLayout";
import HomePage from "@/features/home/HomePage";
import GalleryPage from "@/features/gallery_page/GalleryPage";
import ProgramsPage from "@/features/ProgramsPage";
import NotFoundPage from "@/features/NotFoundPage";
import PurchaseInquiryScreen from "@/features/purchase_inquiry/PurchaseInquiryScreen";
import CustomArtworkInquiry from "@/features/custom_artwork_inquiry/CustomArtworkInquiry";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        path: "/",
        element: <HomePage />,
      },
      {
        path: ROUTES.GALLERYPage(),
        element: <GalleryPage />,
      },
      {
        path: ROUTES.PROGRAMSPage(),
        element: <ProgramsPage />,
      },
      {
        path: ROUTES.PURCHASE_INQUIRY(),
        element: <PurchaseInquiryScreen />,
      },
      {
        path: ROUTES.CUSTOM_ARTWORK_INQUIRY(),
        element: <CustomArtworkInquiry />,
      },
      {
        path: ROUTES.NOT_FOUND(),
        element: <NotFoundPage />,
      },
    ],
  },
]);
