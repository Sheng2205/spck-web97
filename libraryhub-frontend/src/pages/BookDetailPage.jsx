import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { ArrowLeft, BookOpen, Calendar, CheckCircle } from "lucide-react";

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data.data);
      } catch (err) {
        toast.error("Không tìm thấy thông tin sách.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    if (!dueDate) {
      toast.error("Vui lòng chọn ngày trả sách.");
      return;
    }

    try {
      setBorrowing(true);
      await API.post("/borrow", { bookId: id, dueDate });
      toast.success("Mượn sách thành công!");
      navigate("/my-borrows");
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể mượn sách.");
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) return <div style={{ color: "var(--text-muted)" }}>Đang tải...</div>;
  if (!book) return <div style={{ color: "var(--danger)" }}>Sách không tồn tại.</div>;

  return (
    <div style={{ maxWidth: "900px" }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: "24px" }}>
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="glass-panel" style={{ padding: "32px", display: "grid", gridTemplateColumns: "280px 1fr", gap: "32px" }}>
        <div>
          <img 
            src={book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"} 
            alt={book.title}
            style={{ width: "100%", height: "380px", objectFit: "cover", borderRadius: "12px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="badge badge-user" style={{ width: "fit-content", marginBottom: "12px" }}>{book.category}</span>
          <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>{book.title}</h1>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>Tác giả: <strong style={{ color: "var(--text-main)" }}>{book.author}</strong></div>

          <div style={{ padding: "16px", background: "rgba(15, 23, 42, 0.4)", borderRadius: "8px", marginBottom: "24px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}>Mô tả nội dung</h4>
            <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--text-main)" }}>
              {book.description || "Chưa có mô tả cho cuốn sách này."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "20px", marginBottom: "28px" }}>
            <div style={{ flex: 1, padding: "12px 16px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Tổng số lượng</span>
              <div style={{ fontSize: "18px", fontWeight: "700", marginTop: "2px" }}>{book.quantity} cuốn</div>
            </div>
            <div style={{ flex: 1, padding: "12px 16px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Hiện còn sẵn</span>
              <div style={{ fontSize: "18px", fontWeight: "700", marginTop: "2px", color: book.available > 0 ? "var(--success)" : "var(--danger)" }}>
                {book.available} cuốn
              </div>
            </div>
          </div>

          {book.available > 0 ? (
            <div style={{ marginTop: "auto", display: "flex", gap: "16px", alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>Chọn hạn trả sách</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={dueDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <button onClick={handleBorrow} className="btn btn-primary" disabled={borrowing} style={{ padding: "12px 24px" }}>
                <BookOpen size={18} /> {borrowing ? "Đang xử lý..." : "Xác nhận mượn"}
              </button>
            </div>
          ) : (
            <div style={{ marginTop: "auto", padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", color: "var(--danger)", textAlign: "center", fontSize: "14px" }}>
              Sách hiện đã hết, bạn vui lòng quay lại sau!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
