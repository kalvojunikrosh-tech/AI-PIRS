/**
 * Entity & metadata extractor for uploaded documents.
 * Identifies identity numbers, dates, organizations, amounts, addresses, and document types.
 */

// Regex patterns for identity documents & common entities
const PATTERNS = {
  // Indian Aadhaar: 12 digits (often spaced in groups of 4)
  aadhaar: /\b(?:\d{4}\s\d{4}\s\d{4}|\d{12})\b/,
  // Indian PAN: 5 uppercase letters, 4 digits, 1 uppercase letter
  pan: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/,
  // Passport (Indian / International alphanumeric standard 1 letter + 7-8 digits)
  passport: /\b[A-Z][0-9]{7,8}\b/,
  // Indian Driving Licence (Standard DL formats: DL-XXXXXXXXXXXXX or SS-RR-YYYYNNNNNNN)
  drivingLicence: /\b(?:DL[-\s]?[0-9A-Z]{6,16}|[A-Z]{2}[-\s]?[0-9]{2}[-\s]?(?:19|20)[0-9]{2}[0-9]{7}|[A-Z]{2}[0-9]{13,15})\b/i,
  // Date formats: DD/MM/YYYY, YYYY-MM-DD, Month DD YYYY, etc.
  date: /\b(?:(?:0?[1-9]|[12][0-9]|3[01])[-/.](?:0?[1-9]|1[012])[-/.](?:19|20)\d{2}|(?:19|20)\d{2}[-/.](?:0?[1-9]|1[012])[-/.](?:0?[1-9]|[12][0-9]|3[01])|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(?:0?[1-9]|[12][0-9]|3[01]),?\s+(?:19|20)\d{2}|(?:0?[1-9]|[12][0-9]|3[01])\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(?:19|20)\d{2})\b/gi,
  // Currency amounts: $120.00, Rs. 5000, ₹15,000, 150 USD
  amount: /(?:[$€£₹]|Rs\.?|INR|USD)\s?[\d,]+(?:\.\d{1,2})?|\b[\d,]+(?:\.\d{1,2})?\s?(?:USD|INR|EUR|GBP)\b/gi,
  // PIN code (India 6 digits)
  pincode: /\b[1-9][0-9]{5}\b/
};

