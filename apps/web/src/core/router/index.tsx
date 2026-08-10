import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/core/router/routes";

import AppLayout from "@/core/layouts/AppLayout";

const HomePage = lazy(() => import("@/features/home/HomePage"));
const GalleryPage = lazy(() => import("@/features/gallery_page/GalleryPage"));
const ProgramsPage = lazy(() => import("@/features/ProgramsPage"));
const NotFoundPage = lazy(() => import("@/features/NotFoundPage"));
const PurchaseInquiryScreen = lazy(
  () => import("@/features/purchase_inquiry/PurchaseInquiryScreen"),
);
const CustomArtworkInquiry = lazy(
  () => import("@/features/custom_artwork_inquiry/CustomArtworkInquiry"),
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        path: "/",
        element: withSuspense(HomePage),
      },
      {
        path: ROUTES.GALLERYPage(),
        element: withSuspense(GalleryPage),
      },
      {
        path: ROUTES.PROGRAMSPage(),
        element: withSuspense(ProgramsPage),
      },
      {
        path: ROUTES.PURCHASE_INQUIRY(),
        element: withSuspense(PurchaseInquiryScreen),
      },
      {
        path: ROUTES.CUSTOM_ARTWORK_INQUIRY(),
        element: withSuspense(CustomArtworkInquiry),
      },
      {
        path: ROUTES.NOT_FOUND(),
        element: withSuspense(NotFoundPage),
      },
    ],
  },
]);
