import { describe, it, expect } from "vitest";
import { buildDocumentIndex, createSearchableChunks, queryDocumentIndex } from "../indexingService";

describe("Document Indexing Service", () => {
  it("creates searchable chunks preserving page metadata", () => {
    const pagesText = [
      { page: 1, text: "Welcome to the system. This is page one content." },
      { page: 2, text: "Government issued identity number: 9876 5432 1098. Valid till 2035." }
    ];

    const chunks = createSearchableChunks(pagesText, "");
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    expect(chunks.some(c => c.page === 1)).toBe(true);
    expect(chunks.some(c => c.page === 2)).toBe(true);
    expect(chunks.find(c => c.page === 2)?.text).toContain("9876 5432 1098");
  });

  it("builds a standardized document index", () => {
    const extraction = {
      extractedText: "Permanent Account Number: ABCDE1234F\nIncome Tax Dept.",
      pagesText: [{ page: 1, text: "Permanent Account Number: ABCDE1234F\nIncome Tax Dept." }],
      pages: 1
    };
    const analysis = {
      collection: "Identity",
      summary: "Sample PAN card summary",
      keywords: ["PAN", "Tax"],
      detectedEntities: [{ type: "ID_PAN", label: "PAN Number", value: "ABCDE1234F" }]
    };

    const docIndex = buildDocumentIndex({
      name: "Sample_Pan.pdf",
      size: "150 KB",
      sizeBytes: 153600,
      extraction,
      analysis,
      collection: "Identity"
    });

    expect(docIndex.id).toBeDefined();
    expect(docIndex.name).toBe("Sample_Pan.pdf");
    expect(docIndex.type).toBe("pdf");
    expect(docIndex.status).toBe("indexed");
    expect(docIndex.isIndexed).toBe(true);
    expect(docIndex.chunks.length).toBeGreaterThan(0);
    expect(docIndex.chunks[0].page).toBe(1);
    expect(docIndex.detectedEntities[0].value).toBe("ABCDE1234F");
  });

  it("queries the document index and returns scored passages with page numbers", () => {
    const doc = buildDocumentIndex({
      name: "Driving_Licence.pdf",
      size: "200 KB",
      sizeBytes: 204800,
      extraction: {
        extractedText: "Transport Authority. Driving Licence DL-9988776655. Expires on 12/12/2040.",
        pagesText: [{ page: 1, text: "Transport Authority. Driving Licence DL-9988776655. Expires on 12/12/2040." }],
        pages: 1
      },
      analysis: {
        collection: "Identity",
        summary: "Driving Licence record",
        keywords: ["Licence"],
        detectedEntities: []
      }
    });

    const results = queryDocumentIndex("driving licence expires", [doc]);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].docName).toBe("Driving_Licence.pdf");
    expect(results[0].page).toBe(1);
    expect(results[0].snippet).toContain("DL-9988776655");
  });
});
