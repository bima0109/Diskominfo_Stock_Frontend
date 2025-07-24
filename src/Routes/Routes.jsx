import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "../Auth/login.jsx";

//Import layout components
import Layout from "../navbar/layout.jsx";

//Import super admin components
import BlankPage from "../SuperAdmin/umum.jsx";
import StockOpnamePage from "../SuperAdmin/stokOpname.jsx";
import PermintaanPage from "../SuperAdmin/permintaan.jsx";
import bidangList from "../SuperAdmin/bidang.jsx";
import Bidang from "../SuperAdmin/bidang.jsx";
import PermintaanegovPage from "../SuperAdmin/perbidang/egov.jsx";
import PermintaanikpPage from "../SuperAdmin/perbidang/ikp.jsx";
import PermintaanTikPage from "../SuperAdmin/perbidang/tik.jsx";
import PermintaanPdkipage from "../SuperAdmin/perbidang/pdki.jsx";
import PermintaanSekretariatPage from "../SuperAdmin/perbidang/sekre.jsx";
import PermintaanStatistikPage from "../SuperAdmin/perbidang/statis.jsx";
import UserPage from "../SuperAdmin/user.jsx";

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
      {
        path: "permintaan",
        element: <PermintaanPage />,
      },
      {
        path: "bidang",
        element: <Bidang />,
      },
      {
        path: "bidang/egov",
        element: <PermintaanegovPage />,
      },
      {
        path: "bidang/ikp",
        element: <PermintaanikpPage />,
      },
      {
        path: "bidang/tik",
        element: <PermintaanTikPage />,
      },
      {
        path: "bidang/pdki",
        element: <PermintaanPdkipage />,
      },
      {
        path: "bidang/sekretariat",
        element: <PermintaanSekretariatPage />,
      },
      {
        path: "bidang/statistik",
        element: <PermintaanStatistikPage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
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
