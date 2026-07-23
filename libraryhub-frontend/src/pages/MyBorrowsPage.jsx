import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Clock, RotateCcw, CheckCircle } from "lucide-react";

const MyBorrowsPage = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBorrows = async () => {
    try {
      setLoading(true);
      const res = await API.get("/borrow/my-books");
      setBorrows(res.data.data || []);
    } catch (err) {
      toast.error("Không thể lấy danh sách mượn sách.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBorrows();
  }, []);

  const handleReturn = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn trả cuốn sách này?")) return;

    try {
      await API.put(`/borrow/return/${id}`);
      toast.success("Trả sách thành công!");
      fetchMyBorrows();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể trả sách.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "6px" }}>Sách đang mượn</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Danh sách các cuốn sách bạn đang mượn và hạn trả tương ứng</p>
      </div>

      {loading ? (
        <div style={{ color: "var(--text-muted)" }}>Đang tải...</div>
      ) : borrows.length === 0 ? (
        <div className="glass-panel" style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
          <CheckCircle size={48} style={{ margin: "0 auto 16px", color: "var(--success)", opacity: 0.8 }} />
          <h3>Bạn hiện không mượn cuốn sách nào</h3>
          <p style={{ marginTop: "8px", fontSize: "14px" }}>Hãy chọn mượn sách tại Thư viện sách bất cứ lúc nào!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {borrows.map(item => {
            const isOverdue = new Date(item.dueDate) < new Date();
            return (
              <div key={item._id} className="glass-panel" style={{ padding: "20px", display: "flex", gap: "16px" }}>
                <img 
                  src={item.book?.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150"} 
                  alt={item.book?.title}
                  style={{ width: "80px", height: "115px", objectFit: "cover", borderRadius: "8px" }}
                />
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>{item.book?.title}</h3>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>Tác giả: {item.book?.author}</div>

                  <div style={{ fontSize: "12px", color: isOverdue ? "var(--danger)" : "var(--warning)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                    <Clock size={14} />
                    <span>Hạn trả: <strong>{new Date(item.dueDate).toLocaleDateString("vi-VN")}</strong></span>
                    {isOverdue && <span style={{ fontWeight: "700" }}>(Quá hạn!)</span>}
                  </div>

                  <button onClick={() => handleReturn(item._id)} className="btn btn-secondary" style={{ marginTop: "auto", fontSize: "13px" }}>
                    <RotateCcw size={14} /> Trả sách ngay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBorrowsPage;
