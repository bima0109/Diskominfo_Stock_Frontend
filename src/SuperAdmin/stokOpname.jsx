import React, { useEffect, useState } from "react";
import {
  GetAllStock,
  UpdateStock as updateStock,
  DeleteStock as deleteStock,
  CreateStock as createStock,
  SearchStock as searchStock,
} from "../Api/apiStockOpname.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const satuanOptions = ["rim", "buah", "slop", "dus", "pack", "botol"];

const StockOpnamePage = () => {
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formDataTambah, setFormDataTambah] = useState({
    nama_barang: "",
    jumlah: "",
    satuan: "",
    // harga: "",
  });
  const [formDataEdit, setFormDataEdit] = useState({
    nama_barang: "",
    jumlah: "",
    satuan: "",
    // harga: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const handleSearchChange = async (value) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      fetchStock(); // reset ke semua data
      return;
    }

    try {
      const results = await searchStock(value);
      setStockList(results);
      setCurrentPage(1);
    } catch (error) {
      console.error("Gagal mencari:", error);
      alert("Terjadi kesalahan saat mencari data.");
    }
  };

  const fetchStock = async () => {
    try {
      const data = await GetAllStock();
      setStockList(data);
    } catch (error) {
      alert("Gagal mengambil data stok");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const totalPages = Math.ceil((stockList?.length || 0) / itemsPerPage);
  const sortedStock = [...stockList].sort((a, b) =>
    a.nama_barang.localeCompare(b.nama_barang)
  );

  const paginatedStock = sortedStock.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await deleteStock(id);
      alert("Data berhasil dihapus");
      fetchStock();
    } catch {
      alert("Gagal menghapus data");
    }
  };

  const handleSubmitTambah = async (e) => {
    e.preventDefault();
    try {
      await createStock(formDataTambah);
      alert("Data berhasil ditambahkan");
      setFormDataTambah({ nama_barang: "", jumlah: "", satuan: "" });
      fetchStock();
      bootstrap.Modal.getInstance(
        document.getElementById("modalTambahStock")
      )?.hide();
    } catch {
      alert("Gagal menambahkan data");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT EDIT ID:", editId);

    if (!formDataEdit.nama_barang || !formDataEdit.jumlah) {
      alert("Nama barang dan jumlah wajib diisi");
      return;
    }

    if (!editId) {
      alert("Edit ID tidak ditemukan");
      return;
    }

    try {
      await updateStock(editId, formDataEdit);
      alert("Data berhasil diperbarui");
      bootstrap.Modal.getInstance(
        document.getElementById("modalEditStock")
      )?.hide();
      setFormDataEdit({ nama_barang: "", jumlah: "", satuan: "" });
      setEditId(null);
      fetchStock();
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui data");
    }
  };

  const handleEdit = (stock) => {
    console.log("DATA STOCK:", stock);
    setEditId(stock.id);
    setFormDataEdit({
      nama_barang: stock.nama_barang,
      jumlah: stock.Jumlah,
      satuan: stock.satuan,
      // harga: stock["Harga Satuan"],
    });
    console.log("EDIT ID:", stock.id);
    const modalEl = document.getElementById("modalEditStock");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  };

  return (
    <div className="stock-page-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="stock-page-title">Data Stock Opname</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalTambahStock"
        >
          + Tambah Stock
        </button>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Cari Data Barang..."
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : paginatedStock.length === 0 ? (
        <div className="alert alert-info">Tidak ada data stok</div>
      ) : (
        <>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Satuan</th>
                {/* <th>Harga Satuan (Rp. )</th> */}
                {/* <th>Total (Rp. )</th> */}
                <th>Bulan</th>
                <th>Tahun</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStock.map((item, i) => (
                <tr key={i}>
                  <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td>{item.nama_barang}</td>
                  <td>{item.Jumlah}</td>
                  <td>{item.satuan}</td>
                  {/* <td>{item["Harga Satuan"]}</td> */}
                  {/* <td>{item.jumlah}</td> */}
                  <td>{item.bulan}</td>
                  <td>{item.tahun}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(item)}
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

          {/* Paginasi */}
          <nav className="mt-3">
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}

      {/* Modal Tambah */}
      <div className="modal fade" id="modalTambahStock" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmitTambah}>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="NAMA BARANG"
                  value={formDataTambah.nama_barang}
                  onChange={(e) =>
                    setFormDataTambah({
                      ...formDataTambah,
                      nama_barang: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="JUMLAH"
                  value={formDataTambah.jumlah}
                  onChange={(e) =>
                    setFormDataTambah({
                      ...formDataTambah,
                      jumlah: e.target.value,
                    })
                  }
                  required
                />
                <select
                  className="form-control mb-2"
                  value={formDataTambah.satuan}
                  onChange={(e) =>
                    setFormDataTambah({
                      ...formDataTambah,
                      satuan: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Pilih Satuan</option>
                  {satuanOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Batal
                </button>
                <button className="btn btn-warning" type="submit">
                  Tambah Data
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      <div className="modal fade" id="modalEditStock" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmitEdit}>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="NAMA BARANG"
                  value={formDataEdit.nama_barang}
                  onChange={(e) =>
                    setFormDataEdit({
                      ...formDataEdit,
                      nama_barang: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="JUMLAH"
                  value={formDataEdit.jumlah}
                  onChange={(e) =>
                    setFormDataEdit({ ...formDataEdit, jumlah: e.target.value })
                  }
                  required
                />
                <select
                  className="form-control mb-2"
                  value={formDataEdit.satuan}
                  onChange={(e) =>
                    setFormDataEdit({ ...formDataEdit, satuan: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih Satuan</option>
                  {satuanOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
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

      {/* Internal CSS */}
      <style>{`
        .stock-page-wrapper {

          padding: 30px;
          width: 100%;
          max-width: 2000px;
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

        .table th,
        .table td {
          vertical-align: middle;
          text-align: left;
        }

        .modal-content {
          border-radius: 10px;
        }

        .pagination .page-item .page-link {
          color: #0d6efd;
        }

        .pagination .page-item.active .page-link {
          background-color: #0d6efd;
          color: white;
          border-color: #0d6efd;
        }
      `}</style>
    </div>
  );
};

export default StockOpnamePage;
