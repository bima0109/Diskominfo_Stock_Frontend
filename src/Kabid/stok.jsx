import React, { useEffect, useState } from "react";
import {
  GetAllStock,
  SearchStock as searchStock,
} from "../Api/apiStockOpname.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const StockPage = () => {
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <div className="stock-page-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="stock-page-title">
          Data Stock Opname 
        </h2>
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
                <th className="text-center" >No</th>
                <th className="text-center" >Nama Barang</th>
                <th className="text-center" >Jumlah</th>
                <th className="text-center">Satuan</th>
                {/* <th>Harga Satuan (Rp. )</th> */}
                {/* <th>Total (Rp. )</th> */}
                <th className="text-center" >Bulan</th>
                <th className="text-center" >Tahun</th>
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

      {/* Internal CSS */}
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

        .table th {
            vertical-align: middle;
            text-align: center;
        }

        .table td {
            vertical-align: middle;
            text-align: center;
        }

        .table td:nth-child(2) { /* kolom ke-2 = Nama Barang */
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

export default StockPage;
