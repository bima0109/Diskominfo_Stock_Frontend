import React, { useEffect, useState } from "react";
import { GetAllCart, DeleteCart, UpdateCart } from "../Api/apiCart";
import { PostVerifikasi } from "../Api/apiVerifikasi";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const DraftPage = () => {
  const [cartData, setCartData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newJumlah, setNewJumlah] = useState({});

  const fetchCart = async () => {
    try {
      const response = await GetAllCart();
      setCartData(response || []);
    } catch (error) {
      console.error("Gagal mengambil data cart:", error);
      Swal.fire("Error", "Terjadi kesalahan saat mengambil data.", "error");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNewJumlah((prev) => ({ ...prev, [item.id]: item.jumlah }));
  };

  const handleChangeJumlah = (e, id) => {
    setNewJumlah((prev) => ({ ...prev, [id]: e.target.value }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const jumlahBaru = parseInt(newJumlah[id]);
      if (isNaN(jumlahBaru) || jumlahBaru <= 0) {
        Swal.fire("Peringatan", "Jumlah harus lebih dari 0", "warning");
        return;
      }

      await UpdateCart(id, { jumlah: jumlahBaru });
      setEditingId(null);
      fetchCart();
      Swal.fire("Berhasil", "Jumlah berhasil diperbarui.", "success");
    } catch (error) {
      console.error("Gagal mengubah jumlah:", error);
      Swal.fire("Gagal", "Jumlah melebihi stock!", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Item ini akan dihapus dari draft",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await DeleteCart(id);
      fetchCart();
      Swal.fire("Berhasil", "Item berhasil dihapus.", "success");
    } catch (error) {
      console.error("Gagal menghapus item:", error);
      Swal.fire("Error", "Gagal menghapus item.", "error");
    }
  };

  const handleAjukan = async () => {
    const today = new Date();
    const dayOfMonth = today.getDate();

    if (dayOfMonth < 1 || dayOfMonth > 10) {
      Swal.fire(
        "Peringatan",
        "Pengajuan hanya dapat dilakukan pada tanggal 1–10 setiap bulan.",
        "warning"
      );
      return;
    }

    try {
      const response = await PostVerifikasi();
      Swal.fire("Berhasil", response.message || "Pengajuan berhasil.", "success")
        .then(() => {
          window.location.href = "/admin/pengajuan/";
        });
    } catch (error) {
      console.error("Gagal mengajukan:", error);
      if (error.errors) {
        const messages = Object.values(error.errors).flat().join("<br/>");
        Swal.fire("Validasi gagal", messages, "error");
      } else {
        Swal.fire("Error", error.message || "Terjadi kesalahan saat mengajukan.", "error");
      }
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Draft Permintaan Barang</h3>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th className="text-center" style={{ width: "5%" }}>
              No
            </th>
            <th>Nama Barang</th>
            <th className="text-center" style={{ width: "15%" }}>
              Jumlah Yang Diajukan
            </th>
            <th className="text-center" style={{ width: "15%" }}>
              Jumlah Stock
            </th>
            <th className="text-center" style={{ width: "10%" }}>
              Satuan
            </th>
            <th className="text-center" style={{ width: "15%" }}>
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {cartData.length > 0 ? (
            cartData.map((item, index) => (
              <tr key={item.id}>
                <td className="text-center">{index + 1}</td>
                <td>{item.stock_opname?.nama_barang || "-"}</td>
                <td className="text-center">
                  {editingId === item.id ? (
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={newJumlah[item.id]}
                      onChange={(e) => handleChangeJumlah(e, item.id)}
                    />
                  ) : (
                    item.jumlah
                  )}
                </td>
                <td className="text-center">
                  {item.stock_opname?.jumlah || "-"}
                </td>
                <td className="text-center">
                  {item.stock_opname?.satuan || "-"}
                </td>
                <td className="text-center">
                  {editingId === item.id ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleSaveEdit(item.id)}
                      >
                        Simpan
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingId(null)}
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Belum ada barang dalam draft.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {cartData.length > 0 && (
        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-primary" onClick={handleAjukan}>
            AJUKAN
          </button>
        </div>
      )}
    </div>
  );
};

export default DraftPage;
