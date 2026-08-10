import { RouterProvider } from "react-router-dom";
import { router } from "@/core/router";
import ToastContainer from "@/core/components/ui/toast/ToastContainer";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
