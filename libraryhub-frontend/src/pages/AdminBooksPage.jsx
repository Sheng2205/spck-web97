import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, X } from "lucide-react";

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Công nghệ",
    description: "",
    quantity: 1,
    image: ""
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/books?limit=100");
      setBooks(res.data.data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách sách.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openCreateModal = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      category: "Công nghệ",
      description: "",
      quantity: 1,
      image: ""
    });
    setShowModal(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description || "",
      quantity: book.quantity,
      image: book.image || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa cuốn sách này?")) return;
    try {
      await API.delete(`/books/${id}`);
      toast.success("Xóa sách thành công!");
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa sách.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await API.put(`/books/${editingBook._id}`, formData);
        toast.success("Cập nhật sách thành công!");
      } else {
        await API.post("/books", formData);
        toast.success("Thêm sách mới thành công!");
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi lưu thông tin sách.");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "6px" }}>Quản lý sách</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Quản lý kho sách (Thêm, sửa, xóa) dành cho Admin</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Thêm sách mới
        </button>
      </div>

      {loading ? (
        <div style={{ color: "var(--text-muted)" }}>Đang tải...</div>
      ) : (
        <div className="glass-panel" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", background: "rgba(15, 23, 42, 0.4)" }}>
                <th style={{ padding: "16px" }}>Bìa</th>
                <th style={{ padding: "16px" }}>Tên sách</th>
                <th style={{ padding: "16px" }}>Tác giả</th>
                <th style={{ padding: "16px" }}>Thể loại</th>
                <th style={{ padding: "16px" }}>Tổng số</th>
                <th style={{ padding: "16px" }}>Khả dụng</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <img 
                      src={book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100"} 
                      alt="" 
                      style={{ width: "36px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                    />
                  </td>
                  <td style={{ padding: "16px", fontWeight: "600" }}>{book.title}</td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>{book.author}</td>
                  <td style={{ padding: "16px" }}><span className="badge badge-user">{book.category}</span></td>
                  <td style={{ padding: "16px" }}>{book.quantity}</td>
                  <td style={{ padding: "16px", color: book.available > 0 ? "var(--success)" : "var(--danger)" }}>{book.available}</td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <button onClick={() => openEditModal(book)} className="btn btn-secondary" style={{ padding: "6px 10px", marginRight: "8px" }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(book._id)} className="btn btn-danger" style={{ padding: "6px 10px" }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: "540px", padding: "28px", position: "relative" }}>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", right: "20px", top: "20px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>
              {editingBook ? "Cập nhật thông tin sách" : "Thêm sách mới"}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>Tên sách</label>
                <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>Tác giả</label>
                  <input type="text" className="input-field" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>Thể loại</label>
                  <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="Công nghệ">Công nghệ</option>
                    <option value="Văn học">Văn học</option>
                    <option value="Kinh tế">Kinh tế</option>
                    <option value="Kỹ năng sống">Kỹ năng sống</option>
                    <option value="Khoa học">Khoa học</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>Số lượng</label>
                  <input type="number" min="1" className="input-field" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>Link ảnh bìa (URL)</label>
                  <input type="text" className="input-field" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>Mô tả</label>
                <textarea className="input-field" style={{ minHeight: "80px" }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooksPage;
