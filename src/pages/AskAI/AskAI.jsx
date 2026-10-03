import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  ExternalLink,
  ChevronRight,
  CornerDownLeft,
  RotateCcw,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  SlidersHorizontal,
  Info
} from "lucide-react";
import "./AskAI.css";

export default function AskAI() {
  const {
    conversations,
    setConversations,
    askAI,
    openDocumentViewer,
    documents,
    currentUser,
    addToast
  } = useApp();

  const [inputQuery, setInputQuery] = useState("");
  const [selectedCollectionScope, setSelectedCollectionScope] = useState("all");
  const [copiedId, setCopiedId] = useState(null);
  const inputRef = useRef(null);

  const samplePrompts = [
    "What internships have I completed?",
    "Where is my Aadhaar number?",
    "When does my passport expire?",
    "Find the invoice from March",
    "What was my semester 3 percentage?",
    "Which certificate mentions Python?"
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      askAI(inputQuery);
      setInputQuery("");
    }
  };

  const handlePromptClick = (text) => {
    askAI(text);
  };

  const handleCopyAnswer = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    addToast("Answer copied to clipboard", "info");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="ask-ai-page">
      {/* Workspace Header */}
      <div className="ask-ai-header">
        <div className="ask-ai-heading-block">
          <div className="ask-ai-title-wrap">
            <h1 className="page-title">
              Ask AI
              <span className="badge badge-orange" style={{ fontSize: "0.75rem", padding: "3px 8px" }}>
                Grounding Engine v2.4
              </span>
            </h1>
            <p className="page-subtitle">
              Find information across your personal documents with page-level citations.
            </p>
          </div>
        </div>

        <div className="ask-ai-header-actions">
          <div className="scope-selector-wrap">
            <SlidersHorizontal size={14} color="var(--text-muted)" />
            <span className="scope-label">Scope:</span>
            <select
              className="scope-select"
              value={selectedCollectionScope}
              onChange={e => setSelectedCollectionScope(e.target.value)}
            >
              <option value="all">All Documents ({documents.length})</option>
              <option value="academic">Academic Records</option>
              <option value="certificates">Certificates</option>
              <option value="identity">Identity Documents</option>
              <option value="finance">Invoices & Bills</option>
            </select>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setConversations([]);
              addToast("Conversation cleared.", "info");
            }}
            title="Clear all conversation history"
          >
            <RotateCcw size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Intelligent Workspace Area */}
      <div className="ask-ai-workspace">
        {/* Top Query Input Console */}
        <div className="ai-console-card">
          <form onSubmit={handleSend} className="ai-console-form">
            <div className="ai-console-input-row">
              <div className="ai-input-sparkle">
                <Sparkles size={20} />
              </div>
              <input
                ref={inputRef}
                type="text"
                className="ai-console-input"
                placeholder="Ask any question about your documents, certificates, bills, or records..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
              />
              <button
                type="submit"
                className="ai-send-btn"
                disabled={!inputQuery.trim()}
                title="Send query (Enter)"
              >
                <span>Ask AI</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {/* Quick Prompts Bar */}
          <div className="ai-prompts-bar">
            <span className="prompts-title">Quick Queries:</span>
            <div className="prompts-slider">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="quick-prompt-btn"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation Stream / Results List */}
        <div className="conversation-stream">
          {conversations.length === 0 ? (
            <div className="empty-conversation-state">
              <div className="empty-ai-icon">
                <Sparkles size={32} />
              </div>
              <h3 className="empty-title">Your personal document intelligence workspace</h3>
              <p className="empty-desc">
                Ask questions about your uploaded PDFs, receipts, certificates, and ID documents.
                AI-PIRS answers using neural search and verifies every claim with page citations.
              </p>
              <div className="empty-chips-row">
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePromptClick("What internships have I completed?")}
                >
                  <FileText size={16} color="var(--color-orange)" />
                  <span>"What internships have I completed?"</span>
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePromptClick("When does my passport expire?")}
                >
                  <ShieldCheck size={16} color="var(--color-success)" />
                  <span>"When does my passport expire?"</span>
                </button>
              </div>
            </div>
          ) : (
            conversations.map((conv, index) => (
              <div key={conv.id || index} className="conversation-thread-card">
                {/* User Query Bubble */}
                <div className="user-query-row">
                  <div className="user-query-avatar">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="user-query-bubble">
                    <div className="user-query-text">{conv.question}</div>
                    <div className="user-query-time">{conv.timestamp}</div>
                  </div>
                </div>

                {/* AI Response Bubble */}
                <div className="ai-response-container">
                  <div className="ai-response-badge-bar">
                    <div className="ai-trust-badge">
                      <ShieldCheck size={16} className="trust-icon" />
                      <span className="trust-text">
                        {conv.trustBadge || "Answer generated from your indexed documents."}
                      </span>
                    </div>

                    <div className="ai-response-actions">
                      <button
                        className="btn-icon-tiny"
                        onClick={() => handleCopyAnswer(`${conv.answer}\n${conv.structuredData?.map(s => `${s.title}: ${s.summary}`).join('\n')}`, conv.id)}
                        title="Copy answer"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        className="btn-icon-tiny"
                        onClick={() => addToast("Thank you for your feedback!", "success")}
                        title="Helpful"
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button
                        className="btn-icon-tiny"
                        onClick={() => addToast("Feedback noted for retrieval tuning.", "info")}
                        title="Needs improvement"
                      >
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Natural Language Summary */}
                  <div className="ai-main-answer-text">
                    {conv.answer}
                  </div>

                  {/* Structured Information List */}
                  {conv.structuredData && conv.structuredData.length > 0 && (
                    <div className="structured-results-list">
                      {conv.structuredData.map((item, sIdx) => (
                        <div key={sIdx} className="structured-item-card">
                          <div className="structured-item-number">{sIdx + 1}</div>
                          <div className="structured-item-content">
                            <div className="structured-item-header">
                              <span className="structured-title">{item.title}</span>
                              <span className="structured-org">{item.organization}</span>
                              {item.period && (
                                <span className="structured-period">{item.period}</span>
                              )}
                            </div>
                            <div className="structured-summary">{item.summary}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SOURCE-BASED RECOVERY (CRITICAL COMPONENT) */}
                  {conv.sources && conv.sources.length > 0 && (
                    <div className="sources-recovery-section">
                      <div className="sources-section-heading">
                        <FileText size={15} color="var(--color-orange)" />
                        <span>Sources ({conv.sources.length})</span>
                        <span className="sources-hint">— Click any source card to inspect page</span>
                      </div>

                      <div className="sources-cards-grid">
                        {conv.sources.map((src, srcIdx) => (
                          <div
                            key={srcIdx}
                            className="source-citation-card"
                            onClick={() => openDocumentViewer(src.docId)}
                            title={`Open ${src.docName} (Page ${src.page}) in Document Viewer`}
                          >
                            <div className="source-card-top">
                              <div className="source-doc-info">
                                <FileText size={16} className="source-pdf-icon" />
                                <span className="source-doc-name">{src.docName}</span>
                              </div>
                              <span className="source-relevance-pill">
                                {src.relevance}% relevant
                              </span>
                            </div>

                            <div className="source-card-middle">
                              <span className="source-page-badge">Page {src.page}</span>
                              <div className="source-snippet">
                                "{src.snippet}"
                              </div>
                            </div>

                            <div className="source-card-bottom">
                              <span className="source-cta">
                                Open Document
                                <ExternalLink size={12} />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
