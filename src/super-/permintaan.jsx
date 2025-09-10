import React, { useEffect, useState, useRef } from "react";
import { GetAlldata } from "../Api/apiVerifikasi";
import { UpdatePermintaan, DeletePermintaan } from "../Api/apiPermintaan";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JsBarcode from "jsbarcode";
import kopsurat from "../assets/kopsurat.png";
import { useLocation } from "react-router-dom";

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
  // "DITOLAK",
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
            // case "DITOLAK":
            //   badgeClass = "bg-danger";
            //   break;
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

const PermintaanSuperPage = () => {
  const today = new Date();
  const [verifikasiData, setVerifikasiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const location = useLocation();
  const selectedBidangFromNav = location.state?.selectedBidang || null;
  const [selectedBidang, setSelectedBidang] = useState(selectedBidangFromNav);
  const barcodeCanvas = useRef(null);

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
    const leftX = centerX - 30 + 28.35;

    const tanggalAcc = verif.tanggal_acc
      ? formatTanggal(verif.tanggal_acc)
      : "-";

    // Teks rata kiri sejajar PNG
    doc.text(`Semarang, ${tanggalAcc}`, leftX, finalY + 20);

    doc.addImage(barcodeDataUrl, "PNG", leftX, finalY + 25, 60, 20);

    doc.text("PPTK SEKRETARIAT", leftX, finalY + 52);
    doc.text(`(${verif.menyetujui || "-"})`, leftX, finalY + 56);

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleUpdate = async (item) => {
    const newJumlah = prompt("Masukkan jumlah baru:", item.jumlah);
    const newKeterangan = prompt("Masukkan keterangan baru:", item.ketSuper);

    // Validate user inputs
    if (newJumlah === null || newKeterangan === null) {
      return; // Exit if the user cancels the prompt
    }

    // Check if 'newJumlah' is a valid number
    if (isNaN(newJumlah) || newJumlah <= 0) {
      alert("Jumlah harus berupa angka yang valid.");
      return;
    }

    // If no keterangan is entered, use the existing value
    if (!newKeterangan.trim()) {
      alert("Keterangan tidak boleh kosong.");
      return;
    }

    try {
      // Make the API call to update the data
      await UpdatePermintaan(item.id, {
        jumlah: newJumlah,
        ketSuper: newKeterangan,
      });

      alert("Berhasil update permintaan.");

      // Directly update the state without re-fetching all data
      const updatedData = verifikasiData.map((verif) => {
        if (verif.id === item.id) {
          // Update the specific item
          return {
            ...verif,
            permintaans: verif.permintaans.map((permintaan) =>
              permintaan.id === item.id
                ? { ...permintaan, jumlah: newJumlah, ketSuper: newKeterangan }
                : permintaan
            ),
          };
        }
        return verif;
      });

      const result = await GetAlldata();
      setVerifikasiData(result);
    } catch (error) {
      console.error(error);
      alert("Gagal update permintaan. Silakan coba lagi.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus permintaan ini?")) {
      try {
        await DeletePermintaan(id);
        alert("Berhasil menghapus permintaan.");
        // Refresh data
        const result = await GetAlldata();
        setVerifikasiData(result);
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus permintaan.");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetAlldata();
        setVerifikasiData(result);

        const years = result.map((item) =>
          new Date(item.tanggal).getFullYear()
        );
        const uniqueYears = Array.from(
          new Set([...years, today.getFullYear()])
        );
        uniqueYears.sort((a, b) => b - a);
        setAvailableYears(uniqueYears);

        // Filter langsung saat fetch data
        const initialFiltered = result.filter((item) => {
          const date = new Date(item.tanggal);
          return (
            date.getMonth() + 1 === today.getMonth() + 1 &&
            date.getFullYear() === today.getFullYear()
          );
        });
        setFilteredData(initialFiltered);
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

    if (selectedBidang) {
      filtered = filtered.filter(
        (item) =>
          item.bidang?.nama?.toLowerCase() === selectedBidang.toLowerCase()
      );
    }

    setFilteredData(filtered);
  }, [selectedMonth, selectedYear, selectedBidang, verifikasiData]);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Data Permintaan Barang </h3>

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

      {selectedBidang && (
        <div className="mb-3">
          <h5>
            Halaman Bidang:{" "}
            <span className="badge bg-primary">
              {selectedBidang.toUpperCase()}
            </span>
          </h5>
        </div>
      )}

      {/* Data Table */}
      {filteredData.length === 0 ? (
        <div className="alert alert-warning text-center mt-4" role="alert">
          TIDAK ADA DATA BULAN INI
        </div>
      ) : (
        filteredData.map((verif, idx) => (
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

            <table className="table table-bordered align-middle"
              style={{ fontSize: "13px" }}
            >
              <thead className="table-light text-center" style={{ fontSize: "13px" }}>
                <tr>
                  <th style={{ width: "3%" }}>No</th>
                  <th style={{ width: "10%" }}>Tanggal Pengajuan</th>
                  <th style={{ width: "15%" }}>No Surat</th>
                  <th style={{ width: "18%" }}>Nama Barang</th>
                  <th style={{ width: "6%" }}>Jumlah</th>
                  {verif.status !== "ACC PPTK SEKRETARIAT" && (
                    <th className="text-center" style={{ width: "7%" }}>
                      Jumlah Stock
                    </th>
                  )}
                  <th style={{ width: "8%" }}>Satuan</th>
                  <th style={{ width: "8%" }}>Harga Satuan</th>
                  <th style={{ width: "10%" }}>Total Harga</th>
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
                  {verif.status !== "ACC PPTK SEKRETARIAT" && (
                    <th style={{ width: "12%" }}>Action</th>
                  )}
                  <th style={{ width: "10%" }}>Progres</th>
                </tr>
              </thead>

              <tbody style={{ fontSize: "13px" }}>
                {verif.permintaans.length > 0 ? (
                  verif.permintaans.map((item, i) => {
                    const totalHarga = item.harga * item.jumlah;
                    return (
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

                        <td>{item.nama_barang}</td>
                        <td className="text-center">{item.jumlah}</td>
                        {verif.status !== "ACC PPTK SEKRETARIAT" && (
                          <td className="text-center">{item.jumlah_stock}</td>
                        )}
                        <td className="text-center">{item.satuan || "-"}</td>
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
                          }).format(totalHarga)}
                        </td>

                        {/* <td>{item.ketSuper}</td> */}
                        <td>{item.ketKabid}</td>
                        <td>{item.ketSekre}</td>
                        <td>{item.ketPptk}</td>

                        {/* Menyetujui + Tanggal Penyetujuan */}
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

                        {verif.status !== "ACC PPTK SEKRETARIAT" && (
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-warning me-1"
                              onClick={() => handleUpdate(item)}
                            >
                              <i className="bi bi-pencil" />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(item.id)}
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </td>
                        )}

                        {/* Progres */}
                        {i === 0 && (
                          <td
                            rowSpan={verif.permintaans.length}
                            className="text-center align-top"
                          >
                            {renderStatusProgress(verif.status)}
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      Tidak ada permintaan
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Total Keseluruhan */}
              {verif.permintaans.length > 0 && (
                <tfoot>
                  <tr>
                    <td
                      colSpan={verif.status !== "ACC PPTK SEKRETARIAT" ? 8 : 7}
                      className="text-end fw-bold"
                    >
                      Total Keseluruhan
                    </td>
                    <td className="text-center fw-bold">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(
                        verif.permintaans.reduce(
                          (sum, item) => sum + item.harga * item.jumlah,
                          0
                        )
                      )}
                    </td>
                    <td
                      colSpan={verif.status === "ACC PPTK SEKRETARIAT" ? 6 : 5}
                      className="border-end"
                    ></td>
                    {/* <td
                      colSpan={verif.status === "ACC PPTK SEKRETARIAT" ? 6 : 5}
                      className="border-end"
                    ></td> */}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        ))
      )}
      <canvas ref={barcodeCanvas} style={{ display: "none" }} />
    </div>
  );
};

export default PermintaanSuperPage;
