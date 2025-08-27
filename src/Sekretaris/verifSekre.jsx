import React, { useEffect, useState } from "react";
import { GetDataKabid, SetVerifSekre } from "../Api/apiVerifikasi";
import { UpdatePermintaan, DeletePermintaan } from "../Api/apiPermintaan";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";

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

const allStatuses = ["DIPROSES", "ACC KABID", "ACC SEKRETARIS", "ACC PPTK SEKRETARIAT"];

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

const VerifSekrePage = () => {
  const today = new Date();
  const [verifikasiData, setVerifikasiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  const handleUpdate = async (item) => {
    const newJumlah = prompt("Masukkan jumlah baru:", item.jumlah);
    const newKeterangan = prompt("Masukkan keterangan baru:", item.ketSekre);

    if (newJumlah === null || newKeterangan === null) return;

    if (isNaN(newJumlah) || newJumlah <= 0) {
      Swal.fire("Gagal", "Jumlah harus berupa angka yang valid.", "error");
      return;
    }

    if (!newKeterangan.trim()) {
      Swal.fire("Gagal", "Keterangan tidak boleh kosong.", "error");
      return;
    }

    try {
      await UpdatePermintaan(item.id, {
        jumlah: newJumlah,
        ketSekre: newKeterangan,
      });

      Swal.fire("Berhasil", "Berhasil update permintaan.", "success");

      const result = await GetDataKabid();
      setVerifikasiData(result);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal update permintaan. Silakan coba lagi.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin?",
      text: "Ingin menghapus permintaan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await DeletePermintaan(id);
        Swal.fire("Berhasil", "Permintaan berhasil dihapus.", "success");
        const data = await GetDataKabid();
        setVerifikasiData(data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Gagal menghapus permintaan.", "error");
      }
    }
  };

  const handleVerifikasi = async (verifId) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin memverifikasi pengajuan ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, verifikasi",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await SetVerifSekre(verifId);
        Swal.fire("Berhasil", "Verifikasi berhasil!", "success");

        const data = await GetDataKabid();
        setVerifikasiData(data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Verifikasi gagal.", "error");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetDataKabid();
        setVerifikasiData(result);

        const years = result.map((item) =>
          new Date(item.tanggal).getFullYear()
        );
        const uniqueYears = Array.from(new Set([...years, today.getFullYear()]));
        uniqueYears.sort((a, b) => b - a);
        setAvailableYears(uniqueYears);

        const initialFiltered = result.filter((item) => {
          const date = new Date(item.tanggal);
          return (
            date.getMonth() + 1 === today.getMonth() + 1 &&
            date.getFullYear() === today.getFullYear()
          );
        });
        setFilteredData(initialFiltered);
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data", "error");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(verifikasiData);
  }, [verifikasiData]);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Data Pengajuan Barang</h3>

      {filteredData.length === 0 ? (
        <div className="alert alert-warning text-center mt-4" role="alert">
          TIDAK ADA DATA TERSEDIA
        </div>
      ) : (
        filteredData.map((verif) => (
          <div className="mb-5" key={verif.id}>
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{ width: "3%" }}>NO</th>
                  <th style={{ width: "12%" }}>Tanggal</th>
                  <th style={{ width: "15%" }}>Bidang</th>
                  <th style={{ width: "20%" }}>No Surat</th>
                  <th>Nama Barang</th>
                  <th className="text-center" style={{ width: "7%" }}>Jumlah Permintaan</th>
                  <th className="text-center" style={{ width: "7%" }}>Jumlah Stock</th>
                  <th className="text-center" style={{ width: "10%" }}>Satuan</th>
                  <th className="text-center" style={{ width: "10%" }}>Keterangan Kabid</th>
                  <th className="text-center" style={{ width: "10%" }}>Keterangan Sekretaris</th>
                  <th className="text-center" style={{ width: "10%" }}>Keterangan PPTK</th>
                  <th className="text-center" style={{ width: "20%" }}>Action</th>
                  <th className="text-center" style={{ width: "10%" }}>Verifikasi</th>
                  <th className="text-center" style={{ width: "10%" }}>Progres</th>
                </tr>
              </thead>

              <tbody>
                {verif.permintaans.length > 0 ? (
                  verif.permintaans.map((item, i) => (
                    <tr key={item.id}>
                      <td className="text-center">{i + 1}</td>
                      <td>{i === 0 ? formatTanggal(verif.tanggal) : ""}</td>
                      <td>{i === 0 ? verif.bidang?.nama || "-" : ""}</td>
                      <td>{i === 0 ? formatNoSurat(verif.id, verif.tanggal) : ""}</td>
                      <td>{item.nama_barang}</td>
                      <td className="text-center">{item.jumlah}</td>
                      <td className="text-center">{item.jumlah_stock}</td>
                      <td className="text-center">{item.satuan || "-"}</td>
                      <td>{item.ketKabid}</td>
                      <td>{item.ketSekre}</td>
                      <td>{item.ketPptk}</td>
                      <td className="text-center">
                        {verif.status !== "ACC PPTK SEKRETARIAT" ? (
                          <>
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
                          </>
                        ) : (
                          <span className="text-bold">Pengajuan DITERIMA</span>
                        )}
                      </td>

                      {i === 0 && (
                        <td rowSpan={verif.permintaans.length} className="text-center">
                          {verif.status === "ACC KABID" && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleVerifikasi(verif.id)}
                            >
                              Verifikasi
                            </button>
                          )}
                        </td>
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
                    <td colSpan="9" className="text-center">Tidak ada permintaan</td>
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

export default VerifSekrePage;
