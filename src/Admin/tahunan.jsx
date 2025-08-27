import React, { useEffect, useState, useRef } from "react";
import { GetRekapTahunan } from "../Api/apiVerifikasi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import kopsurat from "../assets/kopsurat.png";
import JsBarcode from "jsbarcode";

const RekapTahunanPage = () => {
  const [rekapData, setRekapData] = useState([]);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [daftarTahun, setDaftarTahun] = useState([]);
  const barcodeCanvas = useRef(null);

  const fetchData = async (tahunFilter) => {
    try {
      const result = await GetRekapTahunan(tahunFilter);

      if (result.success) {
        setRekapData(result.data || []);
        setTahun(tahunFilter);
      } else {
        setRekapData([]);
      }
    } catch (err) {
      alert("Gagal mengambil data rekap tahunan");
      console.error(err);
    }
  };

  useEffect(() => {
    // generate list tahun misalnya dari 2020 - sekarang
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 2020; y--) {
      years.push(y);
    }
    setDaftarTahun(years);

    // load data awal
    fetchData(currentYear);
  }, []);

  // 🔥 otomatis fetch ulang kalau tahun berubah
  useEffect(() => {
    fetchData(tahun);
  }, [tahun]);

  const handleCetak = () => {
    const doc = new jsPDF();
    const today = new Date();
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const tanggalSurat = today.toLocaleDateString("id-ID", options);
    // const noSurat = `000.2.3.1/REKAP/${tahun}`;

    // Kop Surat
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.addImage(kopsurat, "PNG", 15, 12, 25, 25);
    doc.setFont("helvetica", "bold");
    doc.text("DINAS KOMUNIKASI DAN INFORMATIKA", 45, 20);
    doc.text("PEMERINTAH PROVINSI JAWA TENGAH", 45, 27);

    // Judul
    doc.setFontSize(14);
    doc.text("Rekapitulasi Permintaan Barang", 70, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    // doc.text(`Nomor   : ${noSurat}`, 17, 52);
    doc.text(`Tanggal Cetak   : ${tanggalSurat}`, 17, 59);
    doc.text(`Tahun                : ${tahun}`, 17, 66);

    // Tabel data rekap
    const tableData = rekapData.map((item, idx) => [
      idx + 1,
      item.nama_barang,
      item.jumlah,
      item.satuan,
    ]);

    autoTable(doc, {
      startY: 75,
      head: [["No", "Nama Barang", "Jumlah Permintaan", "Satuan"]],
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
        0: { halign: "center" },
        2: { halign: "center" },
      },
    });

    const finalY = doc.lastAutoTable?.finalY ?? 90;
    const centerX = 105;

    // BARCODE (tanda tangan digital)
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const barcodeCanvasEl = barcodeCanvas.current;
    JsBarcode(barcodeCanvasEl, pdfUrl, {
      format: "CODE128",
      displayValue: false,
      width: 2,
      height: 50,
      margin: 0,
    });

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Rekap Permintaan Barang Tahun {tahun}</h3>
        <div className="d-flex gap-2">
          {/* Dropdown Tahun */}
          <select
            className="form-select"
            style={{ width: "140px" }}
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
          >
            {daftarTahun.map((th) => (
              <option key={th} value={th}>
                {th}
              </option>
            ))}
          </select>

          {rekapData.length > 0 && (
            <button className="btn btn-outline-success" onClick={handleCetak}>
              <i className="bi bi-printer me-1" />
              Cetak PDF
            </button>
          )}
        </div>
      </div>

      {rekapData.length === 0 ? (
        <div className="alert alert-warning text-center mt-4" role="alert">
          TIDAK ADA DATA REKAP
        </div>
      ) : (
        <table className="table table-bordered align-middle">
          <thead className="text-center">
            <tr>
              <th style={{ width: "5%" }}>No</th>
              <th style={{ width: "30%" }}>Nama Barang</th>
              <th style={{ width: "15%" }}>Jumlah Permintaan</th>
              <th style={{ width: "15%" }}>Satuan</th>
            </tr>
          </thead>
          <tbody>
            {rekapData.map((item, idx) => (
              <tr key={item.kode_barang}>
                <td className="text-center">{idx + 1}</td>
                <td>{item.nama_barang}</td>
                <td className="text-center">{item.jumlah}</td>
                <td className="text-center">{item.satuan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <canvas ref={barcodeCanvas} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default RekapTahunanPage;
