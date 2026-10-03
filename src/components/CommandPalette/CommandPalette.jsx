import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { performGlobalSearch } from "../../data/mockSearchResults";
import {
  Search,
  Sparkles,
  FileText,
  Folder,
  Clock,
  ArrowRight,
  X,
  CornerDownLeft
} from "lucide-react";
import "./CommandPalette.css";

export default function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    documents,
    collections,
    openDocumentViewer,
    setCurrentPage,
    setSelectedCollectionFilter,
    askAI
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const searchResults = performGlobalSearch(searchQuery, documents, collections);

  const handleAskAIQuery = (query) => {
    setIsCommandPaletteOpen(false);
    askAI(query);
  };

  const handleOpenDoc = (docId) => {
    setIsCommandPaletteOpen(false);
    openDocumentViewer(docId);
  };

  const handleSelectCollection = (colName) => {
    setIsCommandPaletteOpen(false);
    setSelectedCollectionFilter(colName);
    setCurrentPage("documents");
  };

  return (
    <div className="command-palette-backdrop" onClick={() => setIsCommandPaletteOpen(false)}>
      <div
        className="command-palette-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global search command palette"
      >
        <div className="command-palette-input-wrap">
          <Search size={20} className="palette-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="command-palette-input"
            placeholder="Search documents, information, or ask AI..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && searchQuery.trim()) {
                handleAskAIQuery(searchQuery);
              }
            }}
          />
          {searchQuery ? (
            <button className="palette-clear-btn" onClick={() => setSearchQuery("")}>
              <X size={16} />
            </button>
          ) : (
            <kbd className="palette-kbd">ESC</kbd>
          )}
        </div>

        <div className="command-palette-results">
          {/* AI Answers Section */}
          {searchResults.aiAnswers && searchResults.aiAnswers.length > 0 && (
            <div className="palette-section">
              <div className="palette-section-title">
                <Sparkles size={13} color="var(--color-orange)" />
                <span>Ask AI Retrieval</span>
              </div>
              {searchResults.aiAnswers.map((item, idx) => (
                <div
                  key={idx}
                  className="palette-result-item"
                  onClick={() => handleAskAIQuery(item.query)}
                >
                  <div className="result-item-icon ai-icon">
                    <Sparkles size={16} />
                  </div>
                  <div className="result-item-info">
                    <div className="result-title">{item.title}</div>
                    <div className="result-sub">Generates grounded answer with source citations</div>
                  </div>
                  <CornerDownLeft size={14} className="result-arrow-action" />
                </div>
              ))}
            </div>
          )}

          {/* Documents Section */}
          {searchResults.documents && searchResults.documents.length > 0 && (
            <div className="palette-section">
              <div className="palette-section-title">
                <FileText size={13} />
                <span>Documents ({searchResults.documents.length})</span>
              </div>
              {searchResults.documents.map(doc => (
                <div
                  key={doc.id}
                  className="palette-result-item"
                  onClick={() => handleOpenDoc(doc.id)}
                >
                  <div className="result-item-icon doc-icon">
                    <FileText size={16} />
                  </div>
                  <div className="result-item-info">
                    <div className="result-title">{doc.name}</div>
                    <div className="result-sub">{doc.collection} • {doc.size} • {doc.summary.slice(0, 75)}...</div>
                  </div>
                  <span className="badge badge-indexed">Indexed</span>
                </div>
              ))}
            </div>
          )}

          {/* Collections Section */}
          {searchResults.collections && searchResults.collections.length > 0 && (
            <div className="palette-section">
              <div className="palette-section-title">
                <Folder size={13} />
                <span>Collections</span>
              </div>
              {searchResults.collections.map(col => (
                <div
                  key={col.id}
                  className="palette-result-item"
                  onClick={() => handleSelectCollection(col.name)}
                >
                  <div className="result-item-icon folder-icon">
                    <Folder size={16} />
                  </div>
                  <div className="result-item-info">
                    <div className="result-title">{col.name}</div>
                    <div className="result-sub">{col.count} documents • {col.description}</div>
                  </div>
                  <ArrowRight size={14} className="result-arrow-action" />
                </div>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {searchResults.recentSearches && searchResults.recentSearches.length > 0 && (
            <div className="palette-section">
              <div className="palette-section-title">
                <Clock size={13} />
                <span>Suggested / Recent Searches</span>
              </div>
              {searchResults.recentSearches.map((term, idx) => (
                <div
                  key={idx}
                  className="palette-result-item"
                  onClick={() => handleAskAIQuery(term)}
                >
                  <div className="result-item-icon clock-icon">
                    <Clock size={15} />
                  </div>
                  <div className="result-item-info">
                    <div className="result-title">{term}</div>
                  </div>
                  <span className="result-hint">Press Enter</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="command-palette-footer">
          <div className="palette-shortcuts">
            <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
            <span><kbd>↵</kbd> to select</span>
            <span><kbd>esc</kbd> to close</span>
          </div>
          <div className="palette-brand-tag">AI-PIRS Search Engine</div>
        </div>
      </div>
    </div>
  );
}
