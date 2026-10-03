import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  ArrowRight,
  FileText,
  HardDrive,
  CheckCircle2,
  Folder,
  UploadCloud,
  ChevronRight,
  MoreVertical,
  ExternalLink,
  MessageSquare,
  GraduationCap,
  Award,
  User,
  FolderKanban,
  Clock,
  ShieldAlert
} from "lucide-react";
import "./Dashboard.css";

const ICON_MAP = {
  GraduationCap,
  Award,
  User,
  FolderKanban,
  Folder
};

export default function Dashboard() {
  const {
    currentUser,
    documents,
    collections,
    openDocumentViewer,
    setCurrentPage,
    setSelectedCollectionFilter,
    askAI,
    setIsUploadModalOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");

  const suggestionChips = [
    "Where is my Aadhaar number?",
    "When does my passport expire?",
    "Find the invoice from March",
    "What was my semester 3 percentage?",
    "Which certificate mentions Python?"
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      askAI(searchQuery);
    }
  };

  const handleChipClick = (chipText) => {
    setSearchQuery(chipText);
    askAI(chipText);
  };

  // Recent documents list
  const recentDocs = documents.slice(0, 4);

  // Collections preview: Academic, Certificates, Personal, Projects
  const previewCollections = collections.filter(c =>
    ["Academic", "Certificates", "Personal", "Projects"].includes(c.name)
  );

  return (
    <div className="dashboard-page">
      {/* Header Greeting */}
      <div className="dashboard-greeting-section">
        <div>
          <h1 className="greeting-title">
            Good morning, {currentUser.name.split(" ")[0]} 👋
          </h1>
          <p className="greeting-subtitle">
            Your personal information, intelligently searchable.
          </p>
        </div>

        <button
          className="btn btn-primary greeting-upload-btn"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <UploadCloud size={16} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Main Feature: Large AI Search Box */}
      <div className="main-search-wrapper">
        <form onSubmit={handleSearchSubmit} className="main-search-box">
          <div className="search-input-prefix">
            <Sparkles size={20} className="search-sparkle-icon" />
          </div>
          <input
            type="text"
            className="main-search-input"
            placeholder="Ask anything about your documents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="main-search-submit-btn"
            disabled={!searchQuery.trim()}
            title="Ask AI"
          >
            <span>Ask AI</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="suggestion-chips-container">
          <span className="chips-label">Try asking:</span>
          <div className="chips-list">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="suggestion-chip"
                onClick={() => handleChipClick(chip)}
              >
                <span>{chip}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Compact Dashboard Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap stat-docs">
            <FileText size={18} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Documents</div>
            <div className="stat-value">{documents.length + 114}</div>
          </div>
          <div className="stat-trend">+4 this week</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-storage">
            <HardDrive size={18} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Storage Used</div>
            <div className="stat-value">2.4 GB</div>
          </div>
          <div className="stat-sub">of 15 GB quota</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-indexed">
            <CheckCircle2 size={18} />
          </div>
          <div className="stat-content">
            <div className="stat-label">AI Indexed</div>
            <div className="stat-value">{documents.length + 108}</div>
          </div>
          <div className="stat-badge">100% Ready</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-collections">
            <Folder size={18} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Collections</div>
            <div className="stat-value">{collections.length}</div>
          </div>
          <div className="stat-sub">Smart categories</div>
        </div>
      </div>

      {/* Two Column Layout: Recent Documents & Collections */}
      <div className="dashboard-content-grid">
        {/* Left Column: Recent Documents */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Recent Documents</h2>
              <p className="section-sub">Latest files indexed into your personal vault</p>
            </div>
            <button
              className="btn-ghost section-action-btn"
              onClick={() => setCurrentPage("documents")}
            >
              <span>View all ({documents.length})</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="recent-docs-list">
            {recentDocs.map(doc => (
              <div key={doc.id} className="recent-doc-card">
                <div className="doc-icon-wrap">
                  <FileText size={20} color="var(--color-orange)" />
                </div>

                <div className="doc-info-block" onClick={() => openDocumentViewer(doc.id)}>
                  <div className="doc-filename">{doc.name}</div>
                  <div className="doc-meta-tags">
                    <span className="doc-ext-tag">{doc.extension}</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>Modified {new Date(doc.modifiedAt).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                  </div>
                </div>

                <div className="doc-badge-status">
                  <span className="badge badge-indexed">
                    <CheckCircle2 size={12} /> Indexed
                  </span>
                </div>

                <div className="doc-actions-wrap">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => openDocumentViewer(doc.id)}
                    title="Open in Document Viewer"
                  >
                    Open
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => askAI(`Tell me about ${doc.name}`, doc)}
                    title="Ask AI about this document"
                  >
                    <Sparkles size={14} color="var(--color-orange)" />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Collections */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Collections</h2>
              <p className="section-sub">Grouped for swift retrieval & contextual scope</p>
            </div>
            <button
              className="btn-ghost section-action-btn"
              onClick={() => setCurrentPage("collections")}
            >
              <span>All collections</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="collections-preview-grid">
            {previewCollections.map(col => {
              const Icon = ICON_MAP[col.icon] || Folder;
              return (
                <div
                  key={col.id}
                  className="collection-preview-card"
                  onClick={() => {
                    setSelectedCollectionFilter(col.name);
                    setCurrentPage("documents");
                  }}
                >
                  <div className="col-preview-icon" style={{ backgroundColor: `${col.color}15`, color: col.color }}>
                    <Icon size={20} />
                  </div>
                  <div className="col-preview-info">
                    <div className="col-preview-name">{col.name}</div>
                    <div className="col-preview-count">{col.count} documents</div>
                    <div className="col-preview-desc">{col.description}</div>
                  </div>
                  <ChevronRight size={16} className="col-arrow" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
