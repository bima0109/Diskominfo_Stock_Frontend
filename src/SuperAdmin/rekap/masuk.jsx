import React, { useEffect, useState } from "react";
import { GetAllMasuk } from "../../Api/apiRekap";
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

const parseTanggal = (tanggalString) => {
  const [day, month, year] = tanggalString.split("-");
  return new Date(`${year}-${month}-${day}`);
};

const MasukPage = () => {
  const [dataMasuk, setDataMasuk] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    try {
      const data = await GetAllMasuk();
      setDataMasuk(data);
    } catch (err) {
      console.error("Gagal fetch data:", err);
      Swal.fire("Error", "Gagal memuat data dari server", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const filtered = dataMasuk.filter((item) => {
        const itemDate = parseTanggal(item.tanggal);
        return itemDate >= start && itemDate <= end;
      });

      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [startDate, endDate, dataMasuk]);

  const handleCetakPDF = () => {
    if (filteredData.length === 0) {
      return Swal.fire("Info", "Tidak ada data untuk dicetak", "info");
    }

    const doc = new jsPDF();

    doc.addImage(kopsurat, "PNG", 15, 12, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("DINAS KOMUNIKASI DAN INFORMATIKA", 40, 20);
    doc.text("PEMERINTAH PROVINSI JAWA TENGAH", 40, 27);

    doc.setFontSize(14);
    doc.text("LAPORAN REKAPITULASI DATA BARANG MASUK", 105, 40, {
      align: "center",
    });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Periode: ${formatTanggalIndo(
        startDate.split("-").reverse().join("-")
      )} s.d. ${formatTanggalIndo(endDate.split("-").reverse().join("-"))}`,
      17,
      50
    );

    const tableData = filteredData.map((item, index) => [
      index + 1,
      item.nama_barang,
      item.jumlah,
      item.satuan,
      formatTanggalIndo(item.tanggal),
    ]);

    autoTable(doc, {
      startY: 58,
      head: [["No", "Nama Barang", "Jumlah", "Satuan", "Tanggal"]],
      body: tableData,
      styles: {
        fontSize: 10,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        halign: "left",
        valign: "middle",
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
      },
    });

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Rekapitulasi Data Barang Masuk</h3>

      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">Tanggal Mulai</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Tanggal Akhir</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button
            className="btn btn-outline-success w-100"
            onClick={handleCetakPDF}
            disabled={filteredData.length === 0}
          >
            <i className="bi bi-printer me-1" />
            Cetak PDF
          </button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="alert alert-warning">
          Tidak ada data untuk rentang tanggal ini.
        </div>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th className="text-center" style={{ width: "5%" }}>No</th>
              <th>Nama</th>
              <th className="text-center">Jumlah</th>
              <th className="text-center">Satuan</th>
              <th className="text-center">Harga</th>
              <th className="text-center">Total Harga</th>
              <th className="text-center">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => {
              const totalPerBarang = item.jumlah * item.harga;
              return (
                <tr key={item.id || idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td>{item.nama_barang}</td>
                  <td className="text-center">{item.jumlah}</td>
                  <td className="text-center">{item.satuan}</td>
                  <td className="text-center">
                    {item.harga
                      ? new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(item.harga)
                      : "-"}
                  </td>
                  <td className="text-center">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(totalPerBarang)}
                  </td>
                  <td className="text-center">
                    {formatTanggalIndo(item.tanggal)}
                  </td>
                </tr>
              );
            })}

            {/* Baris total keseluruhan */}
            <tr className="table-light fw-bold">
              <td colSpan="5" className="text-end">Total Keseluruhan</td>
              <td className="text-center">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(
                  filteredData.reduce(
                    (acc, item) => acc + item.jumlah * item.harga,
                    0
                  )
                )}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MasukPage;
