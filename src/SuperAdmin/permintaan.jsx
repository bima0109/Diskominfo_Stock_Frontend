import React, { useEffect, useState } from "react";
import { GetAllpermintaan } from "../Api/apiPermintaan";
import "bootstrap/dist/css/bootstrap.min.css";

const PermintaanPage = () => {
  const [permintaanList, setPermintaanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPermintaan = async () => {
    try {
      const data = await GetAllpermintaan();

      // Urutkan berdasarkan tanggal secara descending
      const sortedData = data.sort((a, b) =>
        b.tanggal.localeCompare(a.tanggal)
      );

      setPermintaanList(sortedData);
    } catch (error) {
      alert("Gagal mengambil data permintaan");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermintaan();
  }, []);

  const totalPages = Math.ceil((permintaanList.length || 0) / itemsPerPage);
  const paginatedData = permintaanList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fungsi untuk menentukan kelas warna berdasarkan status
  const getStatusClass = (status) => {
    switch (status) {
      case "DITOLAK":
        return "btn btn-danger btn-sm";
      case "ACC KABID":
        return "btn btn-warning btn-sm text-dark";
      case "ACC UMPEG":
        return "btn btn-primary btn-sm";
      case "ACC PPTKSEKRETARIAT":
        return "btn btn-success btn-sm";
      default:
        return "btn btn-secondary btn-sm"; // PROSES atau lainnya
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Daftar Permintaan Barang</h2>
      {loading ? (
        <div>Loading...</div>
      ) : paginatedData.length === 0 ? (
        <div className="alert alert-info">Tidak ada data permintaan</div>
      ) : (
        <>
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Satuan</th>
                <th>Bidang</th>
                <th>Tanggal Pengajuan</th>
                <th>Status</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{item.nama_barang}</td>
                  <td>{item.jumlah}</td>
                  <td>{item.satuan}</td>
                  <td>{item.bidang?.nama || "-"}</td>
                  <td>{item.tanggal}</td>
                  <td>
                    <span className={getStatusClass(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
    </div>
  );
};

export default PermintaanPage;
