import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  BookOpen, 
  LayoutDashboard, 
  BookMarked, 
  BookmarkCheck, 
  Users, 
  LogOut, 
  ShieldCheck,
  UserCheck,
  Sun,
  Moon
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside style={{
      width: "260px",
      minHeight: "100vh",
      background: "var(--bg-glass)",
      backdropFilter: "blur(16px)",
      borderRight: "1px solid var(--border-color)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", paddingLeft: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white"
          }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)", lineHeight: 1.2 }}>LibraryHub</h2>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Quản lý thư viện</span>
          </div>
        </div>

        <button 
          onClick={toggleTheme}
          className="btn btn-secondary" 
          style={{ padding: "8px", borderRadius: "50%", minWidth: "auto" }}
          title={theme === "dark" ? "Chuyển sang Chế độ Sáng (Light)" : "Chuyển sang Chế độ Tối (Dark)"}
        >
          {theme === "dark" ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#8b5cf6" />}
        </button>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/books" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <BookMarked size={18} /> Thư viện sách
        </NavLink>
        <NavLink to="/my-borrows" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <BookmarkCheck size={18} /> Sách đang mượn
        </NavLink>

        {user?.role === "Admin" && (
          <>
            <div style={{ margin: "16px 0 8px 12px", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "1px" }}>
              QUẢN TRỊ VIÊN
            </div>
            <NavLink to="/admin/books" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <BookOpen size={18} /> Quản lý sách
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <Users size={18} /> Quản lý tài khoản
            </NavLink>
            <NavLink to="/admin/borrows" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <BookmarkCheck size={18} /> Lịch sử mượn/trả
            </NavLink>
          </>
        )}
      </nav>

      <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%", background: "var(--bg-secondary)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-primary)",
            border: "1px solid var(--border-color)"
          }}>
            {user?.role === "Admin" ? <ShieldCheck size={20} /> : <UserCheck size={20} />}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.userName || "Người dùng"}
            </div>
            <span className={`badge ${user?.role === "Admin" ? "badge-admin" : "badge-user"}`}>
              {user?.role}
            </span>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-danger" style={{ width: "100%", justifyContent: "flex-start" }}>
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>

      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          color: var(--text-muted);
          transition: var(--transition);
        }
        .sidebar-link:hover {
          color: var(--text-main);
          background: rgba(139, 92, 246, 0.08);
        }
        .sidebar-link.active {
          color: var(--accent-primary);
          font-weight: 600;
          background: rgba(139, 92, 246, 0.15);
          border-left: 3px solid var(--accent-primary);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
