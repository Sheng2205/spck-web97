import { useState, useEffect } from "react";
import { Quote, RefreshCw } from "lucide-react";

const quotes = [
  { text: "Một cuốn sách hay là một người bạn tốt.", author: "Tục ngữ" },
  { text: "Việc đọc sách rất quan trọng. Nếu bạn biết cách đọc, cả thế giới sẽ mở ra trước mắt bạn.", author: "Barack Obama" },
  { text: "Sách là món quà duy nhất mà bạn có thể mở đi mở lại nhiều lần.", author: "Garrison Keillor" },
  { text: "Không có người bạn nào trung thành như một cuốn sách.", author: "Ernest Hemingway" },
  { text: "Đọc sách không chỉ để tích lũy kiến thức mà còn để khai sáng tâm hồn.", author: "Socrates" }
];

const QuoteBanner = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [index]);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
      setFade(true);
    }, 300);
  };

  return (
    <div className="glass-panel" style={{
      padding: "24px 28px",
      marginBottom: "32px",
      background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(217, 119, 6, 0.12))",
      borderLeft: "4px solid var(--accent-primary)",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        <div style={{
          padding: "10px",
          borderRadius: "12px",
          background: "var(--bg-secondary)",
          color: "var(--accent-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Quote size={24} />
        </div>
        <div style={{ flex: 1, opacity: fade ? 1 : 0, transition: "opacity 0.3s ease" }}>
          <p style={{ fontSize: "16px", fontStyle: "italic", fontWeight: "500", lineHeight: "1.6", color: "var(--text-main)", marginBottom: "6px" }}>
            "{quotes[index].text}"
          </p>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--accent-primary)" }}>
            — {quotes[index].author}
          </span>
        </div>
        <button 
          onClick={handleNext}
          className="btn btn-secondary" 
          style={{ padding: "8px", borderRadius: "50%", minWidth: "auto", color: "var(--text-muted)" }}
          title="Đổi câu trích dẫn"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuoteBanner;
