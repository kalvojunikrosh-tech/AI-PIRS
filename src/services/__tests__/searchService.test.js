import { describe, it, expect } from "vitest";
import { performGlobalSearch } from "../searchService";

describe("Global Search Service", () => {
  const sampleDocs = [
    { id: "1", name: "Aadhaar.pdf", summary: "Identity card", extractedText: "UIDAI 9876", keywords: ["Identity"], detectedEntities: [] },
    { id: "2", name: "Degree.pdf", summary: "Academic degree", extractedText: "B.Tech Computer Science", keywords: ["Degree"], detectedEntities: [] }
  ];

  const sampleCols = [
    { id: "c1", name: "Identity", description: "Identity cards" },
    { id: "c2", name: "Academic", description: "Academic records" }
  ];

  it("returns default results when query is empty", () => {
    const res = performGlobalSearch("", sampleDocs, sampleCols);
    expect(res.documents.length).toBe(2);
    expect(res.collections.length).toBe(2);
    expect(res.aiAnswers.length).toBeGreaterThan(0);
  });

  it("filters documents by name and content", () => {
    const res = performGlobalSearch("Aadhaar", sampleDocs, sampleCols);
    expect(res.documents.length).toBe(1);
    expect(res.documents[0].name).toBe("Aadhaar.pdf");
  });

  it("filters collections by name", () => {
    const res = performGlobalSearch("Academic", sampleDocs, sampleCols);
    expect(res.collections.length).toBe(1);
    expect(res.collections[0].name).toBe("Academic");
  });
});
