import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  User,
  Sun,
  Moon,
  Bell,
  Shield,
  Key,
  HardDrive,
  Sliders,
  CheckCircle2,
  Save,
  Laptop,
  Smartphone,
  Trash2,
  RefreshCw,
  Sparkles
} from "lucide-react";
import "./Settings.css";

export default function Settings() {
  const { currentUser, setCurrentUser, theme, toggleTheme, addToast, documents } = useApp();
  const [activeTab, setActiveTab] = useState("profile");

  const totalBytes = (documents || []).reduce((acc, d) => acc + (d.sizeBytes || 0), 0);
  const pdfBytes = (documents || [])
    .filter(d => (d.type || "").toLowerCase().includes("pdf"))
    .reduce((acc, d) => acc + (d.sizeBytes || 0), 0);
  const imgBytes = (documents || [])
    .filter(d => ["jpg", "jpeg", "png", "webp"].includes((d.type || "").toLowerCase()))
    .reduce((acc, d) => acc + (d.sizeBytes || 0), 0);
  const otherBytes = Math.max(0, totalBytes - pdfBytes - imgBytes);

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const totalQuota = 15 * 1024 * 1024 * 1024; // 15 GB local/vault allocation
  const pdfPct = totalBytes > 0 ? Math.max(2, Math.min(100, (pdfBytes / totalQuota) * 100)) : 0;
  const imgPct = totalBytes > 0 ? Math.max(1, Math.min(100, (imgBytes / totalQuota) * 100)) : 0;
  const isMac = typeof navigator !== "undefined" && /mac/i.test(navigator.userAgent || navigator.platform || "");

  // Form states
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [bio, setBio] = useState(currentUser.bio);

  // Privacy toggles
  const [privateVault, setPrivateVault] = useState(true);
  const [historyLogging, setHistoryLogging] = useState(true);
  const [localEmbeddings, setLocalEmbeddings] = useState(true);

  // Security 2FA toggle
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // AI Preferences
  const [groundingStrictness, setGroundingStrictness] = useState("high");
  const [preferredModel, setPreferredModel] = useState("pirs-deep-recall");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "security", label: "Security", icon: Key },
    { id: "storage", label: "Storage", icon: HardDrive },
    { id: "ai-preferences", label: "AI Preferences", icon: Sliders }
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name,
      email,
      bio
    }));
    addToast("Profile details updated successfully!", "success");
  };

  return (
    <div className="settings-page">
      {/* Settings Header */}
      <div className="settings-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your personal document vault, preferences, and security.</p>
        </div>
      </div>

      {/* Clean Top Segmented Navigation Tabs - NO SIDEBAR */}
      <div className="settings-nav-tabs" role="tablist">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={`settings-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Tab Content */}
      <div className="settings-content-card">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="settings-section-form">
            <h2 className="settings-card-title">Personal Profile</h2>
            <p className="settings-card-desc">Update your personal account information and bio.</p>

            <div className="avatar-edit-row">
              <div className="avatar-preview-circle">
                {name.charAt(0)}
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => addToast("Profile image updated.", "info")}
                >
                  Change Avatar
                </button>
                <div className="avatar-meta-sub">JPG, PNG or GIF. Max size 2MB.</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio & Personal Context</label>
              <textarea
                className="form-input"
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
              <span className="field-hint">Used by AI-PIRS to disambiguate personal references in documents.</span>
            </div>

            <div className="settings-actions-bar">
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div className="settings-section-form">
            <h2 className="settings-card-title">Appearance & Theme</h2>
            <p className="settings-card-desc">Customize how AI-PIRS looks across all your devices.</p>

            <div className="theme-options-grid">
              <div
                className={`theme-card ${theme === "light" ? "active" : ""}`}
                onClick={() => theme === "dark" && toggleTheme()}
              >
                <div className="theme-preview-mock light-mock">
                  <div className="mock-bar" />
                  <div className="mock-body" />
                </div>
                <div className="theme-name">
                  <Sun size={16} />
                  <span>Warm Cream (Light)</span>
                </div>
              </div>

              <div
                className={`theme-card ${theme === "dark" ? "active" : ""}`}
                onClick={() => theme === "light" && toggleTheme()}
              >
                <div className="theme-preview-mock dark-mock">
                  <div className="mock-bar" />
                  <div className="mock-body" />
                </div>
                <div className="theme-name">
                  <Moon size={16} />
                  <span>Charcoal Obsidian (Dark)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="settings-section-form">
            <h2 className="settings-card-title">Notification Preferences</h2>
            <p className="settings-card-desc">Control what alerts you receive during document processing and queries.</p>

            <div className="settings-toggles-list">
              <div className="toggle-row">
                <div>
                  <div className="toggle-title">Document OCR & Indexing Complete</div>
                  <div className="toggle-desc">Notify when a newly uploaded PDF has completed vector extraction.</div>
                </div>
                <input type="checkbox" defaultChecked className="switch-input" />
              </div>

              <div className="toggle-row">
                <div>
                  <div className="toggle-title">Storage Limit Warnings</div>
                  <div className="toggle-desc">Alert when personal storage exceeds 80% of capacity.</div>
                </div>
                <input type="checkbox" defaultChecked className="switch-input" />
              </div>

              <div className="toggle-row">
                <div>
                  <div className="toggle-title">Security & New Session Logins</div>
                  <div className="toggle-desc">Receive security alerts on logins from unrecognized devices.</div>
                </div>
                <input type="checkbox" defaultChecked className="switch-input" />
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div className="settings-section-form">
            <h2 className="settings-card-title">Privacy & Data Isolation</h2>
            <p className="settings-card-desc">Your documents contain sensitive personal records. Manage access and retention.</p>

            <div className="settings-toggles-list">
              <div className="toggle-row">
                <div>
                  <div className="toggle-title">Zero-Training Tenant Isolation</div>
                  <div className="toggle-desc">Ensures embeddings and documents are never shared or used to train external models.</div>
                </div>
                <input
                  type="checkbox"
                  checked={privateVault}
                  onChange={e => setPrivateVault(e.target.checked)}
                  className="switch-input"
                />
              </div>

              <div className="toggle-row">
                <div>
                  <div className="toggle-title">Local Vector Caching</div>
                  <div className="toggle-desc">Caches encrypted document embeddings locally for offline semantic search.</div>
                </div>
                <input
                  type="checkbox"
                  checked={localEmbeddings}
                  onChange={e => setLocalEmbeddings(e.target.checked)}
                  className="switch-input"
                />
              </div>

              <div className="toggle-row">
                <div>
                  <div className="toggle-title">Conversational Query History</div>
                  <div className="toggle-desc">Save natural-language questions asked to the Ask AI workspace.</div>
                </div>
                <input
                  type="checkbox"
                  checked={historyLogging}
                  onChange={e => setHistoryLogging(e.target.checked)}
                  className="switch-input"
                />
              </div>
            </div>

            <div className="privacy-danger-zone">
              <div className="danger-zone-header">
                <div>
                  <div className="danger-title">Clear Document Query History</div>
                  <div className="danger-desc">Permanently remove all previous questions and grounding sessions.</div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => addToast("Query history wiped successfully.", "info")}
                >
                  <Trash2 size={14} /> Clear History
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="settings-section-form">
            <h2 className="settings-card-title">Security & Authentication</h2>
            <p className="settings-card-desc">Protect your personal documents with multi-factor authentication.</p>

            <div className="security-card-box">
              <div className="security-row">
                <div>
                  <div className="toggle-title">Two-Factor Authentication (2FA)</div>
                  <div className="toggle-desc">Require an authenticator app (Google Authenticator or 1Password) at sign in.</div>
                </div>
                <button
                  type="button"
                  className={`btn btn-sm ${twoFactorEnabled ? "btn-secondary" : "btn-primary"}`}
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    addToast(`2FA ${twoFactorEnabled ? "disabled" : "enabled"}.`, "info");
                  }}
                >
                  {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                </button>
              </div>
            </div>

            <h3 className="sub-heading">Active Sessions</h3>
            <div className="active-sessions-list">
              <div className="session-item">
                <Laptop size={20} color="var(--color-orange)" />
                <div className="session-info">
                  <div className="session-device">{isMac ? "MacBook Pro / macOS" : "Personal Workstation"} — Current Session</div>
                  <div className="session-location">Local Browser Sandbox • Encrypted Storage Active</div>
                </div>
                <span className="badge badge-indexed">Active Now</span>
              </div>
            </div>
          </div>
        )}

        {/* Storage Tab */}
        {activeTab === "storage" && (
          <div className="settings-section-form">
            <h2 className="settings-card-title">Storage Breakdown</h2>
            <p className="settings-card-desc">Manage your personal high-speed encrypted document quota.</p>

            <div className="storage-meter-box">
              <div className="storage-meter-top">
                <span className="storage-meter-bold">{formatSize(totalBytes)} used</span>
                <span className="storage-meter-total">of 15.0 GB total allocation</span>
              </div>
              <div className="storage-bar-track">
                {pdfPct > 0 && (
                  <div
                    className="storage-bar-seg pdf"
                    style={{ width: `${pdfPct}%` }}
                    title={`PDF Documents (${formatSize(pdfBytes)})`}
                  />
                )}
                {imgPct > 0 && (
                  <div
                    className="storage-bar-seg img"
                    style={{ width: `${imgPct}%` }}
                    title={`Scans & Images (${formatSize(imgBytes)})`}
                  />
                )}
              </div>
              <div className="storage-legend">
                <div className="legend-item"><span className="dot pdf" /> PDF Documents ({formatSize(pdfBytes)})</div>
                <div className="legend-item"><span className="dot img" /> Images & Scans ({formatSize(imgBytes)})</div>
                <div className="legend-item"><span className="dot free" /> Free Space ({formatSize(totalQuota - totalBytes)})</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Preferences Tab */}
        {activeTab === "ai-preferences" && (
          <div className="settings-section-form">
            <h2 className="settings-card-title">AI Grounding & Retrieval Tuning</h2>
            <p className="settings-card-desc">Configure the sensitivity and citation strictness for Ask AI.</p>

            <div className="form-group">
              <label className="form-label">Active Retrieval Engine</label>
              <select
                className="form-input"
                value={preferredModel}
                onChange={e => setPreferredModel(e.target.value)}
              >
                <option value="pirs-deep-recall">PIRS Deep Recall v2.4 (High Precision, Citation Verification)</option>
                <option value="pirs-fast-scan">PIRS Turbo Scan (Fast Summarization)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Grounding Strictness</label>
              <div className="strictness-selector">
                <label className="radio-pill">
                  <input
                    type="radio"
                    name="strictness"
                    value="strict"
                    checked={groundingStrictness === "strict"}
                    onChange={() => setGroundingStrictness("strict")}
                  />
                  <span>Strict (Require 90%+ source match)</span>
                </label>
                <label className="radio-pill">
                  <input
                    type="radio"
                    name="strictness"
                    value="high"
                    checked={groundingStrictness === "high"}
                    onChange={() => setGroundingStrictness("high")}
                  />
                  <span>Balanced (Recommended)</span>
                </label>
              </div>
            </div>

            <div className="settings-actions-bar">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addToast("AI Retrieval preferences saved!", "success")}
              >
                <Sparkles size={16} />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
