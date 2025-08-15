import React, { useEffect, useState } from "react";
import { GetAllhabis, PostHabis } from "../../Api/apiRekap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import kopsurat from "../../assets/kopsurat.png";
import ttdImage from "../../assets/ttd.png";
import Swal from "sweetalert2";

const monthNames = [
  "",
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const formatTanggalIndo = (tanggalString) => {
  const [day, month, year] = tanggalString.split("-");
  const bulan = monthNames[parseInt(month)];
  return `${parseInt(day)} ${bulan} ${year}`;
};

const HabisPage = () => {
  const [dataMasuk, setDataMasuk] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [loadingPost, setLoadingPost] = useState(false);

  const fetchData = async () => {
    try {
      const data = await GetAllhabis();
      setDataMasuk(data);
      const years = Array.from(
        new Set(
          data.map((item) => {
            const [day, month, year] = item.tanggal.split("-");
            return parseInt(year);
          })
        )
      );
      setAvailableYears(years.sort((a, b) => b - a));
    } catch (err) {
      console.error("Gagal fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = dataMasuk.filter((item) => {
      const [day, month, year] = item.tanggal.split("-");
      return (
        parseInt(month) === parseInt(selectedMonth) &&
        parseInt(year) === parseInt(selectedYear)
      );
    });
    setFilteredData(filtered);
  }, [selectedMonth, selectedYear, dataMasuk]);

  const handleCetakPDF = () => {
    const doc = new jsPDF();
    doc.addImage(kopsurat, "PNG", 15, 12, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("DINAS KOMUNIKASI DAN INFORMATIKA", 40, 20);
    doc.text("PEMERINTAH PROVINSI JAWA TENGAH", 40, 27);
    doc.setFontSize(14);
    doc.text("LAPORAN REKAPITULASI DATA BARANG HABIS", 105, 40, {
      align: "center",
    });

    const bulan = monthNames[selectedMonth];
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Bulan    : ${bulan} ${selectedYear}`, 17, 50);

    const tableData = filteredData.map((item, index) => [
      index + 1,
      item.nama_barang,
      formatTanggalIndo(item.tanggal),
    ]);

    autoTable(doc, {
      startY: 58,
      head: [["No", "Nama Barang", "Tanggal"]],
      body: tableData,
      styles: {
        fontSize: 10,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        halign: "left",
        valign: "middle",
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        2: { halign: "center" },
      },
    });

    const finalY = doc.lastAutoTable?.finalY ?? 90;
    const centerX = 105;
    doc.setFont("helvetica", "normal");
    doc.text("Menyetujui", centerX, finalY + 20, { align: "center" });
    doc.addImage(ttdImage, "PNG", centerX - 15, finalY + 23, 30, 30);
    doc.text("PPTKSEKRETARIAT", centerX, finalY + 56, { align: "center" });
    doc.text("(Galih Wibowo)", centerX, finalY + 64, { align: "center" });

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleAmbilData = async () => {
    const captchaCode = Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();

    const { value: userInput } = await Swal.fire({
      title: "Verifikasi Pengambilan Data",
      html: `<p>Masukkan kode berikut untuk melanjutkan:</p>
           <h2 style="font-weight: bold; color: #333;">${captchaCode}</h2>`,
      input: "text",
      inputPlaceholder: "Ketik kode di sini",
      showCancelButton: true,
      confirmButtonText: "Lanjutkan",
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value) {
          return "Kode tidak boleh kosong!";
        }
        if (value.trim().toUpperCase() !== captchaCode) {
          return "Kode yang dimasukkan salah!";
        }
        return null;
      },
    });

    // Jika input valid (captcha benar)
    if (userInput && userInput.trim().toUpperCase() === captchaCode) {
      setLoadingPost(true);
      try {
        await PostHabis(); // panggil API PostHabis
        await fetchData(); // refresh data
        Swal.fire("Berhasil!", "Data berhasil diambil.", "success");
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        Swal.fire("Error", "Gagal mengambil data.", "error");
      } finally {
        setLoadingPost(false);
      }
    }
  };

  const isCurrentMonthYear =
    parseInt(selectedMonth) === new Date().getMonth() + 1 &&
    parseInt(selectedYear) === new Date().getFullYear();

  return (
    <div className="container py-4">
      <h3 className="mb-4">Rekapitulasi Data Barang Habis</h3>

      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">-- Pilih Bulan --</option>
            {monthNames.map((name, index) =>
              index > 0 ? (
                <option key={index} value={index}>
                  {name}
                </option>
              ) : null
            )}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">-- Pilih Tahun --</option>
            {availableYears.map((year, idx) => (
              <option key={idx} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-outline-success" onClick={handleCetakPDF}>
            <i className="bi bi-printer me-1" />
            Cetak PDF
          </button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="alert alert-warning">
          TIDAK ADA DATA BULAN INI
          {isCurrentMonthYear && (
            <button
              className="btn btn-primary btn-sm ms-3"
              onClick={handleAmbilData}
              disabled={loadingPost}
            >
              {loadingPost ? "Memproses..." : "Ambil Data"}
            </button>
          )}
        </div>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th className="text-center" style={{ width: "5%" }}>
                No
              </th>
              <th className="text-center">Nama</th>
              <th className="text-center">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={item.id}>
                <td className="text-center">{idx + 1}</td>
                <td>{item.nama_barang}</td>
                <td className="text-center">
                  {formatTanggalIndo(item.tanggal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HabisPage;
