import React, { useEffect, useState, useRef } from "react";
import { GetAlldata } from "../Api/apiVerifikasi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import kopsurat from "../assets/kopsurat.png";
import JsBarcode from "jsbarcode";

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

const renderStatusProgress = (currentStatus) => (
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

const RecordSekrePage = () => {
  const [filteredData, setFilteredData] = useState([]);
  const barcodeCanvas = useRef(null);

  // ✅ Tambah state untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // jumlah data per halaman

  const handleCetak = (verif) => {
    const doc = new jsPDF();
    const tanggalSurat = formatTanggal(verif.tanggal);
    const noSurat = formatNoSurat(verif.id, verif.tanggal);

    // link yang ingin diarahkan saat scan barcode
    const pdfUrl = `${window.location.origin}/pdf/${verif.id}`;

    // generate barcode di canvas hidden
    JsBarcode(barcodeCanvas.current, pdfUrl, {
      format: "CODE128",
      displayValue: false,
      width: 2,
      height: 60,
      margin: 0,
    });

    const barcodeDataUrl = barcodeCanvas.current.toDataURL("image/png");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.addImage(kopsurat, "PNG", 15, 12, 25, 25);
    doc.setFont("helvetica", "bold");
    doc.text("DINAS KOMUNIKASI DAN INFORMATIKA", 43, 20);
    doc.text("PEMERINTAH PROVINSI JAWA TENGAH", 43, 27);
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
      item.ketKabid || "-",
      item.ketSekre || "-",
      item.ketPptk || "-",
    ]);

    autoTable(doc, {
      startY: 68,
      head: [
        [
          "No",
          "Nama Barang",
          "Jumlah",
          "Satuan",
          "Ket Kabid",
          "Ket Sekre",
          "Ket PPTK",
        ],
      ],
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
    doc.setFont("helvetica", "normal");

    const tanggalAcc = verif.tanggal_acc
      ? formatTanggal(verif.tanggal_acc)
      : "-";
    doc.text(`Semarang, ${tanggalAcc}`, centerX, finalY + 20, {
      align: "center",
    });

    doc.addImage(barcodeDataUrl, "PNG", centerX - 30, finalY + 25, 60, 20);
    doc.text("PPTK SEKRETARIAT", centerX, finalY + 56, { align: "center" });
    doc.text(`(${verif.menyetujui || "-"})`, centerX, finalY + 64, {
      align: "center",
    });

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetAlldata();
        const filtered = result
          .filter((item) => ["ACC PPTK SEKRETARIAT"].includes(item.status))
          .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        setFilteredData(filtered);
      } catch (err) {
        alert("Gagal mengambil data");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // ✅ Logic pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Data Pengajuan Barang</h3>

      {filteredData.length === 0 ? (
        <div className="alert alert-warning text-center mt-4" role="alert">
          TIDAK ADA DATA YANG TERSEDIA
        </div>
      ) : (
        <>
          {currentData.map((verif) => (
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

              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th className="text-center" style={{ width: "3%" }}>
                      NO
                    </th>
                    <th style={{ width: "12%" }}>Tanggal</th>
                    <th style={{ width: "15%" }}>Bidang</th>
                    <th style={{ width: "20%" }}>No Surat</th>
                    <th>Nama Barang</th>
                    <th className="text-center" style={{ width: "7%" }}>
                      Jumlah
                    </th>
                    <th className="text-center" style={{ width: "10%" }}>
                      Satuan
                    </th>
                    <th className="text-center" style={{ width: "10%" }}>
                      Keterangan Kabid
                    </th>
                    <th className="text-center" style={{ width: "10%" }}>
                      Keterangan Sekretaris
                    </th>
                    <th className="text-center" style={{ width: "10%" }}>
                      Keterangan PPTK
                    </th>
                    {verif.status === "ACC PPTK SEKRETARIAT" && (
                      <>
                        <th style={{ width: "10%" }}>Menyetujui</th>
                        <th style={{ width: "12%" }}>Tanggal Penyetujuan</th>
                      </>
                    )}
                    <th className="text-center" style={{ width: "10%" }}>
                      Progres
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {verif.permintaans.length > 0 ? (
                    verif.permintaans.map((item, i) => (
                      <tr key={item.id}>
                        <td className="text-center">{i + 1}</td>
                        <td>{i === 0 ? formatTanggal(verif.tanggal) : ""}</td>
                        <td>{i === 0 ? verif.bidang?.nama || "-" : ""}</td>
                        <td>
                          {i === 0
                            ? formatNoSurat(verif.id, verif.tanggal)
                            : ""}
                        </td>
                        <td>{item.nama_barang}</td>
                        <td className="text-center">{item.jumlah}</td>
                        <td className="text-center">{item.satuan || "-"}</td>
                        <td>{item.ketKabid}</td>
                        <td>{item.ketSekre}</td>
                        <td>{item.ketPptk}</td>
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
                          <td rowSpan={verif.permintaans.length}>
                            {renderStatusProgress(verif.status)}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        Tidak ada permintaan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}

          {/* ✅ Pagination Controls */}
          <div className="mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 && "active"}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${currentPage === totalPages && "disabled"
                    }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
      <canvas ref={barcodeCanvas} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default RecordSekrePage;
