import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import iconMasuk from "../assets/masuk.png";
import iconHabis from "../assets/habis.png";
import iconMasih from "../assets/masih.png";
import Swal from "sweetalert2";

// === LinkSidebar Component ===
const LinkSidebar = () => {
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role?.nama;

  const [showRekapSubmenu, setShowRekapSubmenu] = useState(false);
  const toggleRekap = () => setShowRekapSubmenu(!showRekapSubmenu);

  return (
    <div className="d-flex flex-column h-100 gap-3">
      {role === "SUPERADMIN" && (
        <>
          <PencetanSidebar
            arah="/super/index-stok-opname/"
            nama="Data Stock Opname"
            linkGambar="https://img.icons8.com/?size=100&id=iPqKoSmxmAyJ&format=png&color=000000"
          />

          <PencetanSidebar
            arah="/super/bidang/"
            nama="Bidang"
            linkGambar="https://img.icons8.com/?size=100&id=13547&format=png&color=000000"
          />

          <PencetanSidebar
            arah="/super/user/"
            nama="Manajemen User"
            linkGambar="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
          />

          {/* Rekap menu */}
          <div
            onClick={toggleRekap}
            style={{ cursor: "pointer" }}
            className="d-flex align-items-center gap-2 text-white link-side mt-2"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13760&format=png&color=000000"
              alt=""
              width="30"
            />
            Rekap
          </div>

          {/* Submenu Rekap */}
          {showRekapSubmenu && (
            <div className="ps-4 d-flex flex-column gap-1">
              <PencetansubSidebar
                arah="/super/masuk/"
                nama="Barang Masuk"
                linkGambar={iconMasuk}
              />

              <PencetansubSidebar
                arah="/super/habis/"
                nama="Barang Habis"
                linkGambar={iconHabis}
              />

              <PencetansubSidebar
                arah="/super/masih/"
                nama="Barang Masih"
                linkGambar={iconMasih}
              />
            </div>
          )}
        </>
      )}

      {role === "ADMIN" && (
        <>
          <PencetanSidebar
            arah="/admin/stock-in/"
            nama="Stock dan Input"
            linkGambar="https://img.icons8.com/?size=100&id=12073&format=png&color=000000"
          />
          <PencetanSidebar
            arah="/admin/draft-pengajuan/"
            nama="Draft Pengajuan"
            linkGambar="https://img.icons8.com/?size=100&id=12318&format=png&color=000000"
          />
          <PencetanSidebar
            arah="/admin/pengajuan/"
            nama="Daftar Pengajuan"
            linkGambar="https://img.icons8.com/?size=100&id=13549&format=png&color=000000"
          />
          <PencetanSidebar
            arah="/admin/dashboard-admin/"
            nama="Rekap Tahunan (Beta)"
            linkGambar="https://img.icons8.com/?size=100&id=104092&format=png&color=000000"
          />
        </>
      )}

      {role === "PPTKSEKRETARIAT" && (
        <>
          <PencetanSidebar
            arah="/pptk/stock-pptk/"
            nama="Stock Opname"
            linkGambar="https://img.icons8.com/?size=100&id=12073&format=png&color=000000"
          />
          <PencetanSidebar
            arah="/pptk/verifikasi-pptk/"
            nama="Verifikasi"
            linkGambar="https://img.icons8.com/?size=100&id=13550&format=png&color=000000"
          />
          <PencetanSidebar
            arah="/pptk/history-pptk/"
            nama="History"
            linkGambar="https://img.icons8.com/?size=100&id=74556&format=png&color=000000"
          />
        </>
      )}

      {role === "KABID" && (
        <>
          <PencetanSidebar
            arah="/kabid/stock-kabid/"
            nama="Stock Opname"
            linkGambar="https://img.icons8.com/?size=100&id=12073&format=png&color=000000"
          />
          <PencetanSidebar
            arah="/kabid/verifikasi-kabid/"
            nama="Verifikasi"
            linkGambar="https://img.icons8.com/?size=100&id=13550&format=png&color=000000"
          />
          <PencetanSidebar
            arah="/kabid/history-kabid/"
            nama="History"
            linkGambar="https://img.icons8.com/?size=100&id=74556&format=png&color=000000"
          />
        </>
      )}

      {role === "SEKRETARIS" && (
        <>
          <PencetanSidebar
            arah="/sekretaris/stock-sekre/"
            nama="Stock Opname"
            linkGambar="https://img.icons8.com/?size=100&id=12073&format=png&color=000000"
          />
          <PencetanSidebar
            arah="/sekretaris/verifikasi-sekre/"
            nama="Verifikasi"
            linkGambar="https://img.icons8.com/?size=100&id=13550&format=png&color=000000"
          />
          <PencetanSidebar
            arah="/sekretaris/history-sekre/"
            nama="History"
            linkGambar="https://img.icons8.com/?size=100&id=74556&format=png&color=000000"
          />
        </>
      )}
      <div className="mt-auto">
        <PencetanProfilSidebar
          arah="/user/profile/"
          nama="Profile"
          linkGambar="https://img.icons8.com/?size=100&id=108347&format=png&color=000000"
        />
      </div>
    </div>
  );
};

