import React, { useEffect, useState } from "react";
import { GetProfile, UpdateProfile, UpdatePassword } from "../Api/apiUser";

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  // Data static dari backend
  const bidangs = ["IKP", "PDKI", "Sekretariat", "TIK", "EGov", "Statistik"];
  const roles = [
    "SUPERADMIN",
    "ADMIN",
    "PPTKSEKRETARIAT",
    "KABID",
    "SEKRETARIS",
  ];

  // State untuk update profil
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [idBidang, setIdBidang] = useState("");
  const [idRole, setIdRole] = useState("");

  // State untuk update password
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
    } catch (err) {
      alert("Gagal mengambil profil: " + (err.message || "Error"));
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
        // id_bidang: parseInt(idBidang),
        // id_role: parseInt(idRole),
      });
      alert("Profil berhasil diperbarui");
      fetchProfile();
    } catch (err) {
      alert("Gagal update profil: " + (err.message || "Error"));
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
      alert("Password berhasil diperbarui");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      alert("Gagal update password: " + (err.message || "Error"));
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
