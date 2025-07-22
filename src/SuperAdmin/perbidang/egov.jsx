import React, { useEffect, useState } from "react";
import { GetAllpermintaan } from "../../Api/apiPermintaan";
import "bootstrap/dist/css/bootstrap.min.css";

const PermintaanegovPage = () => {
  const [permintaanList, setPermintaanList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const fetchPermintaan = async () => {
    try {
      const data = await GetAllpermintaan();
      const filtered = data.filter(
        (item) => item.bidang?.nama?.toLowerCase() === "egov"
      );

      const sortedData = filtered.sort((a, b) =>
        b.tanggal.localeCompare(a.tanggal)
      );

      setPermintaanList(sortedData);
      setFilteredList(sortedData);
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
    filterDataByMonthYear();
  }, [selectedMonth, selectedYear, permintaanList]);

  const filterDataByMonthYear = () => {
    if (!selectedMonth && !selectedYear) {
      setFilteredList(permintaanList);
      return;
    }

    const filtered = permintaanList.filter((item) => {
      const date = new Date(item.tanggal);
      const monthMatch = selectedMonth
        ? date.getMonth() + 1 === parseInt(selectedMonth)
        : true;
      const yearMatch = selectedYear
        ? date.getFullYear() === parseInt(selectedYear)
        : true;

      return monthMatch && yearMatch;
    });

    setFilteredList(filtered);
    setCurrentPage(1); // Reset halaman saat filter berubah
  };

  const totalPages = Math.ceil((filteredList.length || 0) / itemsPerPage);
  const paginatedData = filteredList.slice(
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

  const monthOptions = [
    { value: "", label: "Semua Bulan" },
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const yearOptions = [
    { value: "", label: "Semua Tahun" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4">Permintaan Barang Bidang EGov</h2>

      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {yearOptions.map((y) => (
              <option key={y.value} value={y.value}>
                {y.label}
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

export default PermintaanegovPage;
