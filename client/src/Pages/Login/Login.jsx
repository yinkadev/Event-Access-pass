import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const { data } = await api.post("/auth/login", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("accesspass-auth-change"));
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your details and try again.");
    } finally { setLoading(false); }
  };

  return <main className="auth-page"><section className="auth-card"><span className="auth-eyebrow">WELCOME BACK</span><h1>Log in to AccessPass</h1><p>Pick up where your next experience begins.</p>{error && <div className="auth-error" role="alert">{error}</div>}<form onSubmit={handleLogin}><label>Email address<input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} autoComplete="email" required /></label><label>Password<input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} autoComplete="current-password" required /></label><button type="submit" disabled={loading}>{loading ? "Logging in…" : "Log in"}</button></form><p className="auth-switch">New to AccessPass? <Link to="/register">Create an account</Link></p></section></main>;
}
export default Login;
