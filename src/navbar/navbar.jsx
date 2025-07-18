import { Link } from "react-router-dom";
import Sidebar from "./sidebar";

const Navbar = () => {
  return (
    <nav className="navbar" style={{ backgroundColor: "#667eea" }}>
      <div className="container-fluid">
        <Sidebar />

        <Link
          to="/"
          className="d-flex n-items-center gap-1 text-white text-decoration-none"
        >
          <img
            src="https://img.icons8.com/?size=100&id=24337&format=png&color=FFFFFF"
            alt="Logout"
            width="30"
            className="d-inline-block"
          />
          Log out
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
