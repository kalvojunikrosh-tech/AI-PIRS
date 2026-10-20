import { describe, it, expect } from "vitest";
import { generateGroundingAnswer } from "../groundingEngine";

describe("AI-PIRS Grounding & Retrieval Engine", () => {
  // Test fixture with fictional documents
  const mockVault = [
    {
      id: "doc-aadhaar-1",
      name: "Government_Aadhaar_Card.pdf",
      collection: "Identity",
      extractedText: "UNIQUE IDENTIFICATION AUTHORITY OF INDIA\nAadhaar Number: 9876 5432 1098\nName: Fictional User\nAddress: Flat 501, Silicon Valley Residences, Whitefield, Bangalore, Karnataka 560066",
      pagesText: [
        {
          page: 1,
          text: "UNIQUE IDENTIFICATION AUTHORITY OF INDIA\nAadhaar Number: 9876 5432 1098\nName: Fictional User\nAddress: Flat 501, Silicon Valley Residences, Whitefield, Bangalore, Karnataka 560066"
        }
      ],
      detectedEntities: [
        { type: "ID_AADHAAR", label: "Aadhaar Number", value: "9876 5432 1098" },
        { type: "ADDRESS", label: "Address", value: "Flat 501, Silicon Valley Residences, Whitefield, Bangalore, Karnataka 560066" }
      ],
      summary: "Unique Identification Authority of India (UIDAI) Aadhaar Card for Fictional User."
    },
    {
      id: "doc-dl-1",
      name: "Driving_Licence_Karnataka.pdf",
      collection: "Identity",
      extractedText: "GOVERNMENT OF KARNATAKA - MOTOR VEHICLES DEPARTMENT\nDriving Licence Number: DL-0420210098765\nHolder: Fictional User\nDate of Issue: 15/01/2021\nValid Till / Date of Expiry: 14/01/2041\nClass: LMV, NT",
      pagesText: [
        {
          page: 1,
          text: "GOVERNMENT OF KARNATAKA - MOTOR VEHICLES DEPARTMENT\nDriving Licence Number: DL-0420210098765\nHolder: Fictional User\nDate of Issue: 15/01/2021\nValid Till / Date of Expiry: 14/01/2041\nClass: LMV, NT"
        }
      ],
      detectedEntities: [
        { type: "ID_DL", label: "Driving Licence Number", value: "DL-0420210098765" },
        { type: "DATE_EXPIRY", label: "Driving Licence Expiry", value: "14/01/2041" }
      ],
      summary: "Motor Vehicles Department Driving Licence for Fictional User."
    },
    {
      id: "doc-pan-1",
      name: "PAN_Card_Record.pdf",
      collection: "Identity",
      extractedText: "INCOME TAX DEPARTMENT - GOVT OF INDIA\nPermanent Account Number Card\nPAN: ABCDE1234F\nName: Fictional User\nFather: Sample Guardian",
      pagesText: [
        {
          page: 1,
          text: "INCOME TAX DEPARTMENT - GOVT OF INDIA\nPermanent Account Number Card\nPAN: ABCDE1234F\nName: Fictional User\nFather: Sample Guardian"
        }
      ],
      detectedEntities: [
        { type: "ID_PAN", label: "PAN Number", value: "ABCDE1234F" }
      ],
      summary: "Income Tax Department Permanent Account Number Card."
    },
    {
      id: "doc-passport-1",
      name: "Republic_of_India_Passport.pdf",
      collection: "Identity",
      extractedText: "REPUBLIC OF INDIA - PASSPORT\nPassport No: Z1234567\nBearer: Fictional User\nDate of Expiry: 25/08/2033\nPlace of Issue: Bangalore",
      pagesText: [
        {
          page: 1,
          text: "REPUBLIC OF INDIA - PASSPORT\nPassport No: Z1234567\nBearer: Fictional User\nDate of Expiry: 25/08/2033\nPlace of Issue: Bangalore"
        }
      ],
      detectedEntities: [
        { type: "ID_PASSPORT", label: "Passport Number", value: "Z1234567" },
        { type: "DATE_EXPIRY", label: "Passport Expiry Date", value: "25/08/2033" }
      ],
      summary: "Republic of India Official Passport document."
    },
    {
      id: "doc-inv-1",
      name: "Cloud_Services_Invoice_March.pdf",
      collection: "Financial",
      extractedText: "TAX INVOICE - CLOUD INFRASTRUCTURE\nInvoice Number: INV-2025-0391\nBilling Period: March 1 - March 31, 2025\nTotal Amount Due: $185.00 USD\nStatus: PAID",
      pagesText: [
        {
          page: 1,
          text: "TAX INVOICE - CLOUD INFRASTRUCTURE\nInvoice Number: INV-2025-0391\nBilling Period: March 1 - March 31, 2025\nTotal Amount Due: $185.00 USD\nStatus: PAID"
        }
      ],
      detectedEntities: [
        { type: "INVOICE_NUM", label: "Invoice Number", value: "INV-2025-0391" },
        { type: "AMOUNT", label: "Amount", value: "$185.00 USD" }
      ],
      summary: "Cloud Infrastructure Tax Invoice for March 2025."
    }
  ];

  it("handles fresh installation with zero documents gracefully", () => {
    const res = generateGroundingAnswer("What is my Aadhaar number?", []);
    expect(res.empty).toBe(true);
    expect(res.sources.length).toBe(0);
    expect(res.answer).toContain("No documents have been uploaded");
  });

  it("retrieves Aadhaar location with source citation", () => {
    const res = generateGroundingAnswer("Where is my Aadhaar card?", mockVault);
    expect(res.sources.length).toBeGreaterThan(0);
    expect(res.sources[0].docName).toBe("Government_Aadhaar_Card.pdf");
    expect(res.sources[0].page).toBe(1);
    expect(res.answer).toContain("Government_Aadhaar_Card.pdf");
  });

  it("retrieves exact Aadhaar number from uploaded document", () => {
    const res = generateGroundingAnswer("What is my Aadhaar number?", mockVault);
    expect(res.answer).toContain("9876 5432 1098");
    expect(res.sources[0].docName).toBe("Government_Aadhaar_Card.pdf");
  });

  it("retrieves driving licence number from uploaded document", () => {
    const res = generateGroundingAnswer("What is my driving licence number?", mockVault);
    expect(res.answer).toContain("DL-0420210098765");
    expect(res.sources[0].docName).toBe("Driving_Licence_Karnataka.pdf");
  });

  it("retrieves driving licence expiry date", () => {
    const res = generateGroundingAnswer("When does my driving licence expire?", mockVault);
    expect(res.answer).toContain("14/01/2041");
    expect(res.sources[0].docName).toBe("Driving_Licence_Karnataka.pdf");
  });

  it("identifies which file contains PAN card", () => {
    const res = generateGroundingAnswer("Which file contains my PAN card?", mockVault);
    expect(res.sources[0].docName).toBe("PAN_Card_Record.pdf");
    expect(res.answer).toContain("PAN_Card_Record.pdf");
  });

  it("retrieves passport expiry date", () => {
    const res = generateGroundingAnswer("When does my passport expire?", mockVault);
    expect(res.answer).toContain("25/08/2033");
    expect(res.sources[0].docName).toBe("Republic_of_India_Passport.pdf");
  });

  it("retrieves residential address with citation", () => {
    const res = generateGroundingAnswer("Find my address.", mockVault);
    expect(res.answer).toContain("Whitefield, Bangalore");
    expect(res.sources[0].docName).toBe("Government_Aadhaar_Card.pdf");
  });

  it("summarises specific document", () => {
    const res = generateGroundingAnswer("Summarise this document.", mockVault, mockVault[4]);
    expect(res.answer).toContain("Cloud Infrastructure");
    expect(res.sources[0].docName).toBe("Cloud_Services_Invoice_March.pdf");
  });

  it("retrieves the invoice from March with citation", () => {
    const res = generateGroundingAnswer("Find the invoice from March.", mockVault);
    expect(res.answer).toContain("Cloud_Services_Invoice_March.pdf");
    expect(res.sources[0].docName).toBe("Cloud_Services_Invoice_March.pdf");
  });

  it("lists all identity documents", () => {
    const res = generateGroundingAnswer("Show all my identity documents.", mockVault);
    expect(res.answer).toContain("Government_Aadhaar_Card.pdf");
    expect(res.answer).toContain("Driving_Licence_Karnataka.pdf");
    expect(res.answer).toContain("PAN_Card_Record.pdf");
    expect(res.answer).toContain("Republic_of_India_Passport.pdf");
  });

  it("returns strict no-match result when query is not in uploaded documents", () => {
    const res = generateGroundingAnswer("What is my blood group?", mockVault);
    expect(res.empty).toBe(true);
    expect(res.sources.length).toBe(0);
    expect(res.answer).toBe("I couldn't find reliable evidence for this information in your uploaded documents.");
  });

  it("ensures deleted document cannot be retrieved", () => {
    // Delete driving licence from vault
    const vaultWithoutDL = mockVault.filter(d => d.id !== "doc-dl-1");
    const res = generateGroundingAnswer("What is my driving licence number?", vaultWithoutDL);
    expect(res.empty).toBe(true);
    expect(res.sources.length).toBe(0);
    expect(res.answer).toBe("I couldn't find reliable evidence for this information in your uploaded documents.");
  });
});
