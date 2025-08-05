import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "../Auth/login.jsx";

//Import layout components
import Layout from "../navbar/layout.jsx";

//Import super admin components
import BlankPage from "../SuperAdmin/umum.jsx";
import StockOpnamePage from "../SuperAdmin/stokOpname.jsx";
import PermintaanPage from "../SuperAdmin/permintaan.jsx";
import Bidang from "../SuperAdmin/bidang.jsx";
import UserPage from "../SuperAdmin/user.jsx";
import MasukPage from "../SuperAdmin/rekap/masuk.jsx";
import MasihPage from "../SuperAdmin/rekap/masih.jsx";
import HabisPage from "../SuperAdmin/rekap/habis.jsx";

//Import admin components
import AdminPage from "../Admin/admin.jsx";
import StockInPage from "../Admin/stockin.jsx";
import DraftPage from "../Admin/draft.jsx";
import PengajuanPage from "../Admin/pengajuan.jsx";

const router = createBrowserRouter([
  {
    path: "*",
    element: <div>Routes Not Found!</div>,
  },
  {
    path: "/",
    element: <Login />,
  },

  //Super Admin
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
        path: "user",
        element: <UserPage />,
      },
      {
        path: "masuk",
        element: <MasukPage />,
      },
      {
        path: "masih",
        element: <MasihPage />,
      },
      {
        path: "habis",
        element: <HabisPage />,
      },
    ],
  },

  //Admin
  {
    path: "/admin",
    element: <Layout />,
    children: [
      {
        path: "dashboard-admin",
        element: <AdminPage />,
      },
      {
        path: "stock-in",
        element: <StockInPage />,
      },
      {
        path: "draft-pengajuan",
        element: <DraftPage />,
      },
      {
        path: "pengajuan",
        element: <PengajuanPage />,
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
