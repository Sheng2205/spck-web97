import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const AdminBorrowsPage = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const res = await API.get("/borrow");
      setBorrows(res.data.data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách mượn/trả.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "6px" }}>Quản lý lượt mượn/trả</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Lịch sử và danh sách toàn bộ phiếu mượn trong hệ thống</p>
      </div>

      {loading ? (
        <div style={{ color: "var(--text-muted)" }}>Đang tải...</div>
      ) : (
        <div className="glass-panel" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", background: "rgba(15, 23, 42, 0.4)" }}>
                <th style={{ padding: "16px" }}>Người mượn</th>
                <th style={{ padding: "16px" }}>Tên sách</th>
                <th style={{ padding: "16px" }}>Ngày mượn</th>
                <th style={{ padding: "16px" }}>Hạn trả</th>
                <th style={{ padding: "16px" }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map(item => (
                <tr key={item._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "16px" }}>
                    <div style={{ fontWeight: "600" }}>{item.user?.userName || "N/A"}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item.user?.email}</div>
                  </td>
                  <td style={{ padding: "16px", fontWeight: "600" }}>{item.book?.title || "N/A"}</td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>
                    {new Date(item.borrowDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>
                    {new Date(item.dueDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span className={`badge ${item.status === "Borrowing" ? "badge-borrowing" : "badge-returned"}`}>
                      {item.status === "Borrowing" ? "Đang mượn" : "Đã trả"}
                    </span>
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

export default AdminBorrowsPage;
