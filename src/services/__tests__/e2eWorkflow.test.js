import { describe, it, expect } from "vitest";
import { buildDocumentIndex } from "../indexingService";
import { analyzeDocument } from "../entityExtractor";
import { generateGroundingAnswer } from "../groundingEngine";

describe("Complete End-to-End Workflow Verification", () => {
  it("verifies upload -> extraction -> indexing -> retrieval -> citation -> deletion workflow", () => {
    // 1. Fresh state contains 0 documents
    let activeVault = [];
    const emptyRes = generateGroundingAnswer("What is my Aadhaar number?", activeVault);
    expect(emptyRes.empty).toBe(true);
    expect(emptyRes.sources.length).toBe(0);

    // 2. Synthetic test document with fictional identity details
    const syntheticFileName = "Fictional_KYC_Identity_Record.pdf";
    const syntheticFileText = `GOVERNMENT OF INDIA - OFFICIAL IDENTITY PORTAL
Name: Fictional Tester
Aadhaar Number: 1234 5678 9012
Driving Licence Number: DL-9920240011223
Driving Licence Expiry: 15/08/2039
Residential Address: Plot 42, Cyber Gateway, Madhapur, Hyderabad 500081`;

    // 3. Extraction & Entity Analysis
    const analysis = analyzeDocument(syntheticFileName, syntheticFileText);
    expect(analysis.detectedEntities.some(e => e.type === "ID_AADHAAR")).toBe(true);
    expect(analysis.detectedEntities.some(e => e.type === "ID_DL")).toBe(true);
    expect(analysis.detectedEntities.some(e => e.type === "DATE_EXPIRY")).toBe(true);
    expect(analysis.detectedEntities.some(e => e.type === "ADDRESS")).toBe(true);

    // 4. Indexing Service
    const indexedDoc = buildDocumentIndex({
      name: syntheticFileName,
      size: "240 KB",
      sizeBytes: 245760,
      extraction: {
        extractedText: syntheticFileText,
        pagesText: [{ page: 1, text: syntheticFileText }],
        pages: 1
      },
      analysis,
      collection: analysis.collection
    });

    expect(indexedDoc.id).toBeDefined();
    expect(indexedDoc.status).toBe("indexed");
    expect(indexedDoc.isIndexed).toBe(true);
    expect(indexedDoc.chunks.length).toBeGreaterThan(0);
    expect(indexedDoc.chunks[0].page).toBe(1);

    // Insert into active vault
    activeVault = [indexedDoc];

    // 5. Grounding Engine: Aadhaar query
    const aadhaarRes = generateGroundingAnswer("What is my Aadhaar number?", activeVault);
    expect(aadhaarRes.empty).toBeFalsy();
    expect(aadhaarRes.answer).toContain("1234 5678 9012");
    expect(aadhaarRes.sources.length).toBe(1);
    expect(aadhaarRes.sources[0].docName).toBe("Fictional_KYC_Identity_Record.pdf");
    expect(aadhaarRes.sources[0].page).toBe(1);
    expect(aadhaarRes.sources[0].snippet).toContain("1234 5678 9012");

    // 6. Grounding Engine: Driving Licence Number & Expiry
    const dlRes = generateGroundingAnswer("What is my driving licence number?", activeVault);
    expect(dlRes.answer).toContain("DL-9920240011223");
    expect(dlRes.sources[0].docName).toBe("Fictional_KYC_Identity_Record.pdf");

    const dlExpRes = generateGroundingAnswer("When does my driving licence expire?", activeVault);
    expect(dlExpRes.answer).toContain("15/08/2039");
    expect(dlExpRes.sources[0].docName).toBe("Fictional_KYC_Identity_Record.pdf");

    // 7. Grounding Engine: Address retrieval
    const addrRes = generateGroundingAnswer("Find my address.", activeVault);
    expect(addrRes.answer).toContain("Cyber Gateway, Madhapur, Hyderabad");
    expect(addrRes.sources[0].docName).toBe("Fictional_KYC_Identity_Record.pdf");

    // 7b. Grounding Engine: PAN Query test with second document
    const panDoc = buildDocumentIndex({
      name: "Income_Tax_PAN_Card.pdf",
      size: "180 KB",
      sizeBytes: 184320,
      extraction: {
        extractedText: "INCOME TAX DEPARTMENT\nPermanent Account Number: ABCDE1234F\nName: Fictional Tester",
        pagesText: [{ page: 1, text: "INCOME TAX DEPARTMENT\nPermanent Account Number: ABCDE1234F\nName: Fictional Tester" }],
        pages: 1
      },
      analysis: analyzeDocument("Income_Tax_PAN_Card.pdf", "INCOME TAX DEPARTMENT\nPermanent Account Number: ABCDE1234F"),
      collection: "Identity"
    });
    activeVault.push(panDoc);

    const panRes = generateGroundingAnswer("Which document contains my PAN card?", activeVault);
    expect(panRes.empty).toBeFalsy();
    expect(panRes.answer).toContain("ABCDE1234F");
    expect(panRes.sources[0].docName).toBe("Income_Tax_PAN_Card.pdf");

    // 7c. Multi-page document page-preservation test
    const multiPageDoc = buildDocumentIndex({
      name: "Multi_Page_Contract.pdf",
      size: "400 KB",
      sizeBytes: 409600,
      extraction: {
        extractedText: "Page 1 Content\n---\nPage 2 Important Clauses: Clause 42 states confidential terms.",
        pagesText: [
          { page: 1, text: "Page 1 Content introductory terms." },
          { page: 2, text: "Page 2 Important Clauses: Clause 42 states confidential terms." }
        ],
        pages: 2
      },
      analysis: { detectedEntities: [], keyTerms: ["clause", "confidential"], collection: "Documents", summary: "Multi-page agreement" },
      collection: "Documents"
    });
    activeVault.push(multiPageDoc);

    const chunkPage2 = multiPageDoc.chunks.find(c => c.text.includes("Clause 42"));
    expect(chunkPage2).toBeDefined();
    expect(chunkPage2.page).toBe(2);

    // 8. Grounding Engine: Missing information returns exact no-evidence message
    const missingRes = generateGroundingAnswer("When does my passport expire?", activeVault);
    expect(missingRes.empty).toBe(true);
    expect(missingRes.sources.length).toBe(0);
    expect(missingRes.answer).toBe("I couldn't find reliable evidence for this information in your uploaded documents.");

    // 9. Document Deletion removes it completely from search results
    activeVault = activeVault.filter(d => d.id !== indexedDoc.id && d.id !== panDoc.id && d.id !== multiPageDoc.id);
    expect(activeVault.length).toBe(0);

    const deletedAadhaarRes = generateGroundingAnswer("What is my Aadhaar number?", activeVault);
    expect(deletedAadhaarRes.empty).toBe(true);
    expect(deletedAadhaarRes.sources.length).toBe(0);
  });

  it("handles unreadable, empty, and unsupported files with appropriate errors", async () => {
    const { extractDocumentContent } = await import("../documentExtractor");

    // 1. Unsupported extension (e.g. executable/binary)
    const unsupportedFile = new File(["binary-data"], "malware.exe", { type: "application/octet-stream" });
    await expect(extractDocumentContent(unsupportedFile)).rejects.toThrow(/Unsupported file type/);

    // 2. Empty text file
    const emptyFile = new File(["   "], "empty_notes.txt", { type: "text/plain" });
    await expect(extractDocumentContent(emptyFile)).rejects.toThrow(/empty/);

    // 3. Null / missing file argument
    await expect(extractDocumentContent(null)).rejects.toThrow(/No file provided/);
  });
});
