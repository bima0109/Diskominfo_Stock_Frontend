import React, { useEffect, useState } from "react";
import { GetVerifikasiByBidang } from "../Api/apiVerifikasi"; // pastikan fungsi ini benar
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ttdImage from "../assets/ttd.png";
import kopsurat from "../assets/kopsurat.png";

const romanMonths = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];
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

const formatNoSurat = (id, tanggal) => {
  const date = new Date(tanggal);
  const romawi = romanMonths[date.getMonth() + 1];
  const tahun = date.getFullYear();
  return `000.2.3.1/${id}/${romawi}/${tahun}`;
};

const formatTanggal = (tanggal) => {
  const date = new Date(tanggal);
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return date.toLocaleDateString("id-ID", options);
};

const formatTanggalAcc = (tanggal_acc) => {
  if (!tanggal_acc) {
    return " ";
  }
  const date = new Date(tanggal_acc);
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return date.toLocaleDateString("id-ID", options);
};


const allStatuses = [
  "DIPROSES",
  "ACC KABID",
  "ACC SEKRETARIS",
  "ACC PPTK SEKRETARIAT",
];

const renderStatusProgress = (currentStatus) => {
  return (
    <div className="d-flex flex-column gap-1">
      {allStatuses.map((status, idx) => {
        let badgeClass = "bg-secondary";
        if (status === currentStatus) {
          switch (status) {
            case "DIPROSES":
              badgeClass = "bg-info text-dark";
              break;
            case "ACC KABID":
              badgeClass = "bg-warning text-dark";
              break;
            case "ACC SEKRETARIS":
              badgeClass = "bg-primary";
              break;
            case "ACC PPTK SEKRETARIAT":
              badgeClass = "bg-success";
              break;
            default:
              badgeClass = "bg-secondary";
          }
        }
        return (
          <span key={idx} className={`badge ${badgeClass}`}>
            {status}
          </span>
        );
      })}
    </div>
  );
};

