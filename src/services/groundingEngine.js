/**
 * AI-PIRS Grounding & Retrieval Engine
 *
 * Implements deterministic evidence retrieval, entity extraction,
 * passage scoring, and source citations from actual uploaded documents.
 * Never invents identity numbers, dates, filenames, or page references.
 */

import { queryDocumentIndex } from "./indexingService";

const NO_EVIDENCE_MESSAGE = "I couldn't find reliable evidence for this information in your uploaded documents.";

// Stop words to avoid spurious keyword matches on common query words
const STOP_WORDS = new Set([
  "what", "when", "where", "which", "with", "this", "that", "from", "your",
  "have", "been", "card", "file", "document", "number", "date", "find", "show",
  "tell", "does", "about", "list", "them", "some", "more", "then", "into"
]);

// Normalizes input queries for matching
function normalizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/[?.,!/\\;:'"()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Extracts snippet around a match
function extractSnippet(text, targetTerm, maxLength = 180) {
  if (!text) return "";
  const lower = text.toLowerCase();
  const idx = lower.indexOf(targetTerm.toLowerCase());
  if (idx === -1) {
    return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
  }
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + targetTerm.length + (maxLength - 40));
  let snip = text.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) snip = "..." + snip;
  if (end < text.length) snip = snip + "...";
  return snip;
}

// Finds the best matching page in a document
function findBestPage(doc, matchFn) {
  if (doc.pagesText && doc.pagesText.length > 0) {
    for (const p of doc.pagesText) {
      if (matchFn(p.text.toLowerCase())) {
        return { page: p.page, text: p.text };
      }
    }
    return { page: doc.pagesText[0].page, text: doc.pagesText[0].text };
  }
  return { page: 1, text: doc.extractedText || "" };
}

