import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { BookOpen, UserPlus } from "lucide-react";

const RegisterPage = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      setSubmitting(true);
      await register(userName, email, password);
      toast.success("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "420px", padding: "40px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "14px", margin: "0 auto 16px",
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            display: "flex", alignItems: "center", justifyContent: "center", color: "white"
          }}>
            <BookOpen size={32} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>Tạo tài khoản mới</h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Tham gia LibraryHub ngay hôm nay</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>Tên người dùng</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Nguyễn Văn A"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="example@libraryhub.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>Mật khẩu</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: "100%", padding: "12px", marginTop: "8px" }}>
            <UserPlus size={18} /> {submitting ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
          Đã có tài khoản? <Link to="/login" style={{ color: "var(--accent-primary)", fontWeight: "600" }}>Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
