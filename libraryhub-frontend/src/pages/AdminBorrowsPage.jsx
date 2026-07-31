import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Trash2, Calendar, Filter, X, AlertTriangle } from "lucide-react";

const AdminBorrowsPage = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("week"); // day, week, month, older_30_days, all
  const [onlyReturned, setOnlyReturned] = useState(true);
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteHistory = async (e) => {
    e.preventDefault();
    if (!window.confirm("Bạn có chắc chắn muốn xóa dữ liệu lịch sử theo mốc thời gian đã chọn? Hành động này không thể hoàn tác.")) {
      return;
    }

    try {
      setDeleting(true);
      const res = await API.delete("/borrow/history", {
        data: { timeframe, onlyReturned }
      });
      toast.success(res.data.message || "Đã xóa lịch sử thành công!");
      setIsDeleteModalOpen(false);
      fetchBorrows();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa lịch sử.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSingle = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa phiếu mượn/trả này?")) return;

    try {
      await API.delete(`/borrow/${id}`);
      toast.success("Xóa phiếu thành công!");
      setBorrows(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa phiếu.");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "6px" }}>Quản lý lượt mượn/trả</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Lịch sử và danh sách toàn bộ phiếu mượn trong hệ thống</p>
        </div>

        <button 
          onClick={() => setIsDeleteModalOpen(true)} 
          className="btn btn-danger"
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px" }}
        >
          <Trash2 size={18} /> Xóa lịch sử mượn/trả
        </button>
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
                <th style={{ padding: "16px", textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {borrows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                    Chưa có phiếu mượn/trả nào.
                  </td>
                </tr>
              ) : (
                borrows.map(item => (
                  <tr key={item._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontWeight: "600" }}>{item.user?.userName || "N/A"}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item.user?.email}</div>
                    </td>
                    <td style={{ padding: "16px", fontWeight: "600" }}>{item.book?.title || "N/A"}</td>
                    <td style={{ padding: "16px", color: "var(--text-muted)" }}>
                      {item.borrowDate ? new Date(item.borrowDate).toLocaleDateString("vi-VN") : "N/A"}
                    </td>
                    <td style={{ padding: "16px", color: "var(--text-muted)" }}>
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString("vi-VN") : "N/A"}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span className={`badge ${item.status === "Borrowing" ? "badge-borrowing" : "badge-returned"}`}>
                        {item.status === "Borrowing" ? "Đang mượn" : "Đã trả"}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <button 
                        onClick={() => handleDeleteSingle(item._id)} 
                        className="btn btn-secondary" 
                        style={{ padding: "6px", borderRadius: "50%", minWidth: "auto", color: "var(--danger)" }}
                        title="Xóa phiếu mượn này"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Delete History */}
      {isDeleteModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "20px"
        }} onClick={() => setIsDeleteModalOpen(false)}>
          <div 
            className="glass-panel"
            style={{ width: "100%", maxWidth: "480px", padding: "32px", borderRadius: "var(--radius-lg)", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--danger)" }}>
                <AlertTriangle size={24} />
                <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Xóa lịch sử mượn/trả</h3>
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "50%", minWidth: "auto" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDeleteHistory} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>
                  <Calendar size={14} /> Chọn mốc thời gian cần xóa
                </label>
                <select 
                  className="input-field" 
                  value={timeframe} 
                  onChange={(e) => setTimeframe(e.target.value)}
                  style={{ background: "var(--bg-secondary)" }}
                >
                  <option value="day">Trong 24 giờ qua (1 Ngày)</option>
                  <option value="week">Trong 7 ngày qua (1 Tuần)</option>
                  <option value="month">Trong 30 ngày qua (1 Tháng)</option>
                  <option value="older_30_days">Cũ hơn 30 ngày trước</option>
                  <option value="all">Tất cả lịch sử mượn/trả từ trước tới nay</option>
                </select>
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>
                  <Filter size={14} /> Loại phiếu áp dụng
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "rgba(255,255,255,0.03)", padding: "12px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px" }}>
                    <input 
                      type="radio" 
                      name="onlyReturned" 
                      checked={onlyReturned === true} 
                      onChange={() => setOnlyReturned(true)} 
                    />
                    <span>Chỉ xóa phiếu <strong>Đã trả</strong> <span style={{ fontSize: "12px", color: "var(--success)" }}>(Khuyên dùng - An toàn)</span></span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px" }}>
                    <input 
                      type="radio" 
                      name="onlyReturned" 
                      checked={onlyReturned === false} 
                      onChange={() => setOnlyReturned(false)} 
                    />
                    <span style={{ color: "var(--danger)" }}>Xóa tất cả (Bao gồm phiếu đang mượn)</span>
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-danger" disabled={deleting} style={{ flex: 1 }}>
                  {deleting ? "Đang xóa..." : "Xác nhận xóa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBorrowsPage;
