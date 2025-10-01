import React, { useEffect, useState } from "react";
import { GetProfile, UpdateProfile, UpdatePassword } from "../Api/apiUser";
import Swal from "sweetalert2";
import { getThumbnail } from "../Api";

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const bidangs = ["IKP", "PDKI", "Sekretariat", "TIK", "EGov", "Statistik"];
  const roles = [
    "SUPERADMIN",
    "ADMIN",
    "PPTK SEKRETARIAT",
    "KABID",
    "SEKRETARIS",
  ];

  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [idBidang, setIdBidang] = useState("");
  const [idRole, setIdRole] = useState("");
  const [ttd, setTtd] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await GetProfile();
      setProfile(data);
      setNama(data.nama || "");
      setUsername(data.username || "");
      setIdBidang(data.id_bidang || "");
      setIdRole(data.id_role || "");
      setTtd(data.ttd);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal mengambil profil: " + (err.message || "Error"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await UpdateProfile({
        nama: nama,
        username: username,
        ttd: ttd,
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Profil berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchProfile();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal update profil: " + (err.message || "Error"),
      });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await UpdatePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword,
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Password berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal update password: " + (err.message || "Error"),
      });
    }
  };

  if (loading) {
    return <div className="p-3">Memuat profil...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Profil Saya</h2>
      <div className="card p-3 mt-3">
        <h5>Data Profil</h5>
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-3">
            <label className="form-label">Nama</label>
            <input
              type="text"
              className="form-control"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select className="form-select" value={idRole} disabled>
              <option value="">-- Pilih Role --</option>
              {roles.map((role, index) => (
                <option key={index + 1} value={index + 1}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Bidang</label>
            <select className="form-select" value={idBidang} disabled>
              <option value="">-- Pilih Bidang --</option>
              {bidangs.map((bidang, index) => (
                <option key={index + 1} value={index + 1}>
                  {bidang}
                </option>
              ))}
            </select>
          </div>
          {parseInt(idRole) === 3 && (
            <div className="mb-3">
              <label className="form-label">Tanda Tangan</label>

              {/* Jika ada ttd tampilkan gambarnya */}
              {ttd && (
                <div className="mb-2">
                  <img
                    src={getThumbnail(ttd)}
                    alt="TTD"
                    style={{ maxWidth: "200px", maxHeight: "100px", display: "block" }}
                  />
                </div>
              )}

              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setTtd(e.target.files[0])}
              />
            </div>
          )}

          <button className="btn btn-primary" type="submit">
            Simpan Profil
          </button>
        </form>
      </div>

      <div className="card p-3 mt-4">
        <h5>Ubah Password</h5>
        <form onSubmit={handleUpdatePassword}>
          <div className="mb-3">
            <label className="form-label">Password Lama</label>
            <input
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password Baru</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Konfirmasi Password Baru</label>
            <input
              type="password"
              className="form-control"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-warning" type="submit">
            Ubah Password
          </button>
        </form>
      </div>
    </div>
  );
}
