import React from "react";
import { useNavigate } from "react-router-dom";
import "./Bidang.css"; // opsional untuk styling hover
import IKP from "../assets/bidang/ikp.png";
import PDKI from "../assets/bidang/pdki.png";
import SEKRE from "../assets/bidang/sekretariat.jpg";
import TIK from "../assets/bidang/TIK.png";
import EGOV from "../assets/bidang/egov.png";
import STATIS from "../assets/bidang/statis.webp";



const bidangList = [
  {
    name: "IKP",
    icon: IKP,
  },
  {
    name: "PDKI",
    icon: PDKI,
  },
  {
    name: "Sekretariat",
    icon: SEKRE,
  },
  {
    name: "TIK",
    icon: TIK,
  },
  {
    name: "EGov",
    icon: EGOV,
  },
  {
    name: "Statistik",
    icon: STATIS,
  },
];

const Bidang = () => {
  const navigate = useNavigate();

  const handleClick = (bidangName) => {
    navigate("/super/permintaan", { state: { selectedBidang: bidangName } });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {bidangList.map((bidang, index) => (
          <div
            key={index}
            className="col-md-4 text-center mb-4"
            onClick={() => handleClick(bidang.name)}
            style={{ cursor: "pointer" }}
          >
            <div className="card p-4 shadow-sm bidang-card">
              <div
                className="icon-box mb-3"
                style={{
                  width: "150px",
                  height: "150px",
                  margin: "auto",
                  borderRadius: "10px",
                  backgroundColor: "#498fdfff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={bidang.icon}
                  alt={bidang.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <h5 className="mt-3">{bidang.name}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bidang;