// === Sidebar Component ===

const PencetanSidebar = ({ arah, nama, linkGambar }) => {
  const location = useLocation();
  return location.pathname !== arah ? (
    <Link
      to={arah}
      className="d-flex align-items-center gap-2 text-white link-side"
    >
      <img src={linkGambar} alt="" width="30" />
      {nama}
    </Link>
  ) : (
    <button
      className="d-flex align-items-center gap-2 text-white link-sideSelected"
      type="button"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    >
      <img src={linkGambar} alt="" width="30" />
      {nama}
    </button>
  );
};

const PencetansubSidebar = ({ arah, nama, linkGambar }) => {
  const location = useLocation();
  return location.pathname !== arah ? (
    <Link
      to={arah}
      className="d-flex align-items-center gap-2 text-white link-side"
    >
      <img src={linkGambar} alt="" width="25" />
      {nama}
    </Link>
  ) : (
    <button
      className="d-flex align-items-center gap-2 text-white link-sideSelected"
      type="button"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    >
      <img src={linkGambar} alt="" width="25" />
      {nama}
    </button>
  );
};

const PencetanProfilSidebar = ({ arah, nama, linkGambar }) => {
  const location = useLocation();
  return location.pathname !== arah ? (
    <Link
      to={arah}
      className="d-flex align-items-center gap-2 text-white link-side"
    >
      <img src={linkGambar} alt="" width="50" height={50} />
      {nama}
    </Link>
  ) : (
    <button
      className="d-flex align-items-center gap-2 text-white link-sideSelected"
      type="button"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    >
      <img src={linkGambar} alt="" width="40" />
      {nama}
    </button>
  );
};

const Sidebar = () => {
  const location = useLocation();

  useEffect(() => {
    const offcanvasEl = document.getElementById("staticBackdrop");
    if (offcanvasEl) {
      bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl).hide();
    }
    setTimeout(() => {
      document
        .querySelectorAll(".offcanvas-backdrop")
        .forEach((el) => el.remove());
    }, 200);
  }, [location]);

  useEffect(() => {
    const el = document.getElementById("staticBackdrop");
    if (el) bootstrap.Offcanvas.getOrCreateInstance(el);
  }, []);

  return (
    <>
      <button
        className="btn z-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#staticBackdrop"
      >
        <img
          src="https://img.icons8.com/?size=100&id=8113&format=png&color=FFFFFF"
          alt=""
          width="30"
        />
      </button>
      <div
        className="offcanvas offcanvas-start"
        style={{ backgroundColor: "#667eea" }}
        data-bs-backdrop="static"
        id="staticBackdrop"
      >
        <div className="offcanvas-header">
          <div className="fw-bold fs-2 text-white">SiPB</div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <LinkSidebar />
        </div>
      </div>
    </>
  );
};

// === Navbar Component ===
const Navbar = ({ logoutFun }) => (
  <nav className="navbar" style={{ backgroundColor: "#667eea" }}>
    <div className="container-fluid">
      <Sidebar />
      <button
        onClick={logoutFun}
        className="d-flex align-items-center gap-1 text-white text-decoration-none bg-transparent border-0 p-0"
        style={{ cursor: "pointer" }}
      >
        <img
          src="https://img.icons8.com/?size=100&id=24337&format=png&color=FFFFFF"
          alt="Logout"
          width="30"
        />
        Log out
      </button>
    </div>
  </nav>
);

// === Layout Component ===
const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // === logout function ===
  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/");
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.classList.remove(
      "offcanvas-backdrop",
      "modal-open",
      "overflow-hidden"
    );
  }, [location]);

  return (
    <>
      <style>
        {`
          html, body {
            margin: 0;
            padding-left: 0 !important;
            padding-right: 0 !important;
            min-height: 101vh;
            width: 99vw;
            overflow-x: hidden;
          }

          #root {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          a {
            text-decoration: none;
            padding: 5px;
          }

          .link-side:hover {
            background-color: #6256c0ff;
            filter: brightness(85%);
            border-radius: 2px;
          }

          .link-sideSelected {
            background-color: #6256c0ff;
            filter: brightness(85%);
            border-radius: 2px;
          }

          .offcanvas-backdrop {
            z-index: 1040;
          }
        `}
      </style>

      <Navbar logoutFun={handleLogout} key={location.pathname} />
      <Outlet />
    </>
  );
};

export default Layout;
