// Client-side IndexedDB persistence for AI-PIRS
const DB_NAME = "aipirs_db";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("documents")) {
        db.createObjectStore("documents", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("collections")) {
        db.createObjectStore("collections", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("activity")) {
        db.createObjectStore("activity", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("conversations")) {
        db.createObjectStore("conversations", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllDocuments() {
  const db = await openDB();
  if (!db) {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem("aipirs_docs");
    return raw ? JSON.parse(raw) : [];
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction("documents", "readonly");
    const store = tx.objectStore("documents");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveDocument(doc) {
  const db = await openDB();
  if (!db) {
    const docs = await getAllDocuments();
    const updated = [doc, ...docs.filter(d => d.id !== doc.id)];
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("aipirs_docs", JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage quota reached on localStorage fallback:", e);
      }
    }
    return doc;
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction("documents", "readwrite");
    const store = tx.objectStore("documents");
    const req = store.put(doc);
    req.onsuccess = () => resolve(doc);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteDocumentFromDB(docId) {
  const db = await openDB();
  if (!db) {
    const docs = await getAllDocuments();
    const updated = docs.filter(d => d.id !== docId);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("aipirs_docs", JSON.stringify(updated));
    }
    return;
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction("documents", "readwrite");
    const store = tx.objectStore("documents");
    const req = store.delete(docId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getAllCollections() {
  const db = await openDB();
  if (!db) {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem("aipirs_collections");
    return raw ? JSON.parse(raw) : [];
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction("collections", "readonly");
    const store = tx.objectStore("collections");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveCollectionToDB(collection) {
  const db = await openDB();
  if (!db) {
    const cols = await getAllCollections();
    const updated = [collection, ...cols.filter(c => c.id !== collection.id)];
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("aipirs_collections", JSON.stringify(updated));
    }
    return collection;
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction("collections", "readwrite");
    const store = tx.objectStore("collections");
    const req = store.put(collection);
    req.onsuccess = () => resolve(collection);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllActivity() {
  const db = await openDB();
  if (!db) {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem("aipirs_activity");
    return raw ? JSON.parse(raw) : [];
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction("activity", "readonly");
    const store = tx.objectStore("activity");
    const req = store.getAll();
    req.onsuccess = () => {
      const items = req.result || [];
      items.sort((a, b) => (b.timestampRaw || 0) - (a.timestampRaw || 0));
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function addActivityToDB(item) {
  const db = await openDB();
  if (!db) {
    const list = await getAllActivity();
    const updated = [item, ...list];
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("aipirs_activity", JSON.stringify(updated.slice(0, 100)));
    }
    return item;
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction("activity", "readwrite");
    const store = tx.objectStore("activity");
    const req = store.put(item);
    req.onsuccess = () => resolve(item);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllConversations() {
  const db = await openDB();
  if (!db) {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem("aipirs_conversations");
    return raw ? JSON.parse(raw) : [];
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction("conversations", "readonly");
    const store = tx.objectStore("conversations");
    const req = store.getAll();
    req.onsuccess = () => {
      const items = req.result || [];
      items.sort((a, b) => (b.timestampRaw || 0) - (a.timestampRaw || 0));
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveConversationToDB(conv) {
  const db = await openDB();
  if (!db) {
    const list = await getAllConversations();
    const updated = [conv, ...list];
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("aipirs_conversations", JSON.stringify(updated.slice(0, 50)));
    }
    return conv;
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction("conversations", "readwrite");
    const store = tx.objectStore("conversations");
    const req = store.put(conv);
    req.onsuccess = () => resolve(conv);
    req.onerror = () => reject(req.error);
  });
}

export async function clearConversationsFromDB() {
  const db = await openDB();
  if (!db) {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("aipirs_conversations");
    }
    return;
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction("conversations", "readwrite");
    const store = tx.objectStore("conversations");
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
