import "./link-sidebar-css.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const LinkSidebar = () => {
  const storedUser = sessionStorage.getItem("user");
  // const user = JSON.parse(sessionStorage.getItem("user"));
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role?.nama;

  const [showStokSubmenu, setShowStokSubmenu] = useState(false);

  const toggleStokSubmenu = () => {
    setShowStokSubmenu(!showStokSubmenu);
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Hanya admin */}
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
              className="d-inline-block"
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
              className="d-inline-block"
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
              className="d-inline-block"
            />
            Manajemen User
          </Link>
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
              className="d-inline-block"
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
              className="d-inline-block"
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
              className="d-inline-block"
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

      {/* Customer Service */}
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
              className="d-inline-block"
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
              className="d-inline-block"
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
              className="d-inline-block"
            />
            Merchandise
          </Link>
        </>
      )}

      {/* Pegawai Gudang */}
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
              className="d-inline-block"
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
              className="d-inline-block"
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
              className="d-inline-block"
            />
            Responsi
          </Link>
        </>
      )}

      {role === "KABID_TIK" && (
        <>
          <Link
            to="request-donasi"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=gEoGYhaNOcQl&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Request Donasi
          </Link>

          <Link
            to="penjualan-bulanan"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=11890&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Laporan Penjualan Bulanan
          </Link>

          <Link
            to="komisi-bulanan"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=JI2bnOlUlrmw&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Laporan Komisi Bulanan
          </Link>

          <Link
            to="stok-gudang"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=j87nOIHCmSZK&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Laporan Stok Gudang
          </Link>

          <Link
            to="masa-penitipan"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Masa Penitipan
          </Link>
          <Link
            to="kategori-barang"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13547&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Kategori Barang
          </Link>
          <Link
            to="donasi-barang"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=h3GqI1r0bWil&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Laporan Donasi
          </Link>
          <Link
            to="request/donasi"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=gEoGYhaNOcQl&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Laporan Request Donasi
          </Link>
          <Link
            to="laporan-penitip"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Laporan Penitip
          </Link>
        </>
      )}
    </div>
  );
};
export default LinkSidebar;
