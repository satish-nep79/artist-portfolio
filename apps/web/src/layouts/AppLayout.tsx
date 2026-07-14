import {Outlet} from "react-router-dom";

const AppLayout = () => {
  return (
    <main>
        {/* Add Nav Bar here */}
        <Outlet />
        {/* Add Footer here */}
    </main>
  )
}

export default AppLayout