import React, { useState, useEffect } from "react";
import logoJateng from "../Assets/logoJateng.png";
import { Login } from "../Api/ApiAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const navigate = useNavigate();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCaptchaText(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (captchaInput.toUpperCase() !== captchaText.toUpperCase()) {
      Swal.fire({
        icon: "error",
        title: "Captcha Salah",
        text: "Captcha tidak cocok. Silakan coba lagi.",
      });
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    // Tampilkan animasi loading
    Swal.fire({
      title: "Sedang memproses...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await Login(username, password);
      const user = response.data.user;

      sessionStorage.setItem("token", response.data.access_token);
      sessionStorage.setItem("user", JSON.stringify(user));

      Swal.close(); // Tutup loading

      if (user && user.role && user.role.nama) {
        Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          timer: 1000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          switch (user.role.nama) {
            case "MASTERADMIN":
              navigate("master/dashboard-master");
              break;
            case "ADMIN":
              navigate("admin/dashboard-admin");
              break;
            case "PPTK SEKRETARIAT":
              navigate("pptk/dashboard-pptk");
              break;
            case "KABID":
              navigate("kabid/dashboard-kabid");
              break;
            case "SEKRETARIS":
              navigate("sekretaris/dashboard-sekre");
              break;
            case "SUPERADMIN" :
              navigate("super/dashboard-super");
              break;
            default:
              Swal.fire("Role tidak dikenali.", "", "warning");
              break;
          }
        }, 1600);
      } else {
        Swal.fire("Login gagal", "Role tidak ditemukan.", "error");
      }
    } catch (error) {
      Swal.close(); // Tutup loading jika error
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.message || "Periksa kembali Username/Password",
      });
      console.error("Login gagal:", error);
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear,
        input[type="password"]::-webkit-clear-button,
        input[type="password"]::-webkit-inner-spin-button,
        input[type="password"]::-webkit-textfield-decoration-container {
          display: none !important;
          appearance: none;
        }
      `}
      </style>
      <div style={styles.headerSection}>
        <img
          src={logoJateng}
          alt="Logo"
          style={styles.logo}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/80x80?text=No+Logo";
          }}
        />
        <h1 style={styles.title}>SIPB</h1>
        <div style={styles.subtitle}>Sign in to your account to continue</div>
      </div>

      <div style={styles.innerContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="username" style={styles.label}>
            <strong>Username</strong>
          </label>
          <input
            type="Username"
            id="username"
            placeholder="Enter your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />

          <label
            htmlFor="password"
            style={{ ...styles.label, marginTop: "20px" }}
          >
            <strong>Password</strong>
          </label>
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, paddingRight: "40px" }}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
              style={styles.showPassButton}
            >
              <img
                src={
                  showPassword
                    ? "https://img.icons8.com/?size=100&id=85130&format=png&color=000000"
                    : "https://img.icons8.com/?size=100&id=85344&format=png&color=000000"
                }
                alt="Toggle Password"
                style={{ width: "20px", height: "20px" }}
              />
            </button>
          </div>

          <label
            htmlFor="captcha"
            style={{ ...styles.label, marginTop: "20px" }}
          >
            <strong>Captcha</strong>
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                padding: "10px 15px",
                backgroundColor: "#fff",
                color: "#000",
                fontWeight: "bold",
                borderRadius: "8px",
                letterSpacing: "2px",
                userSelect: "none",
              }}
            >
              {captchaText}
            </div>
            <button
              type="button"
              onClick={generateCaptcha}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #fff",
                color: "#fff",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
          </div>

          <input
            type="text"
            id="captcha"
            placeholder="Masukkan captcha di atas"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            style={{ ...styles.input, marginTop: "10px" }}
            required
          />

          <button type="submit" style={styles.submitButton}>
            Sign In
          </button>
        </form>

        <div style={styles.footerIcon} aria-hidden="true">
          <img
            src="https://img.icons8.com/?size=100&id=37083&format=png&color=000000"
            alt="Footer Icon"
            style={{ width: "24px", height: "24px" }}
          />
        </div>
        <div style={styles.footerText}>
          &copy; 2025 Diskominfo. All rights reserved.
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  headerSection: {
    textAlign: "center",
    marginBottom: "20px",
  },
  logo: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: "10px",
  },
  title: {
    margin: "0",
    fontWeight: "900",
    fontSize: "28px",
    color: "white",
  },
  subtitle: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.8)",
    marginTop: "4px",
  },
  innerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: "32px 24px",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    textAlign: "center",
    color: "white",
    backdropFilter: "blur(10px)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  label: {
    textAlign: "left",
    fontSize: "14px",
    color: "white",
    marginBottom: "4px",
  },
  input: {
    borderRadius: "10px",
    border: "1.5px solid rgba(255, 255, 255, 0.4)",
    outline: "none",
    padding: "14px",
    width: "100%",
    fontSize: "15px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    transition: "all 0.3s ease",
  },
  inputFocus: {
    borderColor: "#fff",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  passwordWrapper: {
    position: "relative",
    // display: "flex",
    width: "100%"
  },
  showPassButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
  submitButton: {
    marginTop: "8px",
    padding: "14px 0",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "white",
    color: "#191919",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease",
  },
  submitButtonHover: {
    backgroundColor: "#f0f0f0",
  },
  footerText: {
    marginTop: "12px",
    fontSize: "12px",
    opacity: 0.6,
  },
};

export default LoginPage;
