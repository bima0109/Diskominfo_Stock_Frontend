import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "../Auth/login.jsx";

//Import layout components
import Layout from "../navbar/layout.jsx";

//Import super admin components
import BlankPage from "../SuperAdmin/umum.jsx";
import StockOpnamePage from "../SuperAdmin/stokOpname.jsx";

const router = createBrowserRouter([
  {
    path: "*",
    element: <div>Routes Not Found!</div>,
  },
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/super",
    element: <Layout />,
    children: [
      {
        path: "dashboard-super",
        element: <BlankPage />,
      },
      {
        path: "index-stok-opname",
        element: <StockOpnamePage />,
      },

      // {
      //   path: "settings",
      //   element: <Settings />,
      // },
    ],
  },
]);

const AppRouter = () => {
  return (
    <>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
