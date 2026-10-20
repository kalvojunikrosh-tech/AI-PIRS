import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  X,
  FileCheck,
  AlertCircle,
  Folder,
  RefreshCw
} from "lucide-react";
import { extractDocumentContent } from "../../services/documentExtractor";
import { analyzeDocument } from "../../services/entityExtractor";
import "./UploadModal.css";

const STAGES = [
  { id: "uploading", label: "Uploaded", desc: "Reading file bytes into local sandbox" },
  { id: "reading", label: "Reading document", desc: "Parsing document structure & layers" },
  { id: "extracting", label: "Extracting text", desc: "Running document parsing & OCR extraction" },
  { id: "analyzing", label: "Analyzing content", desc: "Detecting identity numbers, dates & entities" },
  { id: "indexing", label: "Generating AI index", desc: "Building local search index for instant retrieval" }
];

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function UploadModal() {
  const { isUploadModalOpen, setIsUploadModalOpen, handleUploadComplete, collections, addToast } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFileItem, setSelectedFileItem] = useState(null); // { file, name, size, sizeBytes, type }
  const [targetCollection, setTargetCollection] = useState("Academic");
  const [uploadState, setUploadState] = useState("idle"); // idle, processing, complete, error
  const [progress, setProgress] = useState(0);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isUploadModalOpen) {
      setSelectedFileItem(null);
      setUploadState("idle");
      setProgress(0);
      setCurrentStageIdx(0);
      setErrorMessage("");
    }
  }, [isUploadModalOpen]);

  if (!isUploadModalOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file) => {
    const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
    setSelectedFileItem({
      file,
      name: file.name,
      size: formatBytes(file.size),
      sizeBytes: file.size,
      type: ext
    });
    setUploadState("idle");
    setErrorMessage("");
  };

  const startExtractionAndIngestion = async () => {
    if (!selectedFileItem || !selectedFileItem.file) return;

    const file = selectedFileItem.file;
    setUploadState("processing");
    setProgress(15);
    setCurrentStageIdx(0); // Uploaded
    setErrorMessage("");

    try {
      // Stage 1 & 2: Reading & Extracting
      setCurrentStageIdx(1); // Reading
      setProgress(30);

      const extraction = await extractDocumentContent(file, (stageName, pct) => {
        if (stageName === "extracting") {
          setCurrentStageIdx(2);
          setProgress(Math.max(45, pct));
        }
      });

      // Stage 3: Analyzing content & detecting entities
      setCurrentStageIdx(3);
      setProgress(80);
      await new Promise(r => setTimeout(r, 200));

      const analysis = analyzeDocument(file.name, extraction.extractedText);

      // Stage 4: Indexing
      setCurrentStageIdx(4);
      setProgress(100);
      await new Promise(r => setTimeout(r, 250));

      setUploadState("complete");

      // Complete upload and persist
      setTimeout(() => {
        handleUploadComplete({
          name: file.name,
          type: file.type.startsWith("image/") ? "image" : file.name.endsWith(".docx") ? "doc" : "pdf",
          extension: file.name.split(".").pop().toUpperCase(),
          size: selectedFileItem.size,
          sizeBytes: selectedFileItem.sizeBytes,
          pages: extraction.pages || 1,
          extractedText: extraction.extractedText,
          pagesText: extraction.pagesText,
          collection: targetCollection || analysis.collection,
          summary: analysis.summary,
          keywords: analysis.keywords,
          detectedEntities: analysis.detectedEntities,
          visualType: analysis.visualType
        });
      }, 700);

    } catch (err) {
      console.error("Document ingestion failed:", err);
      setUploadState("error");
      setErrorMessage(err.message || "Failed to parse document text. Please verify file integrity.");
      addToast(err.message || "Extraction failed", "error");
    }
  };

  return (
    <div className="upload-modal-backdrop" onClick={() => setIsUploadModalOpen(false)}>
      <div
        className="upload-modal-container"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Upload document modal"
      >
        {/* Modal Header */}
        <div className="upload-modal-header">
          <div>
            <h3 className="upload-modal-title">Upload Documents</h3>
            <p className="upload-modal-sub">
              Upload real documents to extract text, detect entities, and build local search indexes.
            </p>
          </div>
          <button
            className="upload-modal-close"
            onClick={() => setIsUploadModalOpen(false)}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="upload-modal-body">
          {uploadState === "idle" && (
            <>
              {/* Dropzone */}
              <div
                className={`upload-dropzone ${dragActive ? "drag-active" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileInput}
                  accept=".pdf,.docx,.txt,.md,.csv,.json,.png,.jpg,.jpeg,.webp"
                />
                <div className="dropzone-icon-circle">
                  <UploadCloud size={28} />
                </div>
                <div className="dropzone-title">Drop your documents here</div>
                <div className="dropzone-sub">
                  or <span className="browse-link">browse files</span> from your computer
                </div>
                <div className="dropzone-supported-tags">
                  <span className="file-tag">PDF</span>
                  <span className="file-tag">DOCX</span>
                  <span className="file-tag">TXT</span>
                  <span className="file-tag">CSV</span>
                  <span className="file-tag">JSON</span>
                  <span className="file-tag">PNG</span>
                  <span className="file-tag">JPG</span>
                </div>
              </div>

              {/* Selected file preview */}
              {selectedFileItem && (
                <div className="selected-files-list">
                  <div className="selected-file-card">
                    <FileText size={20} color="var(--color-orange)" />
                    <div className="selected-file-info">
                      <div className="selected-file-name">{selectedFileItem.name}</div>
                      <div className="selected-file-meta">{selectedFileItem.size} • {selectedFileItem.type}</div>
                    </div>
                    <button
                      className="selected-file-remove"
                      onClick={() => setSelectedFileItem(null)}
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="target-collection-wrap">
                    <label className="target-collection-label">
                      <Folder size={14} /> Assign to Collection:
                    </label>
                    <select
                      className="target-collection-select"
                      value={targetCollection}
                      onChange={e => setTargetCollection(e.target.value)}
                    >
                      {collections.map(c => (
                        <option key={c.id} value={c.name}>{c.name} Collection</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Processing / Progress State */}
          {(uploadState === "processing" || uploadState === "complete") && (
            <div className="upload-processing-view">
              <div className="processing-doc-banner">
                <FileText size={22} color="var(--color-orange)" />
                <div style={{ flex: 1 }}>
                  <div className="processing-doc-name">{selectedFileItem?.name || "Document"}</div>
                  <div className="processing-doc-size">{selectedFileItem?.size} • Target: {targetCollection}</div>
                </div>
                <div className="processing-percent-badge">{progress}%</div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Step Checklist */}
              <div className="processing-checklist">
                <div className="checklist-heading">GENUINE INGESTION PIPELINE</div>
                {STAGES.map((stg, idx) => {
                  const isDone = idx < currentStageIdx || uploadState === "complete";
                  const isCurrent = idx === currentStageIdx && uploadState === "processing";

                  return (
                    <div
                      key={stg.id}
                      className={`checklist-item ${isDone ? "done" : isCurrent ? "active" : "pending"}`}
                    >
                      <div className="checklist-icon-wrap">
                        {isDone ? (
                          <CheckCircle2 size={16} color="var(--color-success)" />
                        ) : isCurrent ? (
                          <Loader2 size={16} className="spinner" color="var(--color-orange)" />
                        ) : (
                          <div className="pending-circle" />
                        )}
                      </div>
                      <div className="checklist-text">
                        <div className="checklist-title">{stg.label}</div>
                        <div className="checklist-desc">{stg.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {uploadState === "complete" && (
                <div className="ready-banner">
                  <FileCheck size={20} color="var(--color-success)" />
                  <span>Document text extracted & indexed into retrieval store!</span>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {uploadState === "error" && (
            <div className="upload-error-view" style={{ padding: "20px", textAlign: "center" }}>
              <div style={{ display: "inline-flex", padding: "12px", borderRadius: "50%", background: "#FEE2E2", color: "#EF4444", marginBottom: "12px" }}>
                <AlertCircle size={32} />
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px", color: "var(--text-primary)" }}>Extraction Failed</h4>
              <p style={{ color: "#EF4444", fontSize: "0.9rem", marginBottom: "16px", background: "#FEF2F2", padding: "10px", borderRadius: "8px" }}>
                {errorMessage}
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>
                Please check if the file is encrypted, password-protected, empty, or an unsupported file format.
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button className="btn btn-secondary" onClick={() => setUploadState("idle")}>
                  Select Another File
                </button>
                <button className="btn btn-primary" onClick={startExtractionAndIngestion}>
                  <RefreshCw size={14} /> Retry Extraction
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {uploadState === "idle" && (
          <div className="upload-modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={!selectedFileItem}
              onClick={startExtractionAndIngestion}
            >
              <UploadCloud size={16} />
              <span>Extract & Index</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