const PengajuanPage = () => {
  const today = new Date();
  const [verifikasiData, setVerifikasiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  const handleCetak = (verif) => {
    const doc = new jsPDF();
    const tanggalSurat = formatTanggal(verif.tanggal);
    const noSurat = formatNoSurat(verif.id, verif.tanggal);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.addImage(kopsurat, "PNG", 15, 12, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.text("DINAS KOMUNIKASI DAN INFORMATIKA", 40, 20);
    doc.text("PEMERINTAH PROVINSI JAWA TENGAH", 40, 27);
    doc.setFontSize(14);
    doc.text("Form Permintaan Barang", 70, 40);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`No Surat  : ${noSurat}`, 17, 50);
    doc.text(`Tanggal   : ${tanggalSurat}`, 17, 57);
    doc.text(`Bidang     : ${verif.bidang?.nama.toUpperCase() || "-"}`, 17, 64);

    const tableData = verif.permintaans.map((item, index) => [
      index + 1,
      item.nama_barang,
      item.jumlah,
      item.satuan || "-",
      item.keterangan || "-",
    ]);

    autoTable(doc, {
      startY: 68,
      head: [["No", "Nama Barang", "Vol.", "Satuan", "Keterangan"]],
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
        0: { halign: "center" },
        2: { halign: "center" },
      },
    });

    const finalY = doc.lastAutoTable?.finalY ?? 90;
    const centerX = 105;
    doc.setFont("helvetica", "normal");
    doc.text("Menyetujui", centerX, finalY + 20, { align: "center" });
    doc.addImage(ttdImage, "PNG", centerX - 15, finalY + 23, 30, 30);
    doc.text("PPTK SEKRETARIAT", centerX, finalY + 56, { align: "center" });
    doc.text("(Galih Wibowo)", centerX, finalY + 64, { align: "center" });

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetVerifikasiByBidang();
        setVerifikasiData(result);
        const years = result.map((item) =>
          new Date(item.tanggal).getFullYear()
        );
        const uniqueYears = Array.from(
          new Set([...years, today.getFullYear()])
        );
        uniqueYears.sort((a, b) => b - a);
        setAvailableYears(uniqueYears);
      } catch (err) {
        alert("Gagal mengambil data");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = verifikasiData;

    if (selectedMonth) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.tanggal).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.tanggal).getFullYear() === parseInt(selectedYear)
      );
    }

    setFilteredData(filtered);
  }, [selectedMonth, selectedYear, verifikasiData]);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Data Pengajuan Barang</h3>

      {/* Filter */}
      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">-- Pilih Bulan --</option>
            {monthNames.map(
              (month, idx) =>
                idx > 0 && (
                  <option key={idx} value={idx}>
                    {month}
                  </option>
                )
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
      </div>

      {/* Table Data */}
      {filteredData.length === 0 ? (
        <div className="alert alert-warning text-center mt-4" role="alert">
          TIDAK ADA DATA BULAN INI
        </div>
      ) : (
        filteredData.map((verif) => (
          <div className="mb-5" key={verif.id}>
            {verif.status === "ACC PPTK SEKRETARIAT" && (
              <div className="d-flex justify-content-end mb-2">
                <button
                  className="btn btn-outline-success"
                  onClick={() => handleCetak(verif)}
                >
                  <i className="bi bi-printer me-1" />
                  Cetak
                </button>
              </div>
            )}
            <table className="table table-bordered align-middle">
              <thead className="text-center">
                <tr>
                  <th style={{ width: "3%" }}>No</th>
                  <th style={{ width: "10%" }}>Tanggal Pengajuan</th>
                  <th style={{ width: "15%" }}>No Surat</th>
                  <th style={{ width: "18%" }}>Nama Barang</th>
                  <th style={{ width: "6%" }}>Jumlah</th>
                  <th style={{ width: "8%" }}>Satuan</th>
                  {/* <th style={{ width: "10%" }}>Ket. Super</th> */}
                  <th style={{ width: "10%" }}>Ket. Kabid</th>
                  <th style={{ width: "10%" }}>Ket. Sekretaris</th>
                  <th style={{ width: "10%" }}>Ket. PPTK</th>
                  {verif.status === "ACC PPTK SEKRETARIAT" && (
                    <>
                      <th style={{ width: "10%" }}>Menyetujui</th>
                      <th style={{ width: "12%" }}>Tanggal Penyetujuan</th>
                    </>
                  )}
                  <th style={{ width: "12%" }}>Progres</th>
                </tr>
              </thead>
              <tbody>
                {verif.permintaans.length > 0 ? (
                  verif.permintaans.map((item, i) => (
                    <tr key={item.id}>
                      <td className="text-center">{i + 1}</td>

                      {/* Tanggal Pengajuan */}
                      {i === 0 && (
                        <td
                          rowSpan={verif.permintaans.length}
                          className="text-center align-top"
                        >
                          {formatTanggal(verif.tanggal)}
                        </td>
                      )}

                      {/* No Surat */}
                      {i === 0 && (
                        <td
                          rowSpan={verif.permintaans.length}
                          className="text-center align-top"
                        >
                          {formatNoSurat(verif.id, verif.tanggal)}
                        </td>
                      )}

                      {/* Nama Barang */}
                      <td>{item.nama_barang}</td>
                      <td className="text-center">{item.jumlah}</td>
                      <td className="text-center">{item.satuan || "-"}</td>
                      {/* <td className="text-center">{item.keterangan_1}</td> */}
                      <td className="text-center">{item.keterangan_2}</td>
                      <td className="text-center">{item.keterangan_3}</td>
                      <td className="text-center">{item.keterangan_4}</td>

                      {verif.status === "ACC PPTK SEKRETARIAT" && i === 0 && (
                        <>
                          <td
                            rowSpan={verif.permintaans.length}
                            className="text-center align-top"
                          >
                            {verif.menyetujui}
                          </td>
                          <td
                            rowSpan={verif.permintaans.length}
                            className="text-center align-top"
                          >
                            {formatTanggalAcc(verif.tanggal_acc)}
                          </td>
                        </>
                      )}
                      {i === 0 && (
                        <td
                          rowSpan={verif.permintaans.length}
                          className="text-center align-top"
                        >
                          {renderStatusProgress(verif.status)}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center text-muted">
                      Tidak ada permintaan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        ))
      )}
    </div>
  );
};

export default PengajuanPage;
