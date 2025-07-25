import React from "react";
import { useNavigate } from "react-router-dom";
import "./Bidang.css"; // opsional untuk styling hover

const bidangList = [
  {
    name: "IKP",
    icon: "https://icon-library.com/images/img_42309.png",
  },
  {
    name: "PDKI",
    icon: "https://images.icon-icons.com/621/PNG/512/padlock-lock-shape_icon-icons.com_56915.png",
  },
  {
    name: "Sekretariat",
    icon: "https://icon-library.com/images/group-icon-png/group-icon-png-4.jpg",
  },
  {
    name: "TIK",
    icon: "https://images.icon-icons.com/1473/PNG/512/070cloudnetwork_101558.png",
  },
  {
    name: "EGov",
    icon: "https://cdn.pixabay.com/photo/2014/03/24/13/40/courthouse-293963_1280.png",
  },
  {
    name: "Statistik",
    icon: "https://static.vecteezy.com/system/resources/previews/031/742/312/original/transparent-background-bar-chart-icon-free-png.png",
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
