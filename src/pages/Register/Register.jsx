import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  CheckCircle2
} from "lucide-react";
import "../Login/Login.css";

export default function Register() {
  const { setCurrentPage, setIsAuthenticated, setCurrentUser, addToast } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      addToast("Please fill in your name and email.", "error");
      return;
    }
    if (password !== confirmPassword) {
      addToast("Passwords do not match.", "error");
      return;
    }
    setCurrentUser(prev => ({
      ...prev,
      name: name.trim(),
      email: email.trim()
    }));
    setIsAuthenticated(true);
    setCurrentPage("overview");
    addToast("Account created successfully! Welcome to AI-PIRS.", "success");
  };

  return (
    <div className="auth-split-container">
      {/* Left Brand Column */}
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
            <Sparkles size={14} /> Intelligent Knowledge Vault
          </div>
          <h1 className="auth-hero-heading">
            Start your intelligent<br />
            <span>storage journey.</span>
          </h1>
          <p className="auth-hero-sub">
            Join thousands of users who have transformed their scattered PDFs, certificates, and records into an instant conversational knowledge vault.
          </p>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="feature-icon-box">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div className="feature-title">15 GB Free High-Speed Storage</div>
                <div className="feature-desc">Ample space for thousands of PDF documents, receipts & scans.</div>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-icon-box">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="feature-title">Client-First Privacy Sandbox</div>
                <div className="feature-desc">Your documents stay isolated and are never used for public model training.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-brand-footer">
          <span>AI-PIRS Privacy Protected • ISO/IEC 27001 Certified Architecture</span>
        </div>
      </div>

      {/* Right Register Form Column */}
      <div className="auth-form-side">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Create your account</h2>
            <p className="auth-form-subtitle">Get started with your personal AI document intelligence vault.</p>
          </div>

          <form onSubmit={handleRegister} className="auth-actual-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>

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
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="Create strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn">
              <span>Create Account</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="auth-footer-prompt">
            Already have an account?{" "}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => setCurrentPage("login")}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
