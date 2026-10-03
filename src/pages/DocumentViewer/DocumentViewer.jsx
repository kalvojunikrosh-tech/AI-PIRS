import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  ArrowLeft,
  FileText,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Copy,
  Tag,
  Calendar,
  Layers,
  HardDrive,
  Info,
  Shield,
  Eye,
  Check,
  Share2
} from "lucide-react";
import "./DocumentViewer.css";

export default function DocumentViewer() {
  const { selectedDocument, setCurrentPage, askAI, addToast } = useApp();
  const [activeTab, setActiveTab] = useState("insights"); // 'insights' | 'details' | 'text'
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copiedText, setCopiedText] = useState(false);

  const doc = selectedDocument || {
    id: "doc-2",
    name: "BTech_Certificate.pdf",
    type: "pdf",
    extension: "PDF",
    size: "320 KB",
    uploadedAt: "2026-09-15T11:20:00Z",
    modifiedAt: "2026-09-15T11:20:00Z",
    isIndexed: true,
    pages: 1,
    collection: "Certificates",
    summary: "Official Degree Certificate conferring Bachelor of Technology in Computer Science & Engineering with First Class with Distinction.",
    keywords: ["Bachelor of Technology", "Computer Science", "Distinction", "CGPA 9.18"],
    detectedEntities: [
      { type: "PERSON", label: "Recipient", value: "Arun Kumar" },
      { type: "ID", label: "Roll Number", value: "21BCE10482" },
      { type: "DEGREE", label: "Degree", value: "B.Tech Computer Science & Engineering" }
    ],
    extractedText: "JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY..."
  };

  const handleCopyText = () => {
    navigator.clipboard?.writeText(doc.extractedText);
    setCopiedText(true);
    addToast("Extracted OCR text copied to clipboard!", "info");
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleAskAboutDoc = () => {
    askAI(`What are the key details and entities in ${doc.name}?`, doc);
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
            onClick={() => addToast(`Downloaded ${doc.name}`, "success")}
            title="Download document"
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
            {/* Visual simulation of certificate/marksheet/document page */}
            {doc.visualType === "certificate" || doc.name.includes("Certificate") ? (
              <div className="canvas-certificate-sheet">
                <div className="cert-border-outer">
                  <div className="cert-border-inner">
                    <div className="cert-seal-badge">★ OFFICIAL CREDENTIAL ★</div>
                    <div className="cert-issuer">
                      {doc.name.includes("Python") ? "STANFORD ONLINE / COURSERA" : "JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY"}
                    </div>
                    <div className="cert-headline">CERTIFICATE OF ACCOMPLISHMENT</div>
                    <div className="cert-body-text">This is proudly presented to:</div>
                    <div className="cert-recipient-name">ARUN KUMAR</div>
                    <div className="cert-detail-paragraph">
                      {doc.summary}
                    </div>
                    <div className="cert-credential-id">
                      RECORD ID: AIPIRS-VERIFIED-{doc.id.toUpperCase()}-2026
                    </div>
                    <div className="cert-signatures-row">
                      <div className="cert-sig-line">
                        <div className="sig-handwriting">Dr. K. Radhakrishnan</div>
                        <div className="sig-title">Dean / Academic Registrar</div>
                      </div>
                      <div className="cert-stamp-circle">
                        <span>SEAL OF AUTHENTICITY</span>
                      </div>
                      <div className="cert-sig-line">
                        <div className="sig-handwriting">Vikram Sengupta</div>
                        <div className="sig-title">Director & Verification Lead</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : doc.name.includes("Passport") ? (
              <div className="canvas-passport-sheet">
                <div className="passport-header-bar">
                  <span>REPUBLIC OF INDIA / RÉPUBLIQUE DE L'INDE</span>
                  <span>PASSPORT</span>
                </div>
                <div className="passport-body">
                  <div className="passport-photo-mock">
                    <div className="passport-avatar-box">AK</div>
                    <span className="photo-label">PHOTO</span>
                  </div>
                  <div className="passport-info-grid">
                    <div>
                      <label>TYPE / TYPE</label>
                      <p>P</p>
                    </div>
                    <div>
                      <label>COUNTRY CODE</label>
                      <p>IND</p>
                    </div>
                    <div>
                      <label>PASSPORT NO.</label>
                      <p className="highlight-field">Z9182736</p>
                    </div>
                    <div>
                      <label>SURNAME</label>
                      <p>KUMAR</p>
                    </div>
                    <div>
                      <label>GIVEN NAMES</label>
                      <p>ARUN</p>
                    </div>
                    <div>
                      <label>NATIONALITY</label>
                      <p>INDIAN</p>
                    </div>
                    <div>
                      <label>DATE OF BIRTH</label>
                      <p>14/08/2003</p>
                    </div>
                    <div>
                      <label>DATE OF EXPIRY</label>
                      <p className="highlight-field">11/03/2031</p>
                    </div>
                  </div>
                </div>
                <div className="passport-mrz">
                  P&lt;INDKUMAR&lt;&lt;ARUN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
                  Z9182736&lt;9IND0308144M3103118&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02
                </div>
              </div>
            ) : (
              /* Standard Formatted Document / Report / Resume Canvas */
              <div className="canvas-paper-sheet">
                <div className="paper-header-strip">
                  <div className="paper-doc-title-raw">{doc.name}</div>
                  <span className="paper-pages-tag">{doc.pages} Page{doc.pages > 1 ? "s" : ""}</span>
                </div>
                <div className="paper-text-preview">
                  <pre>{doc.extractedText}</pre>
                </div>
              </div>
            )}
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
