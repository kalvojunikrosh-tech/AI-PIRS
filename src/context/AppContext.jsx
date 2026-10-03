import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_DOCUMENTS } from "../data/mockDocuments";
import { INITIAL_COLLECTIONS } from "../data/mockCollections";
import { INITIAL_ACTIVITY } from "../data/mockActivity";
import { PRESET_CONVERSATIONS, generateGroundingAnswer } from "../data/mockConversations";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation & Auth state
  const [currentPage, setCurrentPage] = useState("overview"); // overview, ask-ai, documents, collections, activity, settings, document-viewer, login, register
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    name: "Arun Kumar",
    email: "arun.k@domain.dev",
    role: "Personal Account",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    bio: "Applied AI Engineer & Builder. Managing personal documents, academic archives, and identity records."
  });

  // Theme state ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("aipirs-theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("aipirs-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // Main data states
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
  const [activityList, setActivityList] = useState(INITIAL_ACTIVITY);
  const [conversations, setConversations] = useState([PRESET_CONVERSATIONS[0]]);
  
  // Document Viewer selection
  const [selectedDocId, setSelectedDocId] = useState("doc-4"); // Default to Internship_Certificate.pdf for direct demo flow
  const selectedDocument = documents.find(d => d.id === selectedDocId) || documents[0];

  // Filter/Sort states for Documents page
  const [documentFilter, setDocumentFilter] = useState("All"); // All, PDF, Images, Documents
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState("All");
  const [documentSort, setDocumentSort] = useState("modified"); // modified, uploaded, name, size
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  // Global search & command palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Preloaded query for Ask AI
  const [pendingQuery, setPendingQuery] = useState("");

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "AI Indexing Complete",
      description: "Resume.pdf was successfully indexed with 6 entities extracted.",
      time: "8 mins ago",
      read: false,
      type: "success"
    },
    {
      id: "notif-2",
      title: "Storage Usage Alert",
      description: "You have used 2.4 GB of your 15 GB free personal tier.",
      time: "2 hours ago",
      read: false,
      type: "info"
    },
    {
      id: "notif-3",
      title: "New AI Grounding Model",
      description: "PIRS Grounding v2.4 enabled for high-precision citation recall.",
      time: "1 day ago",
      read: true,
      type: "system"
    }
  ]);

  // Toast notifications system
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = "toast-" + Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Document actions
  const openDocumentViewer = (docId) => {
    setSelectedDocId(docId);
    setCurrentPage("document-viewer");
    // Add to activity
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setActivityList(prev => [
        {
          id: "act-" + Date.now(),
          dateGroup: "Today",
          type: "view",
          title: `Opened ${doc.name}`,
          description: `Inspected in Document Viewer • ${doc.collection} collection`,
          timestamp: "Just now",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          docId: doc.id,
          docName: doc.name,
          icon: "Eye",
          color: "#707070"
        },
        ...prev
      ]);
    }
  };

  const deleteDocument = (docId) => {
    const doc = documents.find(d => d.id === docId);
    setDocuments(prev => prev.filter(d => d.id !== docId));
    addToast(`"${doc?.name || 'Document'}" moved to trash.`, "info");
  };

  // Ask AI Action
  const askAI = (query, specificDoc = null) => {
    if (!query || !query.trim()) return;

    let answerObj;
    if (specificDoc) {
      // Scoped query about a specific document
      answerObj = {
        id: "conv-doc-" + Date.now(),
        question: query,
        timestamp: "Just now",
        answer: `From analyzing ${specificDoc.name}: ${specificDoc.summary}`,
        structuredData: specificDoc.detectedEntities.map(ent => ({
          title: ent.label,
          organization: ent.type,
          period: "Extracted Value",
          summary: ent.value
        })),
        sources: [
          {
            docId: specificDoc.id,
            docName: specificDoc.name,
            page: 1,
            relevance: 98,
            snippet: specificDoc.extractedText.slice(0, 180) + "..."
          }
        ],
        trustBadge: "Answer generated from your indexed documents."
      };
    } else {
      answerObj = generateGroundingAnswer(query, documents);
    }

    setConversations(prev => [answerObj, ...prev]);

    // Record activity
    setActivityList(prev => [
      {
        id: "act-" + Date.now(),
        dateGroup: "Today",
        type: "query",
        title: `Asked "${query}"`,
        description: answerObj.sources?.[0]
          ? `Grounded in ${answerObj.sources[0].docName} (${answerObj.sources[0].relevance}% relevance)`
          : "Semantic search query completed",
        timestamp: "Just now",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        docId: answerObj.sources?.[0]?.docId || null,
        docName: answerObj.sources?.[0]?.docName || null,
        icon: "MessageSquareQuote",
        color: "#2563EB"
      },
      ...prev
    ]);

    setCurrentPage("ask-ai");
  };

  // Upload simulation & storage addition
  const handleUploadComplete = (newFileMeta) => {
    const newDoc = {
      id: "doc-" + Date.now(),
      name: newFileMeta.name,
      type: newFileMeta.name.endsWith(".png") || newFileMeta.name.endsWith(".jpg") ? "image" : "pdf",
      extension: newFileMeta.name.split(".").pop().toUpperCase(),
      size: newFileMeta.size || "340 KB",
      sizeBytes: 348160,
      uploadedAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      isIndexed: true,
      indexQuality: "100%",
      pages: 1,
      collection: newFileMeta.collection || "Academic",
      tags: ["Uploaded", "OCR Verified", "AI Indexed"],
      visualType: "certificate",
      summary: `Recently uploaded document: ${newFileMeta.name}. Fully OCR scanned and indexed into AI-PIRS vector store with verified text embeddings.`,
      keywords: ["Uploaded", "Verified", "Personal Record", "Searchable"],
      detectedEntities: [
        { type: "DOC", label: "File Name", value: newFileMeta.name },
        { type: "STATUS", label: "Index Status", value: "Verified & Searchable" },
        { type: "DATE", label: "Ingestion Date", value: new Date().toLocaleDateString() }
      ],
      extractedText: `DOCUMENT CONTENT FOR: ${newFileMeta.name}
INGESTION DATE: ${new Date().toLocaleDateString()}
AI-PIRS OPTICAL CHARACTER RECOGNITION (OCR) SCAN COMPLETE.

This document has been parsed and segmented into neural vector embeddings. You can ask natural language questions regarding any dates, organizations, amounts, or references contained within this file.`
    };

    setDocuments(prev => [newDoc, ...prev]);

    // Update collection count
    setCollections(prev => prev.map(c => {
      if (c.name.toLowerCase() === (newDoc.collection || "").toLowerCase()) {
        return { ...c, count: c.count + 1 };
      }
      return c;
    }));

    // Update activity
    setActivityList(prev => [
      {
        id: "act-up-" + Date.now(),
        dateGroup: "Today",
        type: "upload",
        title: `Uploaded ${newDoc.name}`,
        description: `Added to ${newDoc.collection} collection • ${newDoc.size}`,
        timestamp: "Just now",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        docId: newDoc.id,
        docName: newDoc.name,
        icon: "UploadCloud",
        color: "#F36A21"
      },
      {
        id: "act-idx-" + Date.now(),
        dateGroup: "Today",
        type: "index",
        title: `AI indexed ${newDoc.name}`,
        description: "OCR extraction & vector embeddings indexed successfully",
        timestamp: "Just now",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        docId: newDoc.id,
        docName: newDoc.name,
        icon: "Sparkles",
        color: "#35A66F"
      },
      ...prev
    ]);

    addToast(`"${newDoc.name}" uploaded and indexed!`, "success");
    setIsUploadModalOpen(false);
  };

  // Add Collection
  const createCollection = (name, description, color, icon) => {
    const newCol = {
      id: "col-" + Date.now(),
      name,
      count: 0,
      description,
      color: color || "#F36A21",
      icon: icon || "Folder",
      updatedAt: new Date().toISOString().split("T")[0]
    };
    setCollections(prev => [newCol, ...prev]);
    addToast(`Collection "${name}" created!`, "success");
  };

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast("All notifications marked as read.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
        theme,
        toggleTheme,
        documents,
        collections,
        activityList,
        conversations,
        setConversations,
        selectedDocId,
        setSelectedDocId,
        selectedDocument,
        openDocumentViewer,
        deleteDocument,
        documentFilter,
        setDocumentFilter,
        selectedCollectionFilter,
        setSelectedCollectionFilter,
        documentSort,
        setDocumentSort,
        viewMode,
        setViewMode,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isUploadModalOpen,
        setIsUploadModalOpen,
        pendingQuery,
        setPendingQuery,
        askAI,
        handleUploadComplete,
        createCollection,
        notifications,
        markAllNotificationsRead,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
