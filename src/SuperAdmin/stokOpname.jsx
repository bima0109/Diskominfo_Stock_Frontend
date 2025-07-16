import React, { useEffect, useState } from "react";
// import {
//   GetAllStock,
//   updateStock,
//   deleteStock,
//   createStock,
// } from "../Api/apiStock";
import{
    GetAllStock,
    updateStock,
    deleteStock,
    createStock
} from "../Api/apiStockOpname.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const StockOpnamePage = () => {
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama_barang: "",
    jumlah: "",
    satuan: "",
    harga: "",
  });
  const [editId, setEditId] = useState(null);

  const fetchStock = async () => {
    try {
      const data = await GetAllStock();
      setStockList(data);
    } catch (error) {
      alert("Gagal mengambil data stok");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await deleteStock(id);
      alert("Data berhasil dihapus");
      fetchStock();
    } catch (error) {
      alert("Gagal menghapus data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateStock(editId, formData);
        alert("Data berhasil diperbarui");
      } else {
        await createStock(formData);
        alert("Data berhasil ditambahkan");
      }
      setFormData({ nama_barang: "", jumlah: "", satuan: "", harga: "" });
      setEditId(null);
      fetchStock();
    } catch (error) {
      alert("Gagal menyimpan data");
    }
  };

  const handleEdit = (stock) => {
    setEditId(stock.id);
    setFormData({
      nama_barang: stock.nama_barang,
      jumlah: stock.Jumlah,
      satuan: stock.satuan,
      harga: stock["Harga Satuan"],
    });
  };

  return (
    <div className="container mt-5 bg-white p-4 rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Data Stock Opname</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalStock"
        >
          + Tambah Stock
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : stockList.length === 0 ? (
        <div className="alert alert-info">Tidak ada data stok</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Jumlah</th>
              <th>Satuan</th>
              <th>Harga Satuan</th>
              <th>Total</th>
              <th>Bulan</th>
              <th>Tahun</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {stockList.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.nama_barang}</td>
                <td>{item.Jumlah}</td>
                <td>{item.satuan}</td>
                <td>{item["Harga Satuan"]}</td>
                <td>{item.jumlah}</td>
                <td>{item.bulan}</td>
                <td>{item.tahun}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(item)}
                    data-bs-toggle="modal"
                    data-bs-target="#modalStock"
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Tambah/Edit */}
      <div
        className="modal fade"
        id="modalStock"
        tabIndex="-1"
        aria-labelledby="modalStockLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="modalStockLabel">
                  {editId ? "Edit Stock" : "Tambah Stock"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Nama Barang"
                  value={formData.nama_barang}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_barang: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Jumlah"
                  value={formData.jumlah}
                  onChange={(e) =>
                    setFormData({ ...formData, jumlah: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Satuan"
                  value={formData.satuan}
                  onChange={(e) =>
                    setFormData({ ...formData, satuan: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Harga"
                  value={formData.harga}
                  onChange={(e) =>
                    setFormData({ ...formData, harga: e.target.value })
                  }
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editId ? "Simpan Perubahan" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockOpnamePage;
