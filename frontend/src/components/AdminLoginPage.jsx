import { LockKeyhole, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { API_BASE_URL } from "../utils/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@smabda.test");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login gagal");
      }

      localStorage.setItem("smabda_admin_token", result.data.token);
      localStorage.setItem("smabda_admin_name", result.data.admin.name);
      localStorage.setItem("smabda_admin_role", result.data.admin.role);
      localStorage.setItem("smabda_admin_id", result.data.admin.id);
      window.location.hash = "#admin";
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <span className="admin-login-icon">
          <LockKeyhole size={30} />
        </span>
        <p className="admin-eyebrow">Admin SMABDA</p>
        <h1>Masuk Dashboard</h1>
        <p className="admin-muted">Kelola pendaftar PPDB, berita, pengumuman, dan konten website dari satu tempat.</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <div className="admin-input">
              <Mail size={18} />
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
            </div>
          </label>
          <label>
            <span>Password</span>
            <div className="admin-input">
              <LockKeyhole size={18} />
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
            </div>
          </label>
          {message && <p className="admin-error">{message}</p>}
          <button className="admin-primary-button" type="submit" disabled={isLoading}>
            <LogIn size={19} />
            {isLoading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </section>
    </main>
  );
}
