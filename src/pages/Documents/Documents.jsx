import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  UploadCloud,
  Search,
  Grid,
  List,
  FileText,
  CheckCircle2,
  MoreVertical,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Sparkles,
  Trash2,
  Eye,
  FileSpreadsheet,
  FileImage,
  Folder
} from "lucide-react";
import "./Documents.css";

export default function Documents() {
  const {
    documents,
    openDocumentViewer,
    deleteDocument,
    askAI,
    setIsUploadModalOpen,
    documentFilter,
    setDocumentFilter,
    selectedCollectionFilter,
    setSelectedCollectionFilter,
    documentSort,
    setDocumentSort,
    viewMode,
    setViewMode,
    collections
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuDocId, setActiveMenuDocId] = useState(null);

  // Filter logic
  let filtered = documents.filter(doc => {
    // Search query match
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchSummary = doc.summary.toLowerCase().includes(q);
      const matchKeywords = doc.keywords.some(k => k.toLowerCase().includes(q));
      if (!matchName && !matchSummary && !matchKeywords) return false;
    }

    // Type filter
    if (documentFilter === "PDF" && doc.type !== "pdf") return false;
    if (documentFilter === "Images" && doc.type !== "image") return false;
    if (documentFilter === "Documents" && doc.type !== "doc" && doc.type !== "pdf") return false;

    // Collection filter
    if (selectedCollectionFilter !== "All" && doc.collection !== selectedCollectionFilter) {
      return false;
    }

    return true;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (documentSort === "modified") {
      return new Date(b.modifiedAt) - new Date(a.modifiedAt);
    }
    if (documentSort === "uploaded") {
      return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    }
    if (documentSort === "name") {
      return a.name.localeCompare(b.name);
    }
    if (documentSort === "size") {
      return (b.sizeBytes || 0) - (a.sizeBytes || 0);
    }
    return 0;
  });

  const getDocIcon = (type) => {
    if (type === "image") return <FileImage size={24} color="#8B5CF6" />;
    return <FileText size={24} color="var(--color-orange)" />;
  };

  return (
    <div className="documents-page">
      {/* Page Header */}
      <div className="documents-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">Manage and explore your personal information.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <UploadCloud size={16} />
          <span>+ Upload Document</span>
        </button>
      </div>

      {/* Control Bar: Search, Type Filters, Collection Scope, Sort, View Toggle */}
      <div className="documents-controls-bar">
        {/* Search documents input */}
        <div className="docs-search-input-wrap">
          <Search size={16} className="docs-search-icon" />
          <input
            type="text"
            className="docs-search-input"
            placeholder="Search documents by name, content, or tags..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Type Filter Tabs */}
        <div className="docs-filter-tabs">
          {["All", "PDF", "Images", "Documents"].map(tab => (
            <button
              key={tab}
              className={`filter-tab-btn ${documentFilter === tab ? "active" : ""}`}
              onClick={() => setDocumentFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Collection Selector */}
        <div className="docs-dropdown-select-wrap">
          <Folder size={14} color="var(--text-muted)" />
          <select
            className="docs-select"
            value={selectedCollectionFilter}
            onChange={e => setSelectedCollectionFilter(e.target.value)}
          >
            <option value="All">All Collections</option>
            {collections.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="docs-dropdown-select-wrap">
          <ArrowUpDown size={14} color="var(--text-muted)" />
          <select
            className="docs-select"
            value={documentSort}
            onChange={e => setDocumentSort(e.target.value)}
          >
            <option value="modified">Recently modified</option>
            <option value="uploaded">Recently uploaded</option>
            <option value="name">Name (A-Z)</option>
            <option value="size">Size</option>
          </select>
        </div>

        {/* Grid / List View Toggle */}
        <div className="view-mode-toggle">
          <button
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
            aria-label="Grid view"
          >
            <Grid size={16} />
          </button>
          <button
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List view"
            aria-label="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Filter summary status if scoped */}
      {selectedCollectionFilter !== "All" && (
        <div className="collection-filter-banner">
          <span>Filtered by collection: <strong>{selectedCollectionFilter}</strong></span>
          <button
            className="btn-ghost btn-sm"
            onClick={() => setSelectedCollectionFilter("All")}
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Documents Grid / List */}
      {filtered.length === 0 ? (
        <div className="empty-docs-container">
          <div className="empty-docs-icon">
            <FileText size={36} />
          </div>
          <h3 className="empty-docs-title">Your information starts here.</h3>
          <p className="empty-docs-desc">
            {searchTerm || selectedCollectionFilter !== "All"
              ? "No relevant documents found matching your filter criteria. Try clearing filters or uploading more documents."
              : "Upload your first document and let AI-PIRS make it intelligently searchable."}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <UploadCloud size={16} />
            <span>Upload Document</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="documents-cards-grid">
          {filtered.map(doc => (
            <div key={doc.id} className="doc-grid-card">
              {/* Card Top */}
              <div className="grid-card-header">
                <div className="doc-icon-square">
                  {getDocIcon(doc.type)}
                </div>
                <div className="grid-card-badges">
                  <span className="badge badge-indexed">
                    <CheckCircle2 size={11} /> AI Indexed
                  </span>
                  <div style={{ position: "relative" }}>
                    <button
                      className="btn-icon-tiny"
                      onClick={() => setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id)}
                      aria-label="More options"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeMenuDocId === doc.id && (
                      <div className="doc-item-menu">
                        <button
                          className="doc-menu-item"
                          onClick={() => {
                            openDocumentViewer(doc.id);
                            setActiveMenuDocId(null);
                          }}
                        >
                          <Eye size={14} /> Open Viewer
                        </button>
                        <button
                          className="doc-menu-item"
                          onClick={() => {
                            askAI(`Summarize ${doc.name}`, doc);
                            setActiveMenuDocId(null);
                          }}
                        >
                          <Sparkles size={14} color="var(--color-orange)" /> Ask AI
                        </button>
                        <div className="dropdown-divider" />
                        <button
                          className="doc-menu-item danger"
                          onClick={() => {
                            deleteDocument(doc.id);
                            setActiveMenuDocId(null);
                          }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="grid-card-body" onClick={() => openDocumentViewer(doc.id)}>
                <div className="grid-doc-name" title={doc.name}>
                  {doc.name}
                </div>
                <div className="grid-doc-summary">
                  {doc.summary}
                </div>
              </div>

              {/* Card Footer */}
              <div className="grid-card-footer">
                <div className="grid-meta-left">
                  <span className="grid-collection-pill">{doc.collection}</span>
                  <span className="grid-doc-size">{doc.size}</span>
                </div>
                <div className="grid-actions-right">
                  <button
                    className="grid-action-btn"
                    onClick={() => openDocumentViewer(doc.id)}
                    title="Open Document Viewer"
                  >
                    Open
                  </button>
                  <button
                    className="grid-action-btn primary"
                    onClick={() => askAI(`What are the key points in ${doc.name}?`, doc)}
                    title="Ask AI"
                  >
                    <Sparkles size={13} /> Ask AI
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List / Table View */
        <div className="documents-list-table-wrap">
          <table className="documents-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Collection</th>
                <th>Size</th>
                <th>Modified</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id} className="table-doc-row">
                  <td>
                    <div className="table-doc-cell" onClick={() => openDocumentViewer(doc.id)}>
                      <FileText size={18} color="var(--color-orange)" />
                      <div>
                        <div className="table-doc-name">{doc.name}</div>
                        <div className="table-doc-snippet">{doc.summary.slice(0, 60)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="grid-collection-pill">{doc.collection}</span>
                  </td>
                  <td className="table-muted-text">{doc.size}</td>
                  <td className="table-muted-text">
                    {new Date(doc.modifiedAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td>
                    <span className="badge badge-indexed">
                      <CheckCircle2 size={11} /> AI Indexed
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="table-actions-cell">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openDocumentViewer(doc.id)}
                      >
                        Open
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => askAI(`Analyze ${doc.name}`, doc)}
                      >
                        <Sparkles size={13} color="var(--color-orange)" />
                        <span>Ask AI</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
