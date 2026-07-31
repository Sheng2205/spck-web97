import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { X, User, Image, Check, Sparkles } from "lucide-react";

// Preset avatars curated for library/book theme
const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Library",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Scholar"
];

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setUserName(user.userName || "");
      setAvatar(user.avatar || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error("Tên người dùng không được để trống.");
      return;
    }

    try {
      setSubmitting(true);
      await updateProfile({ userName: userName.trim(), avatar });
      toast.success("Cập nhật thông tin thành công!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px"
    }} onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "32px",
          borderRadius: "var(--radius-lg)",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid var(--border-color)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              display: "flex", alignItems: "center", justifyContent: "center", color: "white"
            }}>
              <Sparkles size={20} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Hồ sơ cá nhân</h3>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-secondary" 
            style={{ padding: "6px", borderRadius: "50%", minWidth: "auto" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Avatar Preview */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            width: "84px",
            height: "84px",
            borderRadius: "50%",
            margin: "0 auto 12px",
            background: "var(--bg-secondary)",
            border: "3px solid var(--accent-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: "0 8px 24px var(--accent-glow)"
          }}>
            {avatar ? (
              <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setAvatar("")} />
            ) : (
              <User size={40} color="var(--accent-primary)" />
            )}
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{user?.email}</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Username Field */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>
              Tên người dùng
            </label>
            <div style={{ position: "relative" }}>
              <input 
                type="text" 
                className="input-field" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                placeholder="Nhập tên người dùng mới"
                required
              />
            </div>
          </div>

          {/* Preset Avatars Selection */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>
              Chọn Ảnh đại diện gợi ý
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "12px" }}>
              {PRESET_AVATARS.map((url, idx) => (
                <div 
                  key={idx}
                  onClick={() => setAvatar(url)}
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: "12px",
                    background: "var(--bg-secondary)",
                    border: avatar === url ? "2px solid var(--accent-primary)" : "1px solid var(--border-color)",
                    cursor: "pointer",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    transition: "var(--transition)"
                  }}
                >
                  <img src={url} alt={`Preset ${idx}`} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                  {avatar === url && (
                    <div style={{
                      position: "absolute", top: "4px", right: "4px", background: "var(--accent-primary)",
                      borderRadius: "50%", padding: "2px", color: "white"
                    }}>
                      <Check size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Custom Avatar URL Field */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>
              <Image size={14} /> Hoặc nhập đường dẫn Ảnh (URL)
            </label>
            <input 
              type="url" 
              className="input-field" 
              value={avatar} 
              onChange={(e) => setAvatar(e.target.value)} 
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1 }}>
              {submitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
