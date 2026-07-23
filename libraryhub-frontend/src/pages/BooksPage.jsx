import { useState, useEffect } from "react";
import API from "../api/axios";
import { Search, Filter, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/books?page=${page}&limit=8&search=${search}&category=${category}`);
      setBooks(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "6px" }}>Thư viện sách</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Khám phá các đầu sách đa dạng có sẵn trong thư viện</p>
      </div>

      <div className="glass-panel" style={{ padding: "16px", marginBottom: "28px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: "260px", display: "flex", gap: "8px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Tìm kiếm theo tên sách..."
              style={{ paddingLeft: "42px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Tìm kiếm</button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Filter size={18} color="var(--text-muted)" />
          <select 
            className="input-field" 
            style={{ width: "180px" }}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">Tất cả thể loại</option>
            <option value="Công nghệ">Công nghệ</option>
            <option value="Văn học">Văn học</option>
            <option value="Kinh tế">Kinh tế</option>
            <option value="Kỹ năng sống">Kỹ năng sống</option>
            <option value="Khoa học">Khoa học</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>Đang tải danh sách sách...</div>
      ) : books.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <BookOpen size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
          <div>Không tìm thấy cuốn sách nào phù hợp.</div>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px", marginBottom: "32px" }}>
            {books.map(book => (
              <div key={book._id} className="glass-panel" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <img 
                  src={book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300"} 
                  alt={book.title} 
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <span className="badge badge-user" style={{ width: "fit-content", marginBottom: "8px" }}>{book.category}</span>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px", lineHeight: 1.3 }}>{book.title}</h3>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>Tác giả: {book.author}</div>
                  
                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
                    <span style={{ fontSize: "12px", color: book.available > 0 ? "var(--success)" : "var(--danger)" }}>
                      Sẵn có: {book.available}/{book.quantity}
                    </span>
                    <Link to={`/books/${book._id}`} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
              <button 
                className="btn btn-secondary" 
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
              >
                Trang trước
              </button>
              <span style={{ padding: "10px 16px", color: "var(--text-muted)", fontSize: "14px" }}>
                Trang {page} / {totalPages}
              </span>
              <button 
                className="btn btn-secondary" 
                disabled={page === totalPages}
                onClick={() => setPage(prev => prev + 1)}
              >
                Trang sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BooksPage;
