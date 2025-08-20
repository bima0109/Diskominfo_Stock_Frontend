import React, { useState, useEffect } from "react";
import logoJateng from "../Assets/logoJateng.png";
import { Login } from "../Api/ApiAuth";
import { useNavigate } from "react-router-dom";

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
      alert("Captcha tidak cocok. Silakan coba lagi.");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    try {
      const response = await Login(username, password);
      const user = response.data.user;

      sessionStorage.setItem("token", response.data.access_token);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Akses role sekarang harus user.role.nama
      if (user && user.role && user.role.nama) {
        alert("Login Berhasil!");

        switch (user.role.nama) {
          case "SUPERADMIN":
            navigate("super/dashboard-super");
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
          default:
            alert("Role tidak dikenali.");
            break;
        }
      } else {
        alert("Login gagal: role tidak ditemukan.");
      }
    } catch (error) {
      console.error("Login gagal:", error);
      alert(
        "Login gagal: " + (error.message || "Periksa kembali Username/password")
      );
    }
  };

  return (
    <div style={styles.container}>
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
        <h1 style={styles.title}>Diskominfo</h1>
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
                    ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAktJREFUSEvt1UvojlsUBvDfn4GJcinHIYXklqSYGLil5BISJWdAJ4nOwCXXMlNyz0TIZYQwcqcYHOSa6NQpUQrp0MmRy8DQ4V21P22v73u/T+mfgXf0tvde+9nrWc96Vpt2/traGc9PwO/O+A9N6VD8jgnog1/wCv/gGo7ibjNKWslwIHZiCm7icgH8FM/xK/oVa+MxFjewFPcbAVcBdsBqbMBubMV/FRl0wzosxxZsxIfy+SrACFqFWThfChyF3ukBt0t7wcRp7MOyVgEn4xzm4EwWNDVlOjxbe4L1OJ6tTcOp9NgLOWi9DLvgYarb9hLYF8Gl1y/A4WwtyrG2ENMgvK2t1wOMeo0pMhtZqsHfyDOrV86O+D9txP9fSUh/NALsVBT9TaLiUnZj1Kyp5DEjlaIWGi10ET1rWZYzjKzuIX9pBMdFeS0biXVJIab9pc2XmJ+AvzLv7vi3oGESrmaBo3GrWVNjNk5m54bgQVHbAXgc6/VquBeDMbEEEAH9m4B2xvvsTCg3+nlulWj64lHB+YrCvvZkwfOKhxyrAIye25Xt/5ZUOyJ3nkaNH26xI1lW2Fnti1ocqgNaBguQKMGm5DifQ6qc5iBmFuqcjjsZSFAUjV1zmlBzTmMo+iz+TGL52Kzxa/txcVC6MJnAtsKqXldQGoJbg5U4gsXf6qW1uxdhM7riejGerqRp8aLwy15JSNFvYRbhKGFzBxo9rJXxFLFhdyH5cRiW5mGPNA+fJVHETDyBd1VKbhWwhRZs7chPwNZ4+oZT7U7pJwktaB2JmyJXAAAAAElFTkSuQmCC"
                    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAZxJREFUSEvt0z1oFEEYxvHfiVgEtdAUQYxFUEFEsLCUCDGFCsZSG8VKbO20iNiLgolYhDSxUSIESRPBQBD8ABsxVVBL8QO1UQIigpkXRjjOvezeJZzNDSyz7Lzz/ud59pmaDo9ah3m6wHV3vGtp19KWHeiGpmXLyjb8d0uP4RYO4FfZaSusb8BLjOFu1Dcq3I4PuIKbFRqWlVzEbfTjYxEwvt3BeRzEm7KOq6wP4HXq8xBn/9bVK9yIy2nhGr7hK4bwuQ1oHx4j5nDtBkZT/5/1wHs4miy9gOf52ZzVPmoBegoTWMYR7MYU3kb/euBJvMjKov9OXMeZbMt4arCAPwXwCEcc9hKOYzq/Rx5ibMUwZqpcizjdubzxPV7hE76kQPQmNTtwKNsXZXMpmSeaOVIG3I/FbHPMYdEe7EJcoSfZqndJwdMU/22YxWE8K4KWAeexCYMNm7fgO/Yly5ca1h5gb075P/aXAe/jasH1iDD9aAIMiycxgt+NKsuAzX5FT05hKIn0VR7tAgNwOqexKLVND7AWYGVV9YUdB64AQQVCHVl/dYIAAAAASUVORK5CYII="
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
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAntJREFUSEvV1l/ozmcYx/GXxIGkOLHJckD+RAkJsfyLWNTiRKiRA8oSmYMtO6CNRA5IoVArB/40k0VjtTQHSFiTbCE2sRNyQFtO7L50qadvz+/n+3seKffR0/P9Pvf7vj7353NdTzfveHV7xzzvLbAXRuEp/uxMtXYrHIlvMQc3MBABP4MN+KsKbwe4Gl/lxsfL5xe5+VCswzKsxHeN0FaBAfsaU3AbfTG6AB6lpC8xGz9gEn57DW0F+BHuFtkm4CqG4fcibY/c9CYW5Xe7MRNj8V88bwW4FSHbwgREZdcxA/9gRT4bjg+KtPfyjn9qFXgFe3Co4W7izjZhFi6lzGvxY6oRxjrQKjDuLMxytOLANdiS0IP4BocbpN3fKvAyTmYcqq7/HCF5z1JR3HXk8nEx0mKcagUYla3HtDx5s4xPR/fi4J/zPndgAP7tKjAkWpWwCPmbVjSBcG/IvL2rsdiGzxJ2600kTMSxEo94N/IYuXy16sRiZ+YqZGzsk73xDH2wIO0fe0bQv8Q5LHmdvzrAOMyukrFPs7I7lcq+KOYZk/1zUHm3Xx7gWsbmdDMlOqowvt+XckzF/SY/DuBGnC/Pl+NJDambShqwCGm47WM8qGz0CX4pLetX/JGy1WF1eIcBm5zAaMbVFa0qLB69cW62s5aB43EBgyuVfZiTIGZdHGJz6ZN7y2h6XpvUgUvDVRHuGKyNa146tT+GYETVfXXBVdMsTUtXgfMzV2dzqDaTuhazCowRcyIreJg7hJxH0oURkbZWFRhD9GIO1RhDscaVnvh3Tvda1u/sRM1yGNAYrjFAY0V7+r7hP8tbrbCtzer8uE4vrbNP7Xf+ByAUdx3ufABNAAAAAElFTkSuQmCC"
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
    minHeight: "40vh",
    width: "100vw",
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
    paddingTop: "5px",
  },
  logo: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    backgroundSize: "300px 300px",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: "10px",
  },
  title: {
    margin: "0",
    fontWeight: "900",
    fontSize: "32px",
    color: "white",
  },
  subtitle: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.8)",
    marginTop: "4px",
  },
  innerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: "42px 36px",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "700px",
    maxHeight: "550px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    textAlign: "center",
    color: "white",
    backdropFilter: "blur(10px)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
    fontSize: "14px",
    textAlign: "left",
    color: "white",
  },
  input: {
    borderRadius: "10px",
    border: "1.5px solid rgba(255, 255, 255, 0.4)",
    outline: "none",
    padding: "15px 15px",
    width: "40.5vw",
    fontSize: "15px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    transition: "border-color 0.3s ease",
    marginTop: "0.5px",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
  },
  showPassButton: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    userSelect: "none",
  },
  submitButton: {
    marginTop: "24px",
    padding: "12px 0",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "white",
    color: "#191919",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
    transition: "background-color 0.3s ease",
  },
  footerIcon: {
    marginTop: "2px",
    fontSize: "22px",
    opacity: 0.6,
  },
  footerText: {
    marginTop: "1px",
    fontSize: "13px",
    opacity: 0.5,
  },
};

export default LoginPage;
