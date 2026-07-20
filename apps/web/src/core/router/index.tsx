import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/core/layouts/AppLayout";
import HomePage from "@/features/home/HomePage";
import GalleryPage from "@/features/GalleryPage";
import ProgramsPage from "@/features/ProgramsPage";
import NotFoundPage from "@/features/NotFoundPage";

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
        path: "/gallery",
        element: <GalleryPage />,
      },
      {
        path: "/programs",
        element: <ProgramsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
