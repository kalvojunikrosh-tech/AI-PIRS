import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  getAllDocuments,
  saveDocument as saveDocumentToDB,
  deleteDocumentFromDB,
  getAllCollections,
  saveCollectionToDB,
  getAllActivity,
  addActivityToDB,
  getAllConversations,
  saveConversationToDB,
  clearConversationsFromDB
} from "../services/storageService";
import { generateGroundingAnswer } from "../services/groundingEngine";
import { buildDocumentIndex } from "../services/indexingService";

const AppContext = createContext();

const DEFAULT_COLLECTIONS = [
  {
    id: "col-1",
    name: "Academic",
    count: 0,
    description: "Degrees, transcripts, and course records",
    color: "#2563EB",
    icon: "GraduationCap",
    updatedAt: new Date().toISOString().split("T")[0]
  },
  {
    id: "col-2",
    name: "Certificates",
    count: 0,
    description: "Professional credentials and licenses",
    color: "#35A66F",
    icon: "Award",
    updatedAt: new Date().toISOString().split("T")[0]
  },
  {
    id: "col-3",
    name: "Identity",
    count: 0,
    description: "Passports, IDs, licences, and official cards",
    color: "#F36A21",
    icon: "ShieldCheck",
    updatedAt: new Date().toISOString().split("T")[0]
  },
  {
    id: "col-4",
    name: "Financial",
    count: 0,
    description: "Invoices, tax records, and receipts",
    color: "#F59E0B",
    icon: "Receipt",
    updatedAt: new Date().toISOString().split("T")[0]
  },
  {
    id: "col-5",
    name: "Projects",
    count: 0,
    description: "Project documentation, architecture, and code notes",
    color: "#8B5CF6",
    icon: "FolderKanban",
    updatedAt: new Date().toISOString().split("T")[0]
  }
];