export function analyzeDocument(filename, text = "") {
  const detectedEntities = [];
  const textLower = text.toLowerCase();
  const nameLower = filename.toLowerCase();

  // 1. Aadhaar detection
  if (textLower.includes("aadhaar") || textLower.includes("uidai") || textLower.includes("unique identification") || nameLower.includes("aadhaar") || nameLower.includes("aadhar")) {
    const match = text.match(PATTERNS.aadhaar);
    if (match) {
      detectedEntities.push({
        type: "ID_AADHAAR",
        label: "Aadhaar Number",
        value: match[0]
      });
    }
  }

  // 2. PAN detection
  if (textLower.includes("permanent account number") || textLower.includes("income tax") || textLower.includes("pan card") || textLower.includes("pan no") || nameLower.includes("pan")) {
    const match = text.match(PATTERNS.pan);
    if (match) {
      detectedEntities.push({
        type: "ID_PAN",
        label: "PAN Number",
        value: match[0]
      });
    }
  }

  // 3. Passport detection
  if (textLower.includes("passport") || textLower.includes("republic of india") || nameLower.includes("passport")) {
    // Look for passport number
    const passMatch = text.match(/(?:passport\s*(?:no|number)?[\s.:]*)([A-Z0-9]{8,9})/i) || text.match(PATTERNS.passport);
    if (passMatch) {
      detectedEntities.push({
        type: "ID_PASSPORT",
        label: "Passport Number",
        value: passMatch[1] || passMatch[0]
      });
    }

    // Expiry date
    const expiryMatch = text.match(/(?:expiry|valid\s*(?:until|till|to)|expires)[\s.:]*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[A-Za-z]+ \d{1,2},? \d{4}|\d{1,2} [A-Za-z]+ \d{4})/i);
    if (expiryMatch) {
      detectedEntities.push({
        type: "DATE_EXPIRY",
        label: "Passport Expiry Date",
        value: expiryMatch[1].trim()
      });
    }
  }

  // 4. Driving Licence detection
  if (textLower.includes("driving licence") || textLower.includes("driving license") || textLower.includes("transport department") || textLower.includes("form 7") || nameLower.includes("driving") || nameLower.includes("licence") || nameLower.includes("license")) {
    const dlMatch = text.match(/(?:driving\s*licen[sc]e(?:\s*(?:no\.?|number))?|dl\s*(?:no\.?|number)?)[\s.:=]+([A-Z0-9-]{8,20})/i) || text.match(PATTERNS.drivingLicence);
    if (dlMatch) {
      detectedEntities.push({
        type: "ID_DL",
        label: "Driving Licence Number",
        value: (dlMatch[1] || dlMatch[0]).trim()
      });
    }

    const expiryMatch = text.match(/(?:expiry|valid\s*(?:until|till|to)|expires|validity)[\s.:]*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[A-Za-z]+ \d{1,2},? \d{4}|\d{1,2} [A-Za-z]+ \d{4})/i);
    if (expiryMatch) {
      detectedEntities.push({
        type: "DATE_EXPIRY",
        label: "Driving Licence Expiry",
        value: expiryMatch[1].trim()
      });
    }
  }

  // 5. General Expiry / Date matches if not already caught
  if (!detectedEntities.some(e => e.type === "DATE_EXPIRY")) {
    const generalExpiry = text.match(/(?:date\s*of\s*expiry|expiry\s*date|valid\s*(?:until|till|to))[\s.:]*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[A-Za-z]+ \d{1,2},? \d{4}|\d{1,2} [A-Za-z]+ \d{4})/i);
    if (generalExpiry) {
      detectedEntities.push({
        type: "DATE_EXPIRY",
        label: "Expiry Date",
        value: generalExpiry[1].trim()
      });
    }
  }

  // 6. Address detection
  const addrMatch = text.match(/(?:address|residential\s*address|residence)[\s.:]+([^,\n]+(?:,[^\n]+){1,4})/i);
  if (addrMatch && addrMatch[1]) {
    const cleanedAddr = addrMatch[1].replace(/\s+/g, " ").trim();
    if (cleanedAddr.length > 8 && cleanedAddr.length < 200) {
      detectedEntities.push({
        type: "ADDRESS",
        label: "Address",
        value: cleanedAddr
      });
    }
  }

  // 7. Invoice / Financial details
  if (textLower.includes("invoice") || textLower.includes("bill") || textLower.includes("receipt") || nameLower.includes("invoice") || nameLower.includes("bill")) {
    const invNumMatch = text.match(/(?:invoice|inv)(?:\s*(?:no\.?|number|#|id|num))?[\t ]*[:#=][\t ]*([A-Z0-9-_]{3,25})/i);
    if (invNumMatch) {
      detectedEntities.push({
        type: "INVOICE_NUM",
        label: "Invoice Number",
        value: invNumMatch[1].trim()
      });
    }
    const amtMatch = text.match(PATTERNS.amount);
    if (amtMatch && amtMatch.length > 0) {
      detectedEntities.push({
        type: "AMOUNT",
        label: "Amount",
        value: amtMatch[amtMatch.length - 1].trim()
      });
    }
  }

  // 8. Determine collection / visual type
  let collection = "General";
  let visualType = "document";

  if (
    detectedEntities.some(e => e.type.startsWith("ID_")) ||
    textLower.includes("identity") ||
    textLower.includes("republic of india") ||
    textLower.includes("aadhaar") ||
    textLower.includes("passport") ||
    textLower.includes("driving licence") ||
    textLower.includes("pan card")
  ) {
    collection = "Identity";
    if (textLower.includes("passport")) visualType = "passport";
  } else if (
    textLower.includes("certificate") ||
    textLower.includes("certify") ||
    textLower.includes("credential") ||
    nameLower.includes("certificate")
  ) {
    collection = "Certificates";
    visualType = "certificate";
  } else if (
    textLower.includes("invoice") ||
    textLower.includes("receipt") ||
    textLower.includes("bill") ||
    textLower.includes("tax")
  ) {
    collection = "Financial";
  } else if (
    textLower.includes("university") ||
    textLower.includes("college") ||
    textLower.includes("semester") ||
    textLower.includes("cgpa") ||
    textLower.includes("degree") ||
    textLower.includes("marksheet")
  ) {
    collection = "Academic";
  }

  // 9. Generate realistic summary from genuine content
  const cleanLines = text
    .split(/\n+/)
    .map(line => line.trim())
    .filter(line => line.length > 20 && !line.startsWith("[Page"));

  let summary = "";
  if (cleanLines.length > 0) {
    summary = cleanLines.slice(0, 2).join(". ").slice(0, 260) + (cleanLines.length > 2 ? "..." : "");
  } else {
    summary = `Document: ${filename}. Contains extracted text ready for search retrieval.`;
  }

  // 10. Extract keywords for fast inverted-index searching
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3);

  const wordCounts = {};
  for (const w of words) {
    wordCounts[w] = (wordCounts[w] || 0) + 1;
  }
  const topKeywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

  return {
    collection,
    visualType,
    summary,
    keywords: topKeywords.length > 0 ? topKeywords : ["Indexed", "Document"],
    detectedEntities
  };
}
