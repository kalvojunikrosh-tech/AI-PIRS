/**
 * Real global search across uploaded documents and user collections.
 */

export function performGlobalSearch(query, documents = [], collections = []) {
  if (!query || !query.trim()) {
    return {
      aiAnswers: [
        { title: "Ask: Where are my identity documents?", query: "Show all my identity documents", type: "ai" },
        { title: "Ask: Find my address", query: "Find my address", type: "ai" }
      ],
      documents: documents.slice(0, 5),
      collections: collections.slice(0, 4),
      recentSearches: []
    };
  }

  const q = query.toLowerCase().trim();

  // Search actual documents in state
  const matchedDocs = documents.filter(doc => {
    const nameMatch = doc.name.toLowerCase().includes(q);
    const summaryMatch = (doc.summary || "").toLowerCase().includes(q);
    const textMatch = (doc.extractedText || "").toLowerCase().includes(q);
    const keywordMatch = (doc.keywords || []).some(k => k.toLowerCase().includes(q));
    const entityMatch = (doc.detectedEntities || []).some(e =>
      e.label.toLowerCase().includes(q) || e.value.toLowerCase().includes(q)
    );
    return nameMatch || summaryMatch || textMatch || keywordMatch || entityMatch;
  });

  // Search actual collections in state
  const matchedCollections = collections.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.description || "").toLowerCase().includes(q)
  );

  const aiPrompts = [
    { title: `Ask AI: "${query}"`, query: query, type: "ai" },
    { title: `Search information about "${query}" in all documents`, query: query, type: "ai" }
  ];

  return {
    aiAnswers: aiPrompts,
    documents: matchedDocs,
    collections: matchedCollections,
    recentSearches: []
  };
}
