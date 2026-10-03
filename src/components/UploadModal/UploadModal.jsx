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
  Folder
} from "lucide-react";
import "./UploadModal.css";

const STAGES = [
  { id: "uploading", label: "Uploaded", desc: "Transferring file bytes to encrypted storage" },
  { id: "reading", label: "Reading document", desc: "Parsing document structure & layers" },
  { id: "extracting", label: "Extracting text", desc: "Running neural OCR & text extraction" },
  { id: "analyzing", label: "Analyzing content", desc: "Detecting entities, dates & semantic relationships" },
  { id: "indexing", label: "Generating AI index", desc: "Computing vector embeddings for instant retrieval" }
];

export default function UploadModal() {
  const { isUploadModalOpen, setIsUploadModalOpen, handleUploadComplete, collections } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [targetCollection, setTargetCollection] = useState("Academic");
  const [uploadState, setUploadState] = useState("idle"); // idle, processing, complete
  const [progress, setProgress] = useState(0);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isUploadModalOpen) {
      setSelectedFiles([]);
      setUploadState("idle");
      setProgress(0);
      setCurrentStageIdx(0);
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
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    const valid = files.map(f => ({
      name: f.name,
      size: `${Math.round(f.size / 1024) || 320} KB`,
      type: f.name.split('.').pop()?.toUpperCase() || 'PDF'
    }));
    setSelectedFiles(valid);
  };

  const startSimulation = () => {
    if (selectedFiles.length === 0) return;
    setUploadState("processing");
    setProgress(15);
    setCurrentStageIdx(0);

    // Multi-step realistic progress simulator
    const stepInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(stepInterval);
          setUploadState("complete");
          setTimeout(() => {
            handleUploadComplete({
              name: selectedFiles[0].name,
              size: selectedFiles[0].size,
              collection: targetCollection
            });
          }, 900);
          return 100;
        }

        const next = prev + 18;
        if (next >= 85) setCurrentStageIdx(4);
        else if (next >= 65) setCurrentStageIdx(3);
        else if (next >= 45) setCurrentStageIdx(2);
        else if (next >= 25) setCurrentStageIdx(1);
        else setCurrentStageIdx(0);

        return Math.min(next, 100);
      });
    }, 450);
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
              Upload files to OCR scan, extract entities, and build neural search embeddings.
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
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileInput}
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
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
                  <span className="file-tag">PNG</span>
                  <span className="file-tag">JPG</span>
                  <span className="file-tag">JPEG</span>
                  <span className="file-tag">DOCX</span>
                </div>
              </div>

              {/* Sample Quick Demo Files button if user doesn't have a file ready */}
              <div className="quick-demo-files">
                <span className="quick-label">Or test with mock document:</span>
                <button
                  type="button"
                  className="quick-file-chip"
                  onClick={() => setSelectedFiles([{ name: "Stanford_AI_Ethics_Certificate.pdf", size: "295 KB", type: "PDF" }])}
                >
                  <FileText size={14} /> Stanford_AI_Ethics_Certificate.pdf
                </button>
                <button
                  type="button"
                  className="quick-file-chip"
                  onClick={() => setSelectedFiles([{ name: "Q3_Investment_Statement.pdf", size: "410 KB", type: "PDF" }])}
                >
                  <FileText size={14} /> Q3_Investment_Statement.pdf
                </button>
              </div>

              {/* Selected Files Preview & Collection Target */}
              {selectedFiles.length > 0 && (
                <div className="selected-files-section">
                  <div className="selected-file-card">
                    <FileText size={20} color="var(--color-orange)" />
                    <div className="selected-file-info">
                      <div className="selected-file-name">{selectedFiles[0].name}</div>
                      <div className="selected-file-meta">{selectedFiles[0].size} • {selectedFiles[0].type}</div>
                    </div>
                    <button
                      className="selected-file-remove"
                      onClick={() => setSelectedFiles([])}
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
                  <div className="processing-doc-name">{selectedFiles[0]?.name || "Document.pdf"}</div>
                  <div className="processing-doc-size">{selectedFiles[0]?.size || "320 KB"} • Target: {targetCollection}</div>
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
                <div className="checklist-heading">AI INGESTION PIPELINE</div>
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
                  <span>Document indexed & ready for natural language retrieval!</span>
                </div>
              )}
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
              disabled={selectedFiles.length === 0}
              onClick={startSimulation}
            >
              <UploadCloud size={16} />
              <span>Start Ingestion</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
