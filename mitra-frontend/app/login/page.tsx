"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { login, register } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  
  if (!email || !password) {
    setError("Please enter both email and password.");
    return;
  }
  
  setLoading(true);
  try {
    const response = await login(email, password);
    localStorage.setItem("mitra_authed", "true");
    window.location.href = "/";
  } catch (err: any) {
    setError(err.message || "Invalid credentials. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  
  if (!name || !email || !password || !phone) {
    setError("Please fill all fields.");
    return;
  }
  
  setLoading(true);
  try {
    await register({
      username: email.split('@')[0],
      password: password,
      email: email,
      mobile: phone,
      full_name: name,
      role: "customer"
    });
    
    setSuccess("Registration successful! You can now log in.");
    setTab("login");
    setName("");
    setPhone("");
    setEmail("");
    setPassword("");
  } catch (err: any) {
    setError(err.message || "Registration failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const inputStyle = {
    border: "1.5px solid #e0e7ff",
    background: "#f8faff",
    color: "#111827",
    outline: "none",
    width: "100%",
    padding: "14px 20px",
    borderRadius: "14px",
    fontSize: "15px",
    transition: "all 0.2s",
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden font-sans">

      {/* ── LEFT 50%: Image ── */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img
          src="/home-banner.png"
          alt="MITRA Sprayer"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)"
        }} />

        <div style={{ position: "absolute", top: 28, left: 28, zIndex: 10 }}>
          <div style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 14, padding: "10px 20px",
            display: "inline-flex", alignItems: "center"
          }}>
            <img src="/mitralogo.svg" alt="MITRA" width={110} height={42}
              style={{ filter: "brightness(0) invert(1)" }} />
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, padding: "28px 32px" }}>
          <p className="text-white font-black text-2xl leading-tight">
            Desh Ka No. 1 <span style={{ color: "#fbbf24" }}>Sprayer</span>
          </p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4 }}>
            Empowering Farmers with Mechanised Spraying Solutions
          </p>
          <div className="flex gap-6 mt-4">
            {[["15K+", "Farmers"], ["21K+", "Complaints Resolved"], ["291", "Engineers"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-white font-black text-lg leading-none">{v}</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT 50%: Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white relative overflow-hidden"
        style={{ padding: "32px 40px" }}>

        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 80% 5%, rgba(238,242,255,0.9) 0%, transparent 50%), radial-gradient(ellipse at 15% 95%, rgba(245,243,255,0.7) 0%, transparent 50%)"
        }} />

        <div className="relative w-full" style={{ maxWidth: 420 }}>

          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl" style={{
              padding: "20px 48px",
              boxShadow: "0 4px 24px rgba(99,102,241,0.1), 0 1px 4px rgba(0,0,0,0.05)",
              border: "2px solid #e0e7ff"
            }}>
              <img src="/mitralogo.svg" alt="MITRA" width={200} height={76} />
            </div>
          </div>

          <div className="flex rounded-2xl p-1 mb-6" style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: tab === t ? "#ffffff" : "transparent",
                  color: tab === t ? "#4338ca" : "#64748b",
                  boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  border: "none", cursor: "pointer"
                }}
              >
                {t === "login" ? <LogIn size={15} /> : <UserPlus size={15} />}
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <div className="text-center mb-5">
            <h2 className="text-3xl font-black" style={{ color: "#111827" }}>
              {tab === "login" ? (
                <>Log in to <span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>your Account</span></>
              ) : (
                <>Create <span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>New Account</span></>
              )}
            </h2>
            <p className="text-sm mt-1.5 font-medium" style={{ color: "#374151" }}>
              {tab === "login" ? "Enter your credentials to access the dashboard" : "Fill in the details to create your account"}
            </p>
          </div>

          {success && (
            <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-4"
              style={{ background: "#f0fdf4", border: "1.5px solid #86efac", color: "#15803d" }}>
              <span>✓</span><span>{success}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-4"
              style={{ background: "#fff1f2", border: "1.5px solid #fda4af", color: "#be123c" }}>
              <span>⚠</span><span>{error}</span>
            </div>
          )}

          {tab === "login" && (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: "#374151" }}>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mitra.com" 
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.background = "#fff"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "#e0e7ff"; e.target.style.background = "#f8faff"; }} 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "#374151" }}>Password</label>
                  <button type="button" className="text-xs font-semibold" style={{ color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    style={{ ...inputStyle, paddingRight: 52 }}
                    onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.background = "#fff"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "#e0e7ff"; e.target.style.background = "#f8faff"; }} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPwd(!showPassword)}
                    style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center justify-center gap-2 font-black uppercase tracking-widest text-white transition-all"
                style={{ 
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)", 
                  border: "none", 
                  borderRadius: 14, 
                  padding: "16px 24px", 
                  fontSize: 14, 
                  cursor: loading ? "not-allowed" : "pointer", 
                  boxShadow: "0 6px 20px rgba(99,102,241,0.4)", 
                  opacity: loading ? 0.8 : 1 
                }}
              >
                {loading
                  ? <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/></svg>Signing in…</>
                  : <>Login <ArrowRight size={18} /></>}
              </button>

              <p className="text-center text-sm" style={{ color: "#374151" }}>
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => setTab("register")} style={{ color: "#6366f1", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
                  Register here
                </button>
              </p>
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: "#374151" }}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name" 
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.background = "#fff"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "#e0e7ff"; e.target.style.background = "#f8faff"; }} 
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: "#374151" }}>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.background = "#fff"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "#e0e7ff"; e.target.style.background = "#f8faff"; }} 
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: "#374151" }}>Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 00000 00000" 
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.background = "#fff"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "#e0e7ff"; e.target.style.background = "#f8faff"; }} 
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: "#374151" }}>Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password" 
                    style={{ ...inputStyle, paddingRight: 52 }}
                    onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.background = "#fff"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "#e0e7ff"; e.target.style.background = "#f8faff"; }} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPwd(!showPassword)}
                    style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center justify-center gap-2 font-black uppercase tracking-widest text-white transition-all"
                style={{ 
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)", 
                  border: "none", 
                  borderRadius: 14, 
                  padding: "16px 24px", 
                  fontSize: 14, 
                  cursor: loading ? "not-allowed" : "pointer", 
                  boxShadow: "0 6px 20px rgba(99,102,241,0.4)", 
                  opacity: loading ? 0.8 : 1 
                }}
              >
                {loading
                  ? <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/></svg>Registering…</>
                  : <><UserPlus size={18} />Create Account</>}
              </button>

              <p className="text-center text-sm" style={{ color: "#374151" }}>
                Already have an account?{" "}
                <button type="button" onClick={() => setTab("login")} style={{ color: "#6366f1", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}