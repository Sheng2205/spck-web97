import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data.data || []);
    } catch (err) {
      toast.error("Không thể lấy danh sách tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (user) => {
    const newRole = user.role === "Admin" ? "User" : "Admin";
    if (!window.confirm(`Đổi quyền của ${user.userName} thành ${newRole}?`)) return;

    try {
      await API.put(`/users/${user._id}`, { role: newRole });
      toast.success("Cập nhật quyền thành công!");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể cập nhật quyền.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "6px" }}>Quản lý người dùng</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Quản lý danh sách người dùng và cấp quyền hệ thống</p>
      </div>

      {loading ? (
        <div style={{ color: "var(--text-muted)" }}>Đang tải...</div>
      ) : (
        <div className="glass-panel" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", background: "rgba(15, 23, 42, 0.4)" }}>
                <th style={{ padding: "16px" }}>Tên người dùng</th>
                <th style={{ padding: "16px" }}>Email</th>
                <th style={{ padding: "16px" }}>Vai trò</th>
                <th style={{ padding: "16px" }}>Ngày tạo</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Cấp quyền</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "16px", fontWeight: "600" }}>{u.userName}</td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>{u.email}</td>
                  <td style={{ padding: "16px" }}>
                    <span className={`badge ${u.role === "Admin" ? "badge-admin" : "badge-user"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>
                    {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <button onClick={() => handleToggleRole(u)} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>
                      Đổi thành {u.role === "Admin" ? "User" : "Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
