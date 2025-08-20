import React, { useEffect, useState } from "react";
import {
  GetAllUsers,
  CreateUser,
  UpdateUser,
  DeleteUser,
  ResetUserPassword,
  GetUserByusername,
} from "../Api/apiUser.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Mock untuk role dan bidang
const mockRoles = [
  { id: 1, nama: "SUPERADMIN" },
  { id: 2, nama: "ADMIN" },
  { id: 3, nama: "PPTK SEKRETARIAT" },
  { id: 4, nama: "KABID" },
  { id: 5, nama: "SEKRETARIS" },
];

const mockBidangs = [
  { id: 1, nama: "IKP" },
  { id: 2, nama: "PDKI" },
  { id: 3, nama: "Sekretariat" },
  { id: 4, nama: "TIK" },
  { id: 5, nama: "EGov" },
  { id: 6, nama: "Statistik" },
];

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [bidangs, setBidangs] = useState([]);

  const [formTambah, setFormTambah] = useState({
    nama: "",
    username: "",
    password: "",
    role: "",
    bidang: "",
  });

  const [formEdit, setFormEdit] = useState({
    nama: "",
    username: "",
    role: "",
    bidang: "",
  });

  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await GetAllUsers();
      setUsers(data);
    } catch (error) {
      alert("Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = async () => {
    if (!searchTerm.trim()) {
      fetchUsers(); // jika input kosong, tampilkan semua user
      return;
    }
    try {
      const result = await GetUserByusername(searchTerm);
      setUsers(result ? [result] : []);
    } catch (err) {
      alert("Gagal mencari user");
      setUsers([]); // reset tampilan
    }
  };

  useEffect(() => {
    fetchUsers();
    // Anda bisa ganti ini dengan fetch dari API
    setRoles(mockRoles);
    setBidangs(mockBidangs);
  }, []);

  const handleSearchChange = async (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      fetchUsers();
      return;
    }
    try {
      const result = await GetUserByusername(value);
      setUsers(result ? [result] : []);
    } catch (err) {
      alert("Gagal mencari user");
    }
  };

  const handleSubmitTambah = async (e) => {
    e.preventDefault();
    try {
      await CreateUser({
        nama: formTambah.nama,
        username: formTambah.username,
        password: formTambah.password,
        id_role: formTambah.role,
        id_bidang: formTambah.bidang,
      });
      alert("User berhasil ditambahkan");
      setFormTambah({
        nama: "",
        username: "",
        password: "",
        role: "",
        bidang: "",
      });
      fetchUsers();
      bootstrap.Modal.getInstance(
        document.getElementById("modalTambahUser")
      )?.hide();
    } catch (err) {
      alert("Gagal menambahkan user");
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setFormEdit({
      nama: user.nama,
      username: user.username,
      role: user.role?.id,
      bidang: user.bidang?.id,
    });
    new bootstrap.Modal(document.getElementById("modalEditUser")).show();
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editId) return alert("ID user tidak ditemukan");
    try {
      await UpdateUser(editId, {
        nama: formEdit.nama,
        username: formEdit.username,
        id_role: formEdit.role,
        id_bidang: formEdit.bidang,
      });
      alert("User berhasil diubah");
      fetchUsers();
      bootstrap.Modal.getInstance(
        document.getElementById("modalEditUser")
      )?.hide();
    } catch (err) {
      alert("Gagal mengubah user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await DeleteUser(id);
      alert("User berhasil dihapus");
      fetchUsers();
    } catch (err) {
      alert("Gagal menghapus user");
    }
  };

  const handleResetPassword = async (id) => {
    if (!window.confirm("Reset password user ini ke default?")) return;
    try {
      await ResetUserPassword(id);
      alert("Password berhasil direset ke 'password123'");
    } catch (err) {
      alert("Gagal reset password");
    }
  };

  return (
    <div className="user-page-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manajemen User</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalTambahUser"
        >
          + Tambah User
        </button>
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Cari Username..."
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            if (!value.trim()) {
              fetchUsers(); // otomatis load semua user
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchClick();
          }}
        />
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handleSearchClick}
        >
          Cari
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : users.length === 0 ? (
        <div className="alert alert-info">Tidak ada user ditemukan</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Username</th>
              <th>Role</th>
              <th>Bidang</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.id}>
                <td>{i + 1}</td>
                <td>{user.nama}</td>
                <td>{user.username}</td>
                <td>{user.role?.nama || "-"}</td>
                <td>{user.bidang?.nama || "-"}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDelete(user.id)}
                  >
                    Hapus
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleResetPassword(user.id)}
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Tambah */}
      <div className="modal fade" id="modalTambahUser" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmitTambah}>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nama"
                  value={formTambah.nama}
                  onChange={(e) =>
                    setFormTambah({ ...formTambah, nama: e.target.value })
                  }
                  required
                />
                <input
                  className="form-control mb-2"
                  placeholder="Username"
                  value={formTambah.username}
                  onChange={(e) =>
                    setFormTambah({ ...formTambah, username: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Password"
                  value={formTambah.password}
                  onChange={(e) =>
                    setFormTambah({ ...formTambah, password: e.target.value })
                  }
                  required
                />
                <select
                  className="form-control mb-2"
                  value={formTambah.role}
                  onChange={(e) =>
                    setFormTambah({ ...formTambah, role: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nama}
                    </option>
                  ))}
                </select>
                <select
                  className="form-control mb-2"
                  value={formTambah.bidang}
                  onChange={(e) =>
                    setFormTambah({ ...formTambah, bidang: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih Bidang</option>
                  {bidangs.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Batal
                </button>
                <button className="btn btn-primary" type="submit">
                  Tambah User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      <div className="modal fade" id="modalEditUser" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmitEdit}>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nama"
                  value={formEdit.nama}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, nama: e.target.value })
                  }
                  required
                />
                <input
                  className="form-control mb-2"
                  placeholder="Username"
                  value={formEdit.username}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, username: e.target.value })
                  }
                  required
                />
                <select
                  className="form-control mb-2"
                  value={formEdit.role}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, role: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nama}
                    </option>
                  ))}
                </select>
                <select
                  className="form-control mb-2"
                  value={formEdit.bidang}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, bidang: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih Bidang</option>
                  {bidangs.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Batal
                </button>
                <button className="btn btn-warning" type="submit">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .user-page-wrapper {
          padding: 30px;
          max-width: 100%;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .table th, .table td {
          vertical-align: middle;
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default UserPage;
