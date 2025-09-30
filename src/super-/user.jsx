import React, { useEffect, useState } from "react";
import {
  GetUsers,
  CreateUser,
  UpdateUser,
  DeleteUser,
  ResetUserPassword,
  GetUserByusername,
} from "../Api/apiUser.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Swal from "sweetalert2";

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

const UserSuperPage = () => {
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
    ttd: null,
  });
  const [formEdit, setFormEdit] = useState({
    nama: "",
    username: "",
    role: "",
    bidang: "",
  });
  const [editId, setEditId] = useState(null);

  // state untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await GetUsers();
      setUsers(data);
    } catch (error) {
      Swal.fire("Error", "Gagal mengambil data user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = async () => {
    if (!searchTerm.trim()) {
      fetchUsers();
      return;
    }
    try {
      const result = await GetUserByusername(searchTerm);
      setUsers(result ? [result] : []);
      setCurrentPage(1); // reset ke halaman pertama
    } catch (err) {
      Swal.fire("Error", "Gagal mencari user", "error");
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
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
      setCurrentPage(1);
    } catch (err) {
      Swal.fire("Error", "Gagal mencari user", "error");
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
        ...(formTambah.role === "3" && { ttd: formTambah.ttd }),
      });

      Swal.fire({
        title: "Berhasil",
        text: "User berhasil ditambahkan",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      Swal.fire("Error", "Gagal menambahkan user", "error");
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
    if (!editId) {
      Swal.fire("Error", "ID user tidak ditemukan", "error");
      return;
    }
    try {
      await UpdateUser(editId, {
        nama: formEdit.nama,
        username: formEdit.username,
        id_role: formEdit.role,
        id_bidang: formEdit.bidang,
      });
      Swal.fire("Berhasil", "User berhasil diubah", "success");
      fetchUsers();
      bootstrap.Modal.getInstance(
        document.getElementById("modalEditUser")
      )?.hide();
    } catch (err) {
      Swal.fire("Error", "Gagal mengubah user", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus user ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await DeleteUser(id);
      Swal.fire("Berhasil", "User berhasil dihapus", "success");
      fetchUsers();
    } catch (err) {
      Swal.fire("Error", "Gagal menghapus user", "error");
    }
  };

  const handleResetPassword = async (id) => {
    const confirm = await Swal.fire({
      title: "Reset password user ini ke default?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Reset",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await ResetUserPassword(id);
      Swal.fire(
        "Berhasil",
        "Password berhasil direset ke 'password123'",
        "success"
      );
    } catch (err) {
      Swal.fire("Error", "Gagal reset password", "error");
    }
  };

  // hitung index data
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedUsers = users.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(users.length / itemsPerPage);

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
          onChange={(e) => handleSearchChange(e.target.value)}
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
        <>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th className="text-center">No</th>
                <th className="text-center">Nama</th>
                <th className="text-center">Username</th>
                <th className="text-center">Role</th>
                <th className="text-center">Bidang</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, i) => (
                <tr key={user.id}>
                  <td className="text-center">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td>{user.nama}</td>
                  <td className="text-center">{user.username}</td>
                  <td className="text-center">{user.role?.nama || "-"}</td>
                  <td className="text-center">{user.bidang?.nama || "-"}</td>
                  <td className="text-center">
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

          {/* Paginasi */}
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Prev
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, idx) => (
                <li
                  key={idx}
                  className={`page-item ${currentPage === idx + 1 ? "active" : ""
                    }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""
                  }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}

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
                {formTambah.role === "3" && (
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={(e) =>
                      setFormTambah({ ...formTambah, ttd: e.target.files[0] })
                    }
                    required
                  />
                )}
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
        }
      `}</style>
    </div>
  );
};

export default UserSuperPage;
