export const RECENT_SEARCHES = [
  "What internships have I completed?",
  "Where is my Aadhaar number?",
  "When does my passport expire?",
  "Find the invoice from March",
  "Which certificate mentions Python?"
];

export function performGlobalSearch(query, documents, collections) {
  if (!query || !query.trim()) {
    return {
      aiAnswers: [
        { title: "Ask: What internships have I completed?", query: "What internships have I completed?", type: "ai" },
        { title: "Ask: When does my passport expire?", query: "When does my passport expire?", type: "ai" }
      ],
      documents: documents.slice(0, 4),
      collections: collections.slice(0, 3),
      recentSearches: RECENT_SEARCHES
    };
  }

  const q = query.toLowerCase().trim();

  const matchedDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(q) ||
    doc.summary.toLowerCase().includes(q) ||
    doc.keywords.some(k => k.toLowerCase().includes(q))
  );

  const matchedCollections = collections.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q)
  );

  const aiPrompts = [
    { title: `Ask AI: "${query}"`, query: query, type: "ai" },
    { title: `Search information about "${query}" in all documents`, query: query, type: "ai" }
  ];

  return {
    aiAnswers: aiPrompts,
    documents: matchedDocs,
    collections: matchedCollections,
    recentSearches: RECENT_SEARCHES.filter(s => s.toLowerCase().includes(q))
  };
}
