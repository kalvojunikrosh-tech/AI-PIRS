import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  ArrowLeft,
  FileText,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Download,
  Copy,
  Check,
  Info
} from "lucide-react";
import "./DocumentViewer.css";

export default function DocumentViewer() {
  const { selectedDocument, setCurrentPage, askAI, addToast } = useApp();
  const [activeTab, setActiveTab] = useState("insights"); // 'insights' | 'details' | 'text'
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copiedText, setCopiedText] = useState(false);

  if (!selectedDocument) {
    return (
      <div className="viewer-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 120px)" }}>
        <div style={{ textAlign: "center", padding: "48px 32px", background: "var(--card-bg)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)", maxWidth: "440px" }}>
          <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", background: "rgba(243, 106, 33, 0.1)", color: "var(--color-orange)", marginBottom: "16px" }}>
            <FileText size={36} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "8px" }}>No Document Selected</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "20px" }}>
            Select an uploaded document from your library or upload a new file to view extracted text, page layers, and detected entities.
          </p>
          <button className="btn btn-primary" onClick={() => setCurrentPage("documents")}>
            <ArrowLeft size={16} />
            <span>Go to Documents</span>
          </button>
        </div>
      </div>
    );
  }

  const doc = selectedDocument;

  const handleCopyText = () => {
    if (!doc.extractedText) return;
    navigator.clipboard?.writeText(doc.extractedText);
    setCopiedText(true);
    addToast("Extracted document text copied to clipboard!", "info");
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([doc.extractedText || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast(`Exported extracted text for "${doc.name}"`, "success");
  };

  const handleAskAboutDoc = () => {
    askAI(`Summarize this document and list key facts from ${doc.name}`, doc);
  };

  return (
    <div className="viewer-page">
      {/* Top Bar inside Viewer */}
      <div className="viewer-top-bar">
        <div className="viewer-left-meta">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentPage("documents")}
            title="Back to documents"
          >
            <ArrowLeft size={16} />
            <span>Documents</span>
          </button>
          <div className="viewer-title-group">
            <span className="viewer-doc-title">{doc.name}</span>
            <span className="badge badge-indexed">
              <CheckCircle2 size={12} /> AI Indexed
            </span>
          </div>
        </div>

        <div className="viewer-center-controls">
          <button
            className="viewer-ctrl-btn"
            onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="zoom-indicator">{zoomLevel}%</span>
          <button
            className="viewer-ctrl-btn"
            onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <button
            className="viewer-ctrl-btn"
            onClick={() => setZoomLevel(100)}
            title="Reset Zoom"
          >
            Fit
          </button>
        </div>

        <div className="viewer-right-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAskAboutDoc}
          >
            <Sparkles size={14} />
            <span>Ask AI about this document</span>
          </button>
          <button
            className="btn-icon"
            onClick={handleDownload}
            title="Download extracted text"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Main Split Area: Large Realistic Preview + Right Information Panel */}
      <div className="viewer-workspace-split">
        {/* Left: Realistic Document Preview Canvas */}
        <div className="viewer-canvas-scroll">
          <div
            className="document-canvas-wrapper"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          >
            {/* Real Extracted Document Pages Canvas */}
            <div className="canvas-paper-sheet">
              <div className="paper-header-strip">
                <div className="paper-doc-title-raw">{doc.name}</div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span className="grid-collection-pill">{doc.collection}</span>
                  <span className="paper-pages-tag">{doc.pages} Page{doc.pages > 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Detected entities bar if any entities were recognized */}
              {doc.detectedEntities && doc.detectedEntities.length > 0 && (
                <div style={{ padding: "12px 18px", background: "rgba(37, 99, 235, 0.05)", borderBottom: "1px solid var(--border-color)", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--color-primary, #2563EB)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Extracted Entities:</span>
                  {doc.detectedEntities.map((ent, eIdx) => (
                    <span key={eIdx} style={{ fontSize: "0.78rem", background: "var(--card-bg)", padding: "3px 8px", borderRadius: "6px", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                      <strong>{ent.label}:</strong> {ent.value}
                    </span>
                  ))}
                </div>
              )}

              {/* Render pages */}
              <div className="paper-text-preview" style={{ padding: "20px" }}>
                {doc.pagesText && doc.pagesText.length > 1 ? (
                  doc.pagesText.map(p => (
                    <div key={p.page} style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px dashed var(--border-color)" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>
                        — Page {p.page} —
                      </div>
                      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.9rem", lineHeight: "1.6", color: "var(--text-primary)" }}>
                        {p.text}
                      </pre>
                    </div>
                  ))
                ) : (
                  <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.9rem", lineHeight: "1.6", color: "var(--text-primary)" }}>
                    {doc.extractedText}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Information Panel */}
        <aside className="viewer-info-panel">
          {/* Tabs */}
          <div className="info-panel-tabs">
            <button
              className={`panel-tab-btn ${activeTab === "insights" ? "active" : ""}`}
              onClick={() => setActiveTab("insights")}
            >
              <Sparkles size={14} />
              <span>AI Insights</span>
            </button>
            <button
              className={`panel-tab-btn ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              <Info size={14} />
              <span>Details</span>
            </button>
            <button
              className={`panel-tab-btn ${activeTab === "text" ? "active" : ""}`}
              onClick={() => setActiveTab("text")}
            >
              <FileText size={14} />
              <span>Extracted Text</span>
            </button>
          </div>

          {/* Panel Content */}
          <div className="info-panel-scroll">
            {activeTab === "insights" && (
              <div className="tab-pane-insights">
                {/* Ask AI CTA banner */}
                <div className="ask-ai-quick-banner" onClick={handleAskAboutDoc}>
                  <Sparkles size={18} color="var(--color-orange)" />
                  <div>
                    <div className="banner-title">Ask AI about this document</div>
                    <div className="banner-sub">Query entities, dates, or summarize contents</div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="insight-section">
                  <div className="insight-section-title">
                    <span>Summary</span>
                  </div>
                  <p className="insight-summary-text">{doc.summary}</p>
                </div>

                {/* Detected Entities */}
                <div className="insight-section">
                  <div className="insight-section-title">
                    <span>Detected Entities ({doc.detectedEntities?.length || 0})</span>
                  </div>
                  <div className="entities-list">
                    {doc.detectedEntities?.map((ent, idx) => (
                      <div key={idx} className="entity-item-row">
                        <div className="entity-left">
                          <span className="entity-type-badge">{ent.type}</span>
                          <span className="entity-label">{ent.label}</span>
                        </div>
                        <span className="entity-value">{ent.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extracted Keywords */}
                <div className="insight-section">
                  <div className="insight-section-title">
                    <span>Keywords & Semantic Tags</span>
                  </div>
                  <div className="keywords-cloud">
                    {doc.keywords?.map((k, idx) => (
                      <span key={idx} className="keyword-chip">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="tab-pane-details">
                <div className="meta-detail-row">
                  <span className="meta-label">Filename</span>
                  <span className="meta-value font-mono">{doc.name}</span>
                </div>
                <div className="meta-detail-row">
                  <span className="meta-label">File Type</span>
                  <span className="meta-value">{doc.extension} Document</span>
                </div>
                <div className="meta-detail-row">
                  <span className="meta-label">File Size</span>
                  <span className="meta-value">{doc.size}</span>
                </div>
                <div className="meta-detail-row">
                  <span className="meta-label">Collection</span>
                  <span className="meta-value badge badge-neutral">{doc.collection}</span>
                </div>
                <div className="meta-detail-row">
                  <span className="meta-label">Uploaded</span>
                  <span className="meta-value">{new Date(doc.uploadedAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="meta-detail-row">
                  <span className="meta-label">Last Modified</span>
                  <span className="meta-value">{new Date(doc.modifiedAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="meta-detail-row">
                  <span className="meta-label">Pages</span>
                  <span className="meta-value">{doc.pages}</span>
                </div>
                <div className="meta-detail-row">
                  <span className="meta-label">AI Indexed</span>
                  <span className="meta-value badge badge-indexed">
                    <CheckCircle2 size={12} /> Yes (100% Quality)
                  </span>
                </div>
                <div className="meta-detail-row">
                  <span className="meta-label">Tenant Encryption</span>
                  <span className="meta-value">AES-256 GCM</span>
                </div>
              </div>
            )}

            {activeTab === "text" && (
              <div className="tab-pane-text">
                <div className="text-header-actions">
                  <span className="ocr-source-tag">Neural OCR Engine</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleCopyText}
                  >
                    {copiedText ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
                    <span>{copiedText ? "Copied" : "Copy Text"}</span>
                  </button>
                </div>
                <div className="raw-extracted-box">
                  <pre>{doc.extractedText}</pre>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
