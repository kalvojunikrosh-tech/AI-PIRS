import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Folder,
  FolderPlus,
  GraduationCap,
  Award,
  User,
  Receipt,
  Briefcase,
  FolderKanban,
  ShieldCheck,
  Archive,
  ArrowRight,
  X
} from "lucide-react";
import "./Collections.css";

const ICON_MAP = {
  GraduationCap,
  Award,
  User,
  Receipt,
  Briefcase,
  FolderKanban,
  ShieldCheck,
  Archive,
  Folder
};

export default function Collections() {
  const {
    collections,
    createCollection,
    setCurrentPage,
    setSelectedCollectionFilter
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [newColDesc, setNewColDesc] = useState("");
  const [selectedColor, setSelectedColor] = useState("#F36A21");

  const colors = [
    "#F36A21",
    "#D94E0B",
    "#2563EB",
    "#35A66F",
    "#8B5CF6",
    "#F59E0B",
    "#EC4899",
    "#059669"
  ];

  const handleOpenCollection = (colName) => {
    setSelectedCollectionFilter(colName);
    setCurrentPage("documents");
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    createCollection(newColName, newColDesc, selectedColor, "Folder");
    setIsModalOpen(false);
    setNewColName("");
    setNewColDesc("");
  };

  return (
    <div className="collections-page">
      {/* Header */}
      <div className="collections-header">
        <div>
          <h1 className="page-title">Collections</h1>
          <p className="page-subtitle">Organize your documents into meaningful groups.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <FolderPlus size={16} />
          <span>+ Create Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div style={{ padding: "48px 20px", textAlign: "center", background: "var(--card-bg)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)", margin: "20px 0" }}>
          <div style={{ display: "inline-flex", padding: "12px", borderRadius: "50%", background: "rgba(243, 106, 33, 0.1)", color: "var(--color-orange)", marginBottom: "12px" }}>
            <Folder size={28} />
          </div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "600", marginBottom: "6px" }}>No collections created yet</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "340px", margin: "0 auto 16px" }}>
            Create folders and collections to categorize your academic certificates, identity documents, and invoices.
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
            <FolderPlus size={14} /> Create First Collection
          </button>
        </div>
      ) : (
        <div className="collections-cards-grid">
          {collections.map(col => {
            const Icon = ICON_MAP[col.icon] || Folder;
            return (
              <div
                key={col.id}
                className="collection-card"
                onClick={() => handleOpenCollection(col.name)}
              >
                <div className="col-card-header">
                  <div
                    className="col-card-icon"
                    style={{ backgroundColor: `${col.color}15`, color: col.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <span className="col-doc-counter">
                    {col.count} documents
                  </span>
                </div>

                <div className="col-card-body">
                  <h3 className="col-name">{col.name}</h3>
                  <p className="col-desc">{col.description}</p>
                </div>

                <div className="col-card-footer">
                  <span className="col-updated-tag">Updated {col.updatedAt}</span>
                  <span className="col-explore-link">
                    <span>Explore</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Collection Modal */}
      {isModalOpen && (
        <div className="collection-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="collection-modal-box"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="collection-modal-header">
              <h3 className="modal-title">Create New Collection</h3>
              <button
                className="btn-icon-tiny"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="collection-modal-form">
              <div className="form-group">
                <label className="form-label">Collection Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Legal Documents, Medical Bills"
                  value={newColName}
                  onChange={e => setNewColName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: "80px", resize: "vertical" }}
                  placeholder="Describe what kind of documents will be stored here..."
                  value={newColDesc}
                  onChange={e => setNewColDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Accent Color</label>
                <div className="color-swatches-row">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-swatch-btn ${selectedColor === color ? "active" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Create Collection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
