import React from "react";
import sipbImage from "../assets/1.png";
function BlankPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <img
        src={sipbImage}
        alt="SIPB"
        style={{ maxWidth: "1500px", width: "100%", height: "auto" }}
      />
    </div>
  );
}

export default BlankPage;
