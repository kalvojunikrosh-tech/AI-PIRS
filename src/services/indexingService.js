/**
 * AI-PIRS Document Indexing Service
 *
 * Manages document index generation, text chunking, page metadata mapping,
 * and semantic passage retrieval across uploaded files.
 */

// Splits text into clean search tokens
export function tokenize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2);
}

// Chunks document text into searchable passages while preserving page metadata
export function createSearchableChunks(pagesText = [], fullText = "") {
  const chunks = [];
  let chunkIdx = 0;

  if (pagesText && pagesText.length > 0) {
    for (const pageObj of pagesText) {
      const pageNum = pageObj.page || 1;
      const rawText = pageObj.text || "";

      // Split page text by paragraph or sentences
      const paragraphs = rawText
        .split(/(?:\r?\n\s*){2,}|(?<=[.?!])\s+(?=[A-Z0-9])/)
        .map(p => p.replace(/\s+/g, " ").trim())
        .filter(p => p.length > 15);

      if (paragraphs.length > 0) {
        for (const para of paragraphs) {
          chunkIdx++;
          chunks.push({
            id: `chunk-${chunkIdx}`,
            page: pageNum,
            text: para,
            tokens: tokenize(para)
          });
        }
      } else if (rawText.trim().length > 0) {
        chunkIdx++;
        chunks.push({
          id: `chunk-${chunkIdx}`,
          page: pageNum,
          text: rawText.trim(),
          tokens: tokenize(rawText)
        });
      }
    }
  } else if (fullText && fullText.trim()) {
    const paragraphs = fullText
      .split(/(?:\r?\n\s*){2,}|(?<=[.?!])\s+(?=[A-Z0-9])/)
      .map(p => p.replace(/\s+/g, " ").trim())
      .filter(p => p.length > 15);

    for (const para of paragraphs) {
      chunkIdx++;
      chunks.push({
        id: `chunk-${chunkIdx}`,
        page: 1,
        text: para,
        tokens: tokenize(para)
      });
    }
  }

  return chunks;
}

/**
 * Builds a standardized index record for an uploaded document.
 */
export function buildDocumentIndex({
  id,
  name,
  file,
  size,
  sizeBytes,
  extraction,
  analysis,
  collection
}) {
  const docId = id || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const ext = (name || "").split(".").pop()?.toUpperCase() || "DOC";
  const type = (file && file.type?.startsWith("image/")) || ["PNG", "JPG", "JPEG", "WEBP"].includes(ext)
    ? "image"
    : ext === "DOCX" ? "doc" : "pdf";

  const extractedText = extraction?.extractedText || "";
  const pagesText = extraction?.pagesText && extraction.pagesText.length > 0
    ? extraction.pagesText
    : [{ page: 1, text: extractedText }];

  const chunks = createSearchableChunks(pagesText, extractedText);

  return {
    id: docId,
    name: name,
    type,
    extension: ext,
    size: size || "100 KB",
    sizeBytes: sizeBytes || (file ? file.size : 102400),
    uploadedAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    isIndexed: true,
    status: "indexed",
    pages: extraction?.pages || pagesText.length || 1,
    collection: collection || analysis?.collection || "General",
    tags: ["Uploaded", "AI Indexed", collection || analysis?.collection || "General"],
    visualType: analysis?.visualType || "document",
    summary: analysis?.summary || `Extracted text from ${name}. Indexed with ${chunks.length} searchable passages.`,
    keywords: analysis?.keywords || ["Indexed", "Document"],
    detectedEntities: analysis?.detectedEntities || [],
    extractedText,
    pagesText,
    chunks
  };
}

/**
 * Searches across indexed document chunks to find relevant evidence passages.
 */
export function queryDocumentIndex(query, documents = []) {
  if (!query || !query.trim() || !documents || documents.length === 0) {
    return [];
  }

  const queryTokens = tokenize(query);
  const results = [];

  for (const doc of documents) {
    const chunks = doc.chunks && doc.chunks.length > 0
      ? doc.chunks
      : createSearchableChunks(doc.pagesText, doc.extractedText);

    for (const chunk of chunks) {
      let score = 0;
      const chunkTextLower = chunk.text.toLowerCase();

      for (const token of queryTokens) {
        if (chunkTextLower.includes(token)) {
          score += 10;
        }
        if (chunk.tokens.includes(token)) {
          score += 15;
        }
      }

      if (doc.name.toLowerCase().includes(query.toLowerCase().trim())) {
        score += 20;
      }

      if (score > 15) {
        results.push({
          docId: doc.id,
          docName: doc.name,
          page: chunk.page || 1,
          score: Math.min(score, 99),
          snippet: chunk.text
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}
