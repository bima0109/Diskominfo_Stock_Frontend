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

const UserPage = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formDataTambah, setFormDataTambah] = useState({
    nama: "",
    username: "",
    role: "",
    id_role: "",
    id_bidang: "",
  });
  const [formDataEdit, setFormDataEdit] = useState({
    nama: "",
    username: "",
    role: "",
    id_role: "",
    id_bidang: "",
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await GetAllUsers();
      setUserList(data);
    } catch (error) {
      alert("Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = async (value) => {
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchUsers();
      return;
    }

    try {
      const user = await GetUserByusername(value);
      setUserList([user]); // masukkan user tunggal ke dalam array
    } catch (error) {
      console.error("Gagal mencari user:", error);
      setUserList([]); // kosongkan hasil jika gagal
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await DeleteUser(id);
      alert("User berhasil dihapus");
      fetchUsers();
    } catch {
      alert("Gagal menghapus user");
    }
  };

  const handleResetPassword = async (id) => {
    if (!window.confirm("Reset password user ke default (password123)?"))
      return;
    try {
      await ResetUserPassword(id);
      alert("Password berhasil direset");
    } catch {
      alert("Gagal reset password");
    }
  };

  const handleSubmitTambah = async (e) => {
    e.preventDefault();
    try {
      await CreateUser(formDataTambah);
      alert("User berhasil ditambahkan");
      setFormDataTambah({
        nama: "",
        username: "",
        role: "",
        id_role: "",
        id_bidang: "",
      });
      fetchUsers();
      bootstrap.Modal.getInstance(
        document.getElementById("modalTambahUser")
      )?.hide();
    } catch {
      alert("Gagal menambahkan user");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await UpdateUser(editId, formDataEdit);
      alert("User berhasil diperbarui");
      bootstrap.Modal.getInstance(
        document.getElementById("modalEditUser")
      )?.hide();
      setFormDataEdit({
        nama: "",
        username: "",
        role: "",
        id_role: "",
        id_bidang: "",
      });
      setEditId(null);
      fetchUsers();
    } catch {
      alert("Gagal memperbarui user");
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setFormDataEdit({
      nama: user.nama,
      username: user.username,
      role: user.role,
      id_role: user.id_role,
      id_bidang: user.id_bidang,
    });
    const modal = new bootstrap.Modal(document.getElementById("modalEditUser"));
    modal.show();
  };

  return (
    <div className="stock-page-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="stock-page-title">Manajemen User</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalTambahUser"
        >
          + Tambah User
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Cari Username..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : userList.length === 0 ? (
        <div className="alert alert-info">Tidak ada data user</div>
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
            {userList.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.nama}</td>
                <td>{user.username}</td>
                <td>{user.role?.nama}</td>
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

      <style>{`
        .stock-page-wrapper {
          padding: 30px;
          width: 100%;
          max-width: 2000px;
          max-height: 600px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }
        .stock-page-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .table th, .table td {
          vertical-align: middle;
          text-align: left;
        }
        .modal-content {
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default UserPage;
