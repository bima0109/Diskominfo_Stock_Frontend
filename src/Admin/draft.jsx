import React, { useEffect, useState } from "react";
import { GetAllCart, DeleteCart, UpdateCart } from "../Api/apiCart";
import { PostVerifikasi } from "../Api/apiVerifikasi";
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
      alert("Terjadi kesalahan saat mengambil data.");
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
        alert("Jumlah harus lebih dari 0");
        return;
      }

      await UpdateCart(id, { jumlah: jumlahBaru });
      setEditingId(null);
      fetchCart();
    } catch (error) {
      console.error("Gagal mengubah jumlah:", error);
      alert("Gagal mengupdate jumlah, jumlah melebihi stock");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus item ini dari draft?")) return;

    try {
      await DeleteCart(id);
      fetchCart();
    } catch (error) {
      console.error("Gagal menghapus item:", error);
      alert("Gagal menghapus item.");
    }
  };

  const handleAjukan = async () => {
    try {
      const response = await PostVerifikasi();
      alert(response.message || "Pengajuan berhasil.");
      window.location.href = "/admin/pengajuan/";
    } catch (error) {
      console.error("Gagal mengajukan:", error);
      if (error.errors) {
        const messages = Object.values(error.errors).flat().join("\n");
        alert("Validasi gagal:\n" + messages);
      } else {
        alert(error.message || "Terjadi kesalahan saat mengajukan.");
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
              Jumlah
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
              <td colSpan="5" className="text-center">
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
