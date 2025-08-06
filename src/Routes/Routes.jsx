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

//Import kabid components
import StockPage from "../Kabid/stok.jsx";
import VerifKabidPage from "../Kabid/verifKabid.jsx";
import RecordPage from "../Kabid/record.jsx";

//Import sekretaris components
import VerifSekrePage from "../Sekretaris/verifSekre.jsx";
import RecordSekrePage from "../Sekretaris/recordSekre.jsx";

//import pptk components
import VerifPPTKPage from "../PPTK/verifPPTK.jsx";
import RecordPPTKPage from "../PPTK/recordPPTK.jsx";

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

  //Kabid
  {
    path: "/kabid",
    element: <Layout />,
    children: [
      {
        path: "dashboard-kabid",
        element: <AdminPage />,
      },
      {
        path: "stock-kabid",
        element: <StockPage />,
      },
      {
        path: "verifikasi-kabid",
        element: <VerifKabidPage />,
      },
      {
        path: "history-kabid",
        element: <RecordPage />,
      }
    ],
  },

  //Sekretaris
  {
    path: "/sekretaris",
    element: <Layout />,
    children: [
      {
        path: "dashboard-sekre",
        element: <AdminPage />,
      },
      {
        path: "stock-sekre",
        element: <StockPage />,
      },
      {
        path: "verifikasi-sekre",
        element: <VerifSekrePage />,
      },
      {
        path: "history-sekre",
        element: <RecordSekrePage />,
      }
    ],
  },

  //PPTK
  {
    path: "/pptk",
    element: <Layout />,
    children: [
      {
        path: "dashboard-pptk",
        element: <AdminPage />,
      },
      {
        path: "stock-pptk",
        element: <StockPage />,
      },
      {
        path: "verifikasi-pptk",
        element: <VerifPPTKPage />,
      },
      {
        path: "history-pptk",
        element: <RecordPPTKPage />,
      }
    ],
  }
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
