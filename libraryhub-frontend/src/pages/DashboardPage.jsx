import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { BookOpen, BookmarkCheck, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import QuoteBanner from "../components/QuoteBanner";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ books: 0, borrows: 0, users: 0 });
  const [recentBooks, setRecentBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksRes = await API.get("/books?limit=4");
        setRecentBooks(booksRes.data.data || []);
        setStats(prev => ({ ...prev, books: booksRes.data.totalBooks || 0 }));

        const myBorrowsRes = await API.get("/borrow/my-books");
        setMyBorrows(myBorrowsRes.data.data || []);
        setStats(prev => ({ ...prev, borrows: myBorrowsRes.data.data?.length || 0 }));

        if (user?.role === "Admin") {
          const usersRes = await API.get("/users");
          setStats(prev => ({ ...prev, users: usersRes.data.data?.length || 0 }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div style={{ color: "var(--text-muted)" }}>Đang tải bảng điều khiển...</div>;

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "6px" }}>
          Xin chào, {user?.userName} 👋
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Chào mừng bạn quay trở lại với thư viện tri thức LibraryHub.
        </p>
      </div>

      {/* Quote Banner Component */}
      <QuoteBanner />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "36px" }}>
        <div className="glass-panel" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.15)", color: "var(--accent-primary)" }}>
            <BookOpen size={28} />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "700" }}>{stats.books}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Tổng số đầu sách</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(217, 119, 6, 0.15)", color: "var(--warning)" }}>
            <BookmarkCheck size={28} />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "700" }}>{stats.borrows}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Sách bạn đang mượn</div>
          </div>
        </div>

        {user?.role === "Admin" && (
          <div className="glass-panel" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(168, 85, 247, 0.15)", color: "var(--accent-primary)" }}>
              <Users size={28} />
            </div>
            <div>
              <div style={{ fontSize: "24px", fontWeight: "700" }}>{stats.users}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Thành viên hệ thống</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Sách mới bổ sung</h3>
            <Link to="/books" style={{ fontSize: "13px", color: "var(--accent-primary)", fontWeight: "600" }}>Xem tất cả →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentBooks.slice(0, 4).map(book => (
              <div key={book._id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)" }}>
                <img 
                  src={book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100"} 
                  alt={book.title} 
                  style={{ width: "40px", height: "56px", objectFit: "cover", borderRadius: "6px" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>{book.title}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{book.author}</div>
                </div>
                <span className="badge badge-user">{book.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Sách cần trả sắp tới</h3>
            <Link to="/my-borrows" style={{ fontSize: "13px", color: "var(--accent-primary)", fontWeight: "600" }}>Chi tiết →</Link>
          </div>
          {myBorrows.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "30px 0" }}>
              Bạn chưa mượn cuốn sách nào.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {myBorrows.slice(0, 4).map(item => (
                <div key={item._id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", background: "var(--bg-secondary)" }}>
                  <Clock size={20} color="var(--warning)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>{item.book?.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Hạn trả: {new Date(item.dueDate).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                  <span className="badge badge-borrowing">Đang mượn</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
