import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  Sparkles,
  FileCheck,
  ScanText,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2
} from "lucide-react";
import "./Login.css";

export default function Login() {
  const { setCurrentPage, setIsAuthenticated, addToast } = useApp();
  const [email, setEmail] = useState("arun.k@domain.dev");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setCurrentPage("overview");
    addToast("Welcome back, Arun!", "success");
  };

  const handleGoogleSignIn = () => {
    setIsAuthenticated(true);
    setCurrentPage("overview");
    addToast("Signed in via Google Workspace.", "success");
  };

  return (
    <div className="auth-split-container">
      {/* Left Brand Editorial Column */}
      <div className="auth-brand-side">
        <div className="auth-brand-header">
          <div className="auth-logo-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="M12 18v-5"/>
              <path d="M9.5 15.5 12 13l2.5 2.5"/>
            </svg>
          </div>
          <div>
            <div className="auth-brand-name">AI-PIRS</div>
            <div className="auth-brand-subtitle">Personal Document Intelligence</div>
          </div>
        </div>

        <div className="auth-brand-content">
          <div className="auth-pill-badge">
            <Sparkles size={14} /> Next-Gen Document Retrieval
          </div>
          <h1 className="auth-hero-heading">
            Find anything<br />
            in your documents<br />
            <span>with AI.</span>
          </h1>
          <p className="auth-hero-sub">
            Upload, store, and intelligently retrieve information from your personal documents with citations back to the exact source page.
          </p>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="feature-icon-box">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="feature-title">Secure & Private</div>
                <div className="feature-desc">Zero training on personal data. End-to-end tenant isolation.</div>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-icon-box">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="feature-title">AI-Powered Search</div>
                <div className="feature-desc">Ask in natural language without remembering file names.</div>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-icon-box">
                <FileCheck size={18} />
              </div>
              <div>
                <div className="feature-title">Source-Based Answers</div>
                <div className="feature-desc">Every response is strictly grounded with page and line citations.</div>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-icon-box">
                <ScanText size={18} />
              </div>
              <div>
                <div className="feature-title">OCR for Documents</div>
                <div className="feature-desc">Handles scans, ID cards, certificates, bills, and PDF marks reports.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-brand-footer">
          <span>Trusted by 10,000+ researchers, engineers & students</span>
          <div className="auth-trust-dots">
            <span className="trust-dot active" />
            <span className="trust-dot" />
            <span className="trust-dot" />
          </div>
        </div>
      </div>

      {/* Right Login Form Column */}
      <div className="auth-form-side">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-subtitle">Enter your credentials to access your document workspace.</p>
          </div>

          <form onSubmit={handleSignIn} className="auth-actual-form">
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-with-action">
                <label className="form-label">Password</label>
                <button
                  type="button"
                  className="form-link-btn"
                  onClick={() => addToast("Password reset link sent to your email.", "info")}
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span>Remember this device for 30 days</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn">
              <span>Sign In</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <button type="button" className="btn-social-auth" onClick={handleGoogleSignIn}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="auth-footer-prompt">
            Don't have an account?{" "}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => setCurrentPage("register")}
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