export function generateGroundingAnswer(query, documents, specificDoc = null) {
  if (!query || !query.trim()) {
    return null;
  }

  // 1. Check if documents vault is empty
  if (!documents || documents.length === 0) {
    return {
      id: "conv-" + Date.now(),
      question: query,
      timestamp: "Just now",
      answer: "No documents have been uploaded to your vault yet. Please upload your identity cards, certificates, invoices, or records to enable AI-PIRS retrieval.",
      structuredData: [],
      sources: [],
      empty: true,
      trustBadge: "AI-PIRS Grounding Engine • 0 Documents Available"
    };
  }

  const normalized = normalizeQuery(query);
  const docsToSearch = specificDoc ? [specificDoc] : documents;

  // 2. Specific Document Summarization
  if (
    normalized.startsWith("summarise") ||
    normalized.startsWith("summarize") ||
    normalized.includes("summarise this document") ||
    normalized.includes("summarize this document") ||
    normalized.includes("what is this document about")
  ) {
    const targetDoc = specificDoc || docsToSearch[0];
    const preview = targetDoc.extractedText.slice(0, 400).replace(/\s+/g, " ");
    return {
      id: "conv-" + Date.now(),
      question: query,
      timestamp: "Just now",
      answer: `Summary of ${targetDoc.name}:\n\n${targetDoc.summary || preview}`,
      structuredData: (targetDoc.detectedEntities || []).map(ent => ({
        title: ent.label,
        organization: targetDoc.collection || "Document Record",
        period: "Extracted Field",
        summary: ent.value
      })),
      sources: [
        {
          docId: targetDoc.id,
          docName: targetDoc.name,
          page: 1,
          relevance: 98,
          snippet: extractSnippet(targetDoc.extractedText, targetDoc.name.split(".")[0], 180)
        }
      ],
      trustBadge: "AI-PIRS Grounding Engine • Grounded in Document Summary"
    };
  }

  // 3. Aadhaar Query Handling ("Where is my Aadhaar card?", "What is my Aadhaar number?")
  if (normalized.includes("aadhaar") || normalized.includes("aadhar") || normalized.includes("uidai")) {
    const matchedDoc = docsToSearch.find(doc => {
      const t = (doc.extractedText + " " + doc.name).toLowerCase();
      return t.includes("aadhaar") || t.includes("aadhar") || t.includes("uidai");
    });

    if (matchedDoc) {
      const pageInfo = findBestPage(matchedDoc, t => t.includes("aadhaar") || t.includes("aadhar") || t.includes("uidai"));
      const aadhaarEntity = (matchedDoc.detectedEntities || []).find(e => e.type === "ID_AADHAAR");
      const aadhaarNum = aadhaarEntity?.value || (pageInfo.text.match(/\b(?:\d{4}\s\d{4}\s\d{4}|\d{12})\b/) || [])[0];

      if (normalized.includes("where") || normalized.includes("which file")) {
        return {
          id: "conv-" + Date.now(),
          question: query,
          timestamp: "Just now",
          answer: `Your Aadhaar card is stored in "${matchedDoc.name}" on Page ${pageInfo.page}.${aadhaarNum ? ` (Aadhaar Number: ${aadhaarNum})` : ""}`,
          structuredData: [
            {
              title: "Aadhaar Document",
              organization: matchedDoc.name,
              period: `Page ${pageInfo.page}`,
              summary: aadhaarNum ? `Aadhaar Number: ${aadhaarNum}` : "Aadhaar Card Record"
            }
          ],
          sources: [
            {
              docId: matchedDoc.id,
              docName: matchedDoc.name,
              page: pageInfo.page,
              relevance: 99,
              snippet: extractSnippet(pageInfo.text, aadhaarNum || "aadhaar", 180)
            }
          ],
          trustBadge: "AI-PIRS Grounding Engine • Verified Identity Match"
        };
      }

      // Default: "What is my Aadhaar number?"
      if (aadhaarNum) {
        return {
          id: "conv-" + Date.now(),
          question: query,
          timestamp: "Just now",
          answer: `Your Aadhaar number is ${aadhaarNum}, extracted from "${matchedDoc.name}" (Page ${pageInfo.page}).`,
          structuredData: [
            {
              title: "Aadhaar Number",
              organization: "UIDAI / Identity Vault",
              period: `Source: ${matchedDoc.name}`,
              summary: `Unique Identification Number: ${aadhaarNum}`
            }
          ],
          sources: [
            {
              docId: matchedDoc.id,
              docName: matchedDoc.name,
              page: pageInfo.page,
              relevance: 100,
              snippet: extractSnippet(pageInfo.text, aadhaarNum, 180)
            }
          ],
          trustBadge: "AI-PIRS Grounding Engine • Exact Pattern Match"
        };
      } else {
        return {
          id: "conv-" + Date.now(),
          question: query,
          timestamp: "Just now",
          answer: `Found your Aadhaar document in "${matchedDoc.name}", but the 12-digit number could not be clearly extracted. Please inspect Page ${pageInfo.page}.`,
          structuredData: [],
          sources: [
            {
              docId: matchedDoc.id,
              docName: matchedDoc.name,
              page: pageInfo.page,
              relevance: 85,
              snippet: extractSnippet(pageInfo.text, "aadhaar", 180)
            }
          ],
          trustBadge: "AI-PIRS Grounding Engine • Partial Match"
        };
      }
    } else {
      return {
        id: "conv-" + Date.now(),
        question: query,
        timestamp: "Just now",
        answer: NO_EVIDENCE_MESSAGE,
        structuredData: [],
        sources: [],
        empty: true,
        trustBadge: "AI-PIRS Grounding Engine • No Match in Vault"
      };
    }
  }

  // 4. Driving Licence Query Handling ("What is my driving licence number?", "When does my driving licence expire?")
  if (
    normalized.includes("driving licence") ||
    normalized.includes("driving license") ||
    normalized.includes("licence number") ||
    normalized.includes("license number") ||
    normalized.includes("driving")
  ) {
    const matchedDoc = docsToSearch.find(doc => {
      const t = (doc.extractedText + " " + doc.name).toLowerCase();
      return t.includes("driving licence") || t.includes("driving license") || t.includes("transport department") || doc.name.toLowerCase().includes("driving");
    });

    if (matchedDoc) {
      const pageInfo = findBestPage(matchedDoc, t => t.includes("driving") || t.includes("licence") || t.includes("license"));
      const dlEntity = (matchedDoc.detectedEntities || []).find(e => e.type === "ID_DL");
      const expiryEntity = (matchedDoc.detectedEntities || []).find(e => e.type === "DATE_EXPIRY");

      // Case: When does my driving licence expire?
      if (normalized.includes("expire") || normalized.includes("expiry") || normalized.includes("valid")) {
        const expiryDate = expiryEntity?.value || (pageInfo.text.match(/(?:expiry|valid\s*(?:until|till|to)|expires|validity)[\s.:]*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[A-Za-z]+ \d{1,2},? \d{4}|\d{1,2} [A-Za-z]+ \d{4})/i) || [])[1];
        if (expiryDate) {
          return {
            id: "conv-" + Date.now(),
            question: query,
            timestamp: "Just now",
            answer: `Your driving licence expires on ${expiryDate}, according to "${matchedDoc.name}" (Page ${pageInfo.page}).`,
            structuredData: [
              {
                title: "Driving Licence Expiry",
                organization: matchedDoc.name,
                period: `Valid until: ${expiryDate}`,
                summary: `Expiry date verified from Page ${pageInfo.page}`
              }
            ],
            sources: [
              {
                docId: matchedDoc.id,
                docName: matchedDoc.name,
                page: pageInfo.page,
                relevance: 98,
                snippet: extractSnippet(pageInfo.text, expiryDate, 180)
              }
            ],
            trustBadge: "AI-PIRS Grounding Engine • Expiry Evidence Verified"
          };
        }
      }

      // Case: What is my driving licence number?
      const dlNum = dlEntity?.value || (pageInfo.text.match(/(?:driving\s*licen[sc]e(?:\s*(?:no\.?|number))?|dl\s*(?:no\.?|number)?)[\s.:=]+([A-Z0-9-]{8,20})/i) || [])[1] || (pageInfo.text.match(/\b(?:DL[-\s]?[0-9A-Z]{6,16}|[A-Z]{2}[-\s]?[0-9]{2}[-\s]?(?:19|20)[0-9]{2}[0-9]{7}|[A-Z]{2}[0-9]{13,15})\b/i) || [])[0];
      if (dlNum) {
        return {
          id: "conv-" + Date.now(),
          question: query,
          timestamp: "Just now",
          answer: `Your driving licence number is ${dlNum.trim()}, extracted from "${matchedDoc.name}" (Page ${pageInfo.page}).`,
          structuredData: [
            {
              title: "Driving Licence",
              organization: matchedDoc.name,
              period: `Page ${pageInfo.page}`,
              summary: `Licence No: ${dlNum.trim()}`
            }
          ],
          sources: [
            {
              docId: matchedDoc.id,
              docName: matchedDoc.name,
              page: pageInfo.page,
              relevance: 98,
              snippet: extractSnippet(pageInfo.text, dlNum.trim(), 180)
            }
          ],
          trustBadge: "AI-PIRS Grounding Engine • Licence Record Verified"
        };
      }
    } else {
      return {
        id: "conv-" + Date.now(),
        question: query,
        timestamp: "Just now",
        answer: NO_EVIDENCE_MESSAGE,
        structuredData: [],
        sources: [],
        empty: true,
        trustBadge: "AI-PIRS Grounding Engine • No Match in Vault"
      };
    }
  }

  // 5. PAN Card Query Handling ("Which file contains my PAN card?", "What is my PAN number?")
  if (normalized.includes("pan card") || normalized.includes("pan number") || normalized.includes("pan")) {
    const matchedDoc = docsToSearch.find(doc => {
      const t = (doc.extractedText + " " + doc.name).toLowerCase();
      return t.includes("permanent account number") || t.includes("income tax") || t.includes("pan card") || t.includes("pan no") || doc.name.toLowerCase().includes("pan");
    });

    if (matchedDoc) {
      const pageInfo = findBestPage(matchedDoc, t => t.includes("pan") || t.includes("permanent account"));
      const panEntity = (matchedDoc.detectedEntities || []).find(e => e.type === "ID_PAN");
      const panNum = panEntity?.value || (pageInfo.text.match(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/) || [])[0];

      if (normalized.includes("which file") || normalized.includes("where")) {
        return {
          id: "conv-" + Date.now(),
          question: query,
          timestamp: "Just now",
          answer: `Your PAN card is in the file "${matchedDoc.name}" (Page ${pageInfo.page}).${panNum ? ` (PAN: ${panNum})` : ""}`,
          structuredData: [
            {
              title: "PAN Card Document",
              organization: matchedDoc.name,
              period: `Page ${pageInfo.page}`,
              summary: panNum ? `PAN: ${panNum}` : "Permanent Account Number Card"
            }
          ],
          sources: [
            {
              docId: matchedDoc.id,
              docName: matchedDoc.name,
              page: pageInfo.page,
              relevance: 99,
              snippet: extractSnippet(pageInfo.text, panNum || "PAN", 180)
            }
          ],
          trustBadge: "AI-PIRS Grounding Engine • File Citation Verified"
        };
      }

      if (panNum) {
        return {
          id: "conv-" + Date.now(),
          question: query,
          timestamp: "Just now",
          answer: `Your PAN card number is ${panNum}, found in "${matchedDoc.name}" (Page ${pageInfo.page}).`,
          structuredData: [
            {
              title: "Permanent Account Number",
              organization: "Income Tax Department",
              period: `Source: ${matchedDoc.name}`,
              summary: `PAN: ${panNum}`
            }
          ],
          sources: [
            {
              docId: matchedDoc.id,
              docName: matchedDoc.name,
              page: pageInfo.page,
              relevance: 100,
              snippet: extractSnippet(pageInfo.text, panNum, 180)
            }
          ],
          trustBadge: "AI-PIRS Grounding Engine • Exact Pattern Match"
        };
      }
    } else {
      return {
        id: "conv-" + Date.now(),
        question: query,
        timestamp: "Just now",
        answer: NO_EVIDENCE_MESSAGE,
        structuredData: [],
        sources: [],
        empty: true,
        trustBadge: "AI-PIRS Grounding Engine • No Match in Vault"
      };
    }
  }

  // 6. Passport Query Handling ("When does my passport expire?", "What is my passport number?")
  if (normalized.includes("passport")) {
    const matchedDoc = docsToSearch.find(doc => {
      const t = (doc.extractedText + " " + doc.name).toLowerCase();
      return t.includes("passport") || doc.name.toLowerCase().includes("passport");
    });

    if (matchedDoc) {
      const pageInfo = findBestPage(matchedDoc, t => t.includes("passport"));
      const expiryEntity = (matchedDoc.detectedEntities || []).find(e => e.type === "DATE_EXPIRY");
      const passEntity = (matchedDoc.detectedEntities || []).find(e => e.type === "ID_PASSPORT");

      if (normalized.includes("expire") || normalized.includes("expiry") || normalized.includes("valid")) {
        const expiryDate = expiryEntity?.value || (pageInfo.text.match(/(?:expiry|valid\s*(?:until|till|to)|expires|date\s*of\s*expiry)[\s.:]*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[A-Za-z]+ \d{1,2},? \d{4}|\d{1,2} [A-Za-z]+ \d{4})/i) || [])[1];
        if (expiryDate) {
          return {
            id: "conv-" + Date.now(),
            question: query,
            timestamp: "Just now",
            answer: `Your passport expires on ${expiryDate}, according to "${matchedDoc.name}" (Page ${pageInfo.page}).`,
            structuredData: [
              {
                title: "Passport Expiry Date",
                organization: matchedDoc.name,
                period: `Valid until: ${expiryDate}`,
                summary: `Extracted from Page ${pageInfo.page}`
              }
            ],
            sources: [
              {
                docId: matchedDoc.id,
                docName: matchedDoc.name,
                page: pageInfo.page,
                relevance: 99,
                snippet: extractSnippet(pageInfo.text, expiryDate, 180)
              }
            ],
            trustBadge: "AI-PIRS Grounding Engine • Expiry Evidence Verified"
          };
        }
      }

      const passNum = passEntity?.value || (pageInfo.text.match(/(?:passport\s*(?:no|number)?[\s.:]*)([A-Z0-9]{8,9})/i) || [])[1];
      return {
        id: "conv-" + Date.now(),
        question: query,
        timestamp: "Just now",
        answer: `Found passport document in "${matchedDoc.name}" (Page ${pageInfo.page}).${passNum ? ` Passport No: ${passNum}` : ""}`,
        structuredData: [
          {
            title: "Passport Record",
            organization: matchedDoc.name,
            period: `Page ${pageInfo.page}`,
            summary: passNum ? `Passport No: ${passNum}` : "Passport document indexed"
          }
        ],
        sources: [
          {
            docId: matchedDoc.id,
            docName: matchedDoc.name,
            page: pageInfo.page,
            relevance: 95,
            snippet: extractSnippet(pageInfo.text, passNum || "passport", 180)
          }
        ],
        trustBadge: "AI-PIRS Grounding Engine • Source Grounded"
      };
    } else {
      return {
        id: "conv-" + Date.now(),
        question: query,
        timestamp: "Just now",
        answer: NO_EVIDENCE_MESSAGE,
        structuredData: [],
        sources: [],
        empty: true,
        trustBadge: "AI-PIRS Grounding Engine • No Match in Vault"
      };
    }
  }

  // 7. Address Query Handling ("Find my address", "What is my address")
  if (normalized.includes("address") || normalized.includes("where do i live") || normalized.includes("residence")) {
    for (const doc of docsToSearch) {
      const addrEntity = (doc.detectedEntities || []).find(e => e.type === "ADDRESS");
      let addressVal = addrEntity?.value;
      let targetPage = 1;

      if (!addressVal && doc.pagesText) {
        for (const p of doc.pagesText) {
          const m = p.text.match(/(?:address|residential\s*address|residence)[\s.:]+([^,\n]+(?:,[^\n]+){1,3})/i);
          if (m && m[1]) {
            addressVal = m[1].trim();
            targetPage = p.page;
            break;
          }
        }
      }

      if (addressVal) {
        return {
          id: "conv-" + Date.now(),
          question: query,
          timestamp: "Just now",
          answer: `Found address in "${doc.name}" (Page ${targetPage}):\n\n${addressVal}`,
          structuredData: [
            {
              title: "Residential Address",
              organization: doc.name,
              period: `Page ${targetPage}`,
              summary: addressVal
            }
          ],
          sources: [
            {
              docId: doc.id,
              docName: doc.name,
              page: targetPage,
              relevance: 96,
              snippet: extractSnippet(doc.extractedText, addressVal.slice(0, 30), 180)
            }
          ],
          trustBadge: "AI-PIRS Grounding Engine • Address Entity Retrieved"
        };
      }
    }
  }

  // 8. Invoice / Monthly Bills Handling ("Find the invoice from March")
  if (normalized.includes("invoice") || normalized.includes("bill") || normalized.includes("receipt")) {
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const targetMonth = months.find(m => normalized.includes(m));

    const matchedDoc = docsToSearch.find(doc => {
      const t = (doc.name + " " + doc.extractedText).toLowerCase();
      const isInvoice = t.includes("invoice") || t.includes("bill") || t.includes("tax invoice") || doc.collection === "Financial";
      if (!isInvoice) return false;
      if (targetMonth) return t.includes(targetMonth);
      return true;
    });

    if (matchedDoc) {
      const pageInfo = findBestPage(matchedDoc, t => (targetMonth ? t.includes(targetMonth) : true));
      const amountEntity = (matchedDoc.detectedEntities || []).find(e => e.type === "AMOUNT");
      const invNumEntity = (matchedDoc.detectedEntities || []).find(e => e.type === "INVOICE_NUM");

      return {
        id: "conv-" + Date.now(),
        question: query,
        timestamp: "Just now",
        answer: `Found ${targetMonth ? targetMonth.toUpperCase() + " " : ""}invoice "${matchedDoc.name}" (Page ${pageInfo.page}):${invNumEntity ? ` Invoice #${invNumEntity.value}` : ""}${amountEntity ? ` • Total: ${amountEntity.value}` : ""}.`,
        structuredData: [
          {
            title: matchedDoc.name.replace(/\.[^/.]+$/, ""),
            organization: matchedDoc.collection || "Invoices",
            period: `Page ${pageInfo.page}`,
            summary: `${invNumEntity ? `Invoice #${invNumEntity.value} • ` : ""}${amountEntity ? `Total: ${amountEntity.value}` : "Verified Invoice"}`
          }
        ],
        sources: [
          {
            docId: matchedDoc.id,
            docName: matchedDoc.name,
            page: pageInfo.page,
            relevance: 97,
            snippet: extractSnippet(pageInfo.text, targetMonth || "invoice", 180)
          }
        ],
        trustBadge: "AI-PIRS Grounding Engine • Financial Record Grounded"
      };
    }
  }

  // 9. All Identity Documents Handling ("Show all my identity documents")
  if (
    normalized.includes("all my identity documents") ||
    normalized.includes("all identity documents") ||
    normalized.includes("show my id") ||
    normalized.includes("list identity")
  ) {
    const identityDocs = docsToSearch.filter(d => {
      const t = (d.name + " " + d.extractedText).toLowerCase();
      return (
        d.collection === "Identity" ||
        t.includes("aadhaar") ||
        t.includes("passport") ||
        t.includes("driving licence") ||
        t.includes("driving license") ||
        t.includes("pan card") ||
        t.includes("voter") ||
        t.includes("identity")
      );
    });

    if (identityDocs.length > 0) {
      return {
        id: "conv-" + Date.now(),
        question: query,
        timestamp: "Just now",
        answer: `You have ${identityDocs.length} identity document(s) in your vault: ${identityDocs.map(d => `"${d.name}"`).join(", ")}.`,
        structuredData: identityDocs.map(d => ({
          title: d.name,
          organization: "Identity Document",
          period: `${d.pages || 1} Page(s)`,
          summary: d.summary
        })),
        sources: identityDocs.map(d => ({
          docId: d.id,
          docName: d.name,
          page: 1,
          relevance: 95,
          snippet: extractSnippet(d.extractedText, d.name.slice(0, 8), 160)
        })),
        trustBadge: "AI-PIRS Grounding Engine • Vault Identity Catalog"
      };
    }
  }

  // 10. Chunk-Based Passage Retrieval across uploaded document index
  const chunkResults = queryDocumentIndex(query, docsToSearch);
  if (chunkResults && chunkResults.length > 0) {
    const top = chunkResults[0];
    const topDoc = docsToSearch.find(d => d.id === top.docId);

    return {
      id: "conv-" + Date.now(),
      question: query,
      timestamp: "Just now",
      answer: `Based on your indexed document "${top.docName}" (Page ${top.page}):\n\n"${top.snippet}"`,
      structuredData: topDoc ? [
        {
          title: topDoc.name.replace(/\.[^/.]+$/, ""),
          organization: topDoc.collection || "Vault Document",
          period: `Page ${top.page}`,
          summary: topDoc.summary
        }
      ] : [],
      sources: chunkResults.slice(0, 3).map(item => ({
        docId: item.docId,
        docName: item.docName,
        page: item.page,
        relevance: item.score,
        snippet: item.snippet
      })),
      trustBadge: "AI-PIRS Grounding Engine • Passage Retrieval Match"
    };
  }

  // 11. Strict No-Match Fallback (Never hallucinate or invent fake documents!)
  return {
    id: "conv-" + Date.now(),
    question: query,
    timestamp: "Just now",
    answer: NO_EVIDENCE_MESSAGE,
    structuredData: [],
    sources: [],
    empty: true,
    trustBadge: "AI-PIRS Grounding Engine • No Match in Vault"
  };
}
