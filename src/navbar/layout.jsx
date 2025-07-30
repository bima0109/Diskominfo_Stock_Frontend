import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import iconMasuk from "../assets/masuk.png";
import iconHabis from "../assets/habis.png";
import iconMasih from "../assets/masih.png";

// === LinkSidebar Component ===
const LinkSidebar = () => {
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role?.nama;

  const [showRekapSubmenu, setShowRekapSubmenu] = useState(false);
  const toggleRekap = () => setShowRekapSubmenu(!showRekapSubmenu);

  return (
    <div className="d-flex flex-column gap-3">
      {role === "SUPERADMIN" && (
        <>
          <Link
            to="index-stok-opname/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=iPqKoSmxmAyJ&format=png&color=000000"
              alt=""
              width="30"
            />
            Data Stock Opname
          </Link>

          <Link
            to="bidang/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13547&format=png&color=000000"
              alt=""
              width="30"
            />
            Bidang
          </Link>

          <Link
            to="user/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
            />
            Manajemen User
          </Link>

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
              <Link
                to="masuk/"
                className="text-white link-side d-flex align-items-center gap-2"
              >
                <img
                  src={iconMasuk}
                  alt="Barang Masuk"
                  width="20"
                  height="20"
                />
                Barang Masuk
              </Link>

              <Link
                to="habis/"
                className="text-white link-side d-flex align-items-center gap-2"
              >
                <img
                  src={iconHabis}
                  alt="Barang Habis"
                  width="20"
                  height="20"
                />
                Barang Habis
              </Link>

              <Link
                to="masih/"
                className="text-white link-side d-flex align-items-center gap-2"
              >
                <img
                  src={iconMasih}
                  alt="Barang Masih"
                  width="20"
                  height="20"
                />
                Barang Masih
              </Link>
            </div>
          )}
        </>
      )}

      {role === "ADMIN_IKP" && (
        <>
          <Link
            to="/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=iPqKoSmxmAyJ&format=png&color=000000"
              alt=""
              width="30"
            />
            Dashboard
          </Link>
          <Link
            to="Profile/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13547&format=png&color=000000"
              alt=""
              width="30"
            />
            Profile
          </Link>
          <Link
            to="/penitip/pengambilan/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
            />
            Data Barang
          </Link>
          <Link
            to="/penitip/penitipan-lanjut/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            Penitipan Lanjut
          </Link>
        </>
      )}

      {role === "PPTKSEKRETARIAT" && (
        <>
          <Link
            to="penitip/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
            />
            Penitip
          </Link>
          <Link
            to="diskusi/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
            />
            Diskusi
          </Link>
          <Link
            to="merchandise/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=FYDMKDveHa85&format=png&color=000000"
              alt=""
              width="30"
            />
            Merchandise
          </Link>
        </>
      )}

      {role === "KABID_IKP" && (
        <>
          <Link
            to="barang-titipan"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=hSUoULMc0FvV&format=png&color=000000"
              alt=""
              width="30"
            />
            Barang Titipan
          </Link>
          <Link
            to="pengiriman/pembeli"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=11910&format=png&color=000000"
              alt=""
              width="30"
            />
            Pengiriman
          </Link>
          <Link
            to="responsi"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=11910&format=png&color=000000"
              alt=""
              width="30"
            />
            Responsi
          </Link>
        </>
      )}

      {role === "KABID_TIK" && (
        <>
          {[
            {
              to: "request-donasi",
              label: "Request Donasi",
              icon: "gEoGYhaNOcQl",
            },
            {
              to: "penjualan-bulanan",
              label: "Laporan Penjualan Bulanan",
              icon: "11890",
            },
            {
              to: "komisi-bulanan",
              label: "Laporan Komisi Bulanan",
              icon: "JI2bnOlUlrmw",
            },
            {
              to: "stok-gudang",
              label: "Laporan Stok Gudang",
              icon: "j87nOIHCmSZK",
            },
            { to: "masa-penitipan", label: "Masa Penitipan", icon: "13042" },
            { to: "kategori-barang", label: "Kategori Barang", icon: "13547" },
            {
              to: "donasi-barang",
              label: "Laporan Donasi",
              icon: "h3GqI1r0bWil",
            },
            {
              to: "request/donasi",
              label: "Laporan Request Donasi",
              icon: "gEoGYhaNOcQl",
            },
            { to: "laporan-penitip", label: "Laporan Penitip", icon: "13042" },
          ].map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="d-flex align-items-center gap-2 text-white link-side"
            >
              <img
                src={`https://img.icons8.com/?size=100&id=${icon}&format=png&color=000000`}
                alt=""
                width="30"
              />
              {label}
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

// === Sidebar Component ===
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
          <div className="fw-bold fs-2 text-white">SiSEKRUP</div>
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
const Navbar = () => (
  <nav className="navbar" style={{ backgroundColor: "#667eea" }}>
    <div className="container-fluid">
      <Sidebar />
      <Link
        to="/"
        className="d-flex align-items-center gap-1 text-white text-decoration-none"
      >
        <img
          src="https://img.icons8.com/?size=100&id=24337&format=png&color=FFFFFF"
          alt="Logout"
          width="30"
        />
        Log out
      </Link>
    </div>
  </nav>
);

// === Layout Component ===
const Layout = () => {
  const location = useLocation();

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
            padding: 0;
            min-height: 100vh;
            width: 100vw;
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
            background-color: #764ba2;
            filter: brightness(85%);
            border-radius: 2px;
          }

          .offcanvas-backdrop {
            z-index: 1040;
          }
        `}
      </style>
      <Navbar key={location.pathname} />
      <Outlet />
    </>
  );
};

export default Layout;
