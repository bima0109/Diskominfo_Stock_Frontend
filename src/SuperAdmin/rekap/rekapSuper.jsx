import React, { useEffect, useState, useRef } from "react";
import { GetRekapSuper } from "../../Api/apiVerifikasi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import kopsurat from "../../assets/kopsurat.png";
import JsBarcode from "jsbarcode";

const RekapSuperPage = () => {
  const [rekapData, setRekapData] = useState([]);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [daftarTahun, setDaftarTahun] = useState([]);
  const barcodeCanvas = useRef(null);

  const fetchData = async (tahunFilter) => {
    try {
      const result = await GetRekapSuper(tahunFilter);

      if (result.success) {
        setRekapData(result.data || []);
        setTahun(tahunFilter);
      } else {
        setRekapData([]);
      }
    } catch (err) {
      alert("Gagal mengambil data rekap super");
      console.error(err);
    }
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 2020; y--) {
      years.push(y);
    }
    setDaftarTahun(years);
    fetchData(currentYear);
  }, []);

  useEffect(() => {
    fetchData(tahun);
  }, [tahun]);

  const handleCetak = () => {
    const doc = new jsPDF();
    const today = new Date();
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const tanggalSurat = today.toLocaleDateString("id-ID", options);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.addImage(kopsurat, "PNG", 15, 12, 25, 25);
    doc.setFont("helvetica", "bold");
    doc.text("DINAS KOMUNIKASI DAN INFORMATIKA", 45, 20);
    doc.text("PEMERINTAH PROVINSI JAWA TENGAH", 45, 27);

    doc.setFontSize(14);
    doc.text("Rekapitulasi Permintaan Barang Per Bidang", 60, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Tanggal Cetak   : ${tanggalSurat}`, 17, 59);
    doc.text(`Tahun                : ${tahun}`, 17, 66);

    let startY = 75;

    rekapData.forEach((bidangData, idx) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${idx + 1}. Bidang: ${bidangData.bidang}`, 17, startY);
      startY += 6;

      if (bidangData.permintaan === "-") {
        doc.setFont("helvetica", "normal");
        doc.text("Tidak ada permintaan", 25, startY);
        startY += 10;
      } else {
        const tableData = bidangData.permintaan.map((p, i) => [
          i + 1,
          p.nama_barang,
          p.jumlah,
          p.satuan,
        ]);

        autoTable(doc, {
          startY: startY,
          head: [["No", "Nama Barang", "Jumlah", "Satuan"]],
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
        });

        startY = doc.lastAutoTable.finalY + 10;
      }
    });

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Rekap Super Tahun {tahun}</h3>
        <div className="d-flex gap-2">
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
        rekapData.map((bidang, idx) => (
          <div key={idx} className="mb-4">
            <h5 className="mb-3">
              {idx + 1}. Bidang: {bidang.bidang}
            </h5>
            {bidang.permintaan === "-" ? (
              <p className="text-muted">Tidak ada permintaan</p>
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
                  {bidang.permintaan.map((item, i) => (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td>{item.nama_barang}</td>
                      <td className="text-center">{item.jumlah}</td>
                      <td className="text-center">{item.satuan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}

      <canvas ref={barcodeCanvas} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default RekapSuperPage;