export function AppProvider({ children }) {
  // Navigation & Auth state
  const [currentPage, setCurrentPage] = useState("overview"); // overview, ask-ai, documents, collections, activity, settings, document-viewer, login, register
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem("aipirs-user") : null;
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      name: "Personal User",
      email: "user@domain.dev",
      role: "Personal Account",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      bio: "Managing personal documents, academic archives, and identity records in local encrypted storage."
    };
  });

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("aipirs-user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Theme state ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    return (typeof localStorage !== "undefined" && localStorage.getItem("aipirs-theme")) || "light";
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("aipirs-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // Main data states - Initialized empty for genuine fresh installation
  const [documents, setDocuments] = useState([]);
  const [baseCollections, setBaseCollections] = useState(DEFAULT_COLLECTIONS);
  const [activityList, setActivityList] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load persistent data from IndexedDB on startup
  useEffect(() => {
    async function loadData() {
      try {
        const [docs, cols, acts, convs] = await Promise.all([
          getAllDocuments(),
          getAllCollections(),
          getAllActivity(),
          getAllConversations()
        ]);

        if (docs && docs.length > 0) {
          setDocuments(docs);
        }
        if (cols && cols.length > 0) {
          setBaseCollections(cols);
        }
        if (acts && acts.length > 0) {
          setActivityList(acts);
        }
        if (convs && convs.length > 0) {
          setConversations(convs);
        }
      } catch (err) {
        console.error("Failed to load data from IndexedDB:", err);
      } finally {
        setIsDataLoaded(true);
      }
    }
    loadData();
  }, []);

  // Compute live collection counts based on actual uploaded documents
  const collections = useMemo(() => {
    return baseCollections.map(col => {
      const count = documents.filter(
        d => (d.collection || "").toLowerCase() === col.name.toLowerCase()
      ).length;
      return { ...col, count };
    });
  }, [baseCollections, documents]);

  // Document Viewer selection
  const [selectedDocId, setSelectedDocId] = useState(null);
  const selectedDocument = useMemo(() => {
    if (!documents || documents.length === 0) return null;
    return documents.find(d => d.id === selectedDocId) || documents[0];
  }, [documents, selectedDocId]);

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
      title: "AI Grounding Engine Ready",
      description: "Local neural search and source citation pipeline is initialized.",
      time: "Just now",
      read: false,
      type: "success"
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
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      const act = {
        id: "act-" + Date.now(),
        timestampRaw: Date.now(),
        dateGroup: "Today",
        type: "view",
        title: `Opened ${doc.name}`,
        description: `Inspected in Document Viewer • ${doc.collection || "General"} collection`,
        timestamp: "Just now",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        docId: doc.id,
        docName: doc.name,
        icon: "Eye",
        color: "#707070"
      };
      setActivityList(prev => [act, ...prev]);
      addActivityToDB(act).catch(console.error);
    }
  };

  const deleteDocument = async (docId) => {
    const doc = documents.find(d => d.id === docId);
    setDocuments(prev => prev.filter(d => d.id !== docId));
    await deleteDocumentFromDB(docId).catch(console.error);

    // Record deletion in activity
    const act = {
      id: "act-del-" + Date.now(),
      timestampRaw: Date.now(),
      dateGroup: "Today",
      type: "delete",
      title: `Deleted ${doc?.name || "document"}`,
      description: `Removed from vault and AI retrieval index`,
      timestamp: "Just now",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      docId: null,
      docName: doc?.name || null,
      icon: "Trash2",
      color: "#EF4444"
    };
    setActivityList(prev => [act, ...prev]);
    addActivityToDB(act).catch(console.error);

    addToast(`"${doc?.name || "Document"}" removed from vault.`, "info");
  };

  // Ask AI Action with real Grounding Engine
  const askAI = async (query, specificDoc = null) => {
    if (!query || !query.trim()) return;

    const answerObj = generateGroundingAnswer(query, documents, specificDoc);
    if (!answerObj) return;

    setConversations(prev => [answerObj, ...prev]);
    saveConversationToDB(answerObj).catch(console.error);

    // Record activity
    const act = {
      id: "act-" + Date.now(),
      timestampRaw: Date.now(),
      dateGroup: "Today",
      type: "query",
      title: `Asked "${query}"`,
      description: answerObj.sources?.[0]
        ? `Grounded in ${answerObj.sources[0].docName} (Page ${answerObj.sources[0].page})`
        : "Evidence search completed",
      timestamp: "Just now",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      docId: answerObj.sources?.[0]?.docId || null,
      docName: answerObj.sources?.[0]?.docName || null,
      icon: "MessageSquareQuote",
      color: "#2563EB"
    };
    setActivityList(prev => [act, ...prev]);
    addActivityToDB(act).catch(console.error);

    setCurrentPage("ask-ai");
  };

  // Real upload completion handler
  const handleUploadComplete = async (docData) => {
    const newDoc = buildDocumentIndex({
      name: docData.name,
      file: docData.file,
      size: docData.size,
      sizeBytes: docData.sizeBytes,
      extraction: {
        extractedText: docData.extractedText,
        pagesText: docData.pagesText,
        pages: docData.pages
      },
      analysis: {
        collection: docData.collection,
        summary: docData.summary,
        keywords: docData.keywords,
        detectedEntities: docData.detectedEntities,
        visualType: docData.visualType
      },
      collection: docData.collection
    });

    setDocuments(prev => [newDoc, ...prev]);
    await saveDocumentToDB(newDoc).catch(console.error);

    // Record upload activity
    const upAct = {
      id: "act-up-" + Date.now(),
      timestampRaw: Date.now(),
      dateGroup: "Today",
      type: "upload",
      title: `Uploaded ${newDoc.name}`,
      description: `Added to ${newDoc.collection} collection • ${newDoc.size}`,
      timestamp: "Just now",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      docId: newDoc.id,
      docName: newDoc.name,
      icon: "UploadCloud",
      color: "#F36A21"
    };

    const idxAct = {
      id: "act-idx-" + (Date.now() + 1),
      timestampRaw: Date.now() + 1,
      dateGroup: "Today",
      type: "index",
      title: `AI indexed ${newDoc.name}`,
      description: `Text extracted (${newDoc.pages} page${newDoc.pages > 1 ? "s" : ""}) & indexed for retrieval`,
      timestamp: "Just now",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      docId: newDoc.id,
      docName: newDoc.name,
      icon: "Sparkles",
      color: "#35A66F"
    };

    setActivityList(prev => [idxAct, upAct, ...prev]);
    addActivityToDB(upAct).catch(console.error);
    addActivityToDB(idxAct).catch(console.error);

    addToast(`"${newDoc.name}" uploaded and indexed!`, "success");
    setIsUploadModalOpen(false);
  };

  // Add Collection
  const createCollection = async (name, description, color, icon) => {
    const newCol = {
      id: "col-" + Date.now(),
      name,
      count: 0,
      description,
      color: color || "#F36A21",
      icon: icon || "Folder",
      updatedAt: new Date().toISOString().split("T")[0]
    };
    setBaseCollections(prev => [newCol, ...prev]);
    await saveCollectionToDB(newCol).catch(console.error);
    addToast(`Collection "${name}" created!`, "success");
  };

  // Clear Conversations
  const clearAllConversations = async () => {
    setConversations([]);
    await clearConversationsFromDB().catch(console.error);
    addToast("Conversation history cleared.", "info");
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
        clearAllConversations,
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
        removeToast,
        isDataLoaded
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
