import React, { useEffect, useState } from "react";
import { GetAllpermintaan } from "../../Api/apiPermintaan";
import "bootstrap/dist/css/bootstrap.min.css";

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const PermintaanTikPage = () => {
  const [permintaanList, setPermintaanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const fetchPermintaan = async () => {
    try {
      const data = await GetAllpermintaan();

      // Filter hanya yang bidangnya TIK
      const filteredData = data.filter(
        (item) => item.bidang?.nama?.toLowerCase() === "tik"
      );

      // Urutkan berdasarkan tanggal (desc)
      const sortedData = filteredData.sort((a, b) =>
        b.tanggal.localeCompare(a.tanggal)
      );

      setPermintaanList(sortedData);
      setFilteredData(sortedData);
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
  useEffect(() => {
    if (!selectedMonth && !selectedYear) {
      setFilteredData(permintaanList);
      return;
    }

    const newFiltered = permintaanList.filter((item) => {
      const [year, month] = item.tanggal.split("-"); // Format yyyy-mm-dd
      const matchMonth = selectedMonth ? parseInt(month) === parseInt(selectedMonth) : true;
      const matchYear = selectedYear ? parseInt(year) === parseInt(selectedYear) : true;
      return matchMonth && matchYear;
    });

    setFilteredData(newFiltered);
    setCurrentPage(1);
  }, [selectedMonth, selectedYear, permintaanList]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        return "btn btn-secondary btn-sm";
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Permintaan Barang - Bidang TIK</h2>

     <div className="row mb-3">
        <div className="col-md-3">
          <label>Bulan</label>
          <select
            className="form-control"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Semua Bulan</option>
            {monthNames.map((name, index) => (
              <option key={index + 1} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label>Tahun</label>
          <select
            className="form-control"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Semua Tahun</option>
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

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

export default PermintaanTikPage;
