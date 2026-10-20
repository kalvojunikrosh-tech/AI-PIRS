import { describe, it, expect } from "vitest";
import { analyzeDocument } from "../entityExtractor";

describe("Entity Extractor", () => {
  it("extracts Aadhaar number from fictional document text", () => {
    const text = `GOVERNMENT OF INDIA
Unique Identification Authority of India
Enrollment No: 1234/56789/01234
To: Sample Test User
Aadhaar Number: 9876 5432 1098
Address: 123 Innovation Park, Bangalore, Karnataka 560001`;

    const result = analyzeDocument("Aadhaar_Card.pdf", text);
    expect(result.collection).toBe("Identity");
    const aadhaar = result.detectedEntities.find(e => e.type === "ID_AADHAAR");
    expect(aadhaar).toBeDefined();
    expect(aadhaar.value).toBe("9876 5432 1098");
  });

  it("extracts PAN number from fictional PAN document text", () => {
    const text = `INCOME TAX DEPARTMENT - GOVT OF INDIA
Permanent Account Number Card
ABCDE1234F
Name: Sample User
Father's Name: Test Father`;

    const result = analyzeDocument("Pan_Card.pdf", text);
    expect(result.collection).toBe("Identity");
    const pan = result.detectedEntities.find(e => e.type === "ID_PAN");
    expect(pan).toBeDefined();
    expect(pan.value).toBe("ABCDE1234F");
  });

  it("extracts Driving Licence number and expiry date from fictional DL text", () => {
    const text = `UNION OF INDIA - DRIVING LICENCE
DL No: DL-0420210098765
Name: Sample Citizen
Date of Issue: 15/01/2021
Date of Expiry: 14/01/2041
Vehicle Class: LMV, MCWG`;

    const result = analyzeDocument("Driving_Licence.pdf", text);
    expect(result.collection).toBe("Identity");
    const dl = result.detectedEntities.find(e => e.type === "ID_DL");
    expect(dl).toBeDefined();
    expect(dl.value).toContain("DL-0420210098765");

    const expiry = result.detectedEntities.find(e => e.type === "DATE_EXPIRY");
    expect(expiry).toBeDefined();
    expect(expiry.value).toBe("14/01/2041");
  });

  it("extracts Passport number and expiry date from fictional passport text", () => {
    const text = `REPUBLIC OF INDIA - PASSPORT
Type: P | Country Code: IND | Passport No: T1234567
Surname: CITIZEN | Given Name: TEST
Date of Issue: 10/05/2022
Date of Expiry: 09/05/2032`;

    const result = analyzeDocument("Passport.pdf", text);
    expect(result.collection).toBe("Identity");
    expect(result.visualType).toBe("passport");
    const pass = result.detectedEntities.find(e => e.type === "ID_PASSPORT");
    expect(pass).toBeDefined();
    expect(pass.value).toBe("T1234567");

    const expiry = result.detectedEntities.find(e => e.type === "DATE_EXPIRY");
    expect(expiry).toBeDefined();
    expect(expiry.value).toBe("09/05/2032");
  });

  it("extracts invoice number and amount from fictional invoice text", () => {
    const text = `TAX INVOICE
Invoice Number: INV-2025-0981
Date: March 24, 2025
Billed To: Test Client
Total Amount Due: $350.00 USD`;

    const result = analyzeDocument("Invoice_March.pdf", text);
    expect(result.collection).toBe("Financial");
    const inv = result.detectedEntities.find(e => e.type === "INVOICE_NUM");
    expect(inv).toBeDefined();
    expect(inv.value).toBe("INV-2025-0981");

    const amount = result.detectedEntities.find(e => e.type === "AMOUNT");
    expect(amount).toBeDefined();
    expect(amount.value).toContain("350.00");
  });
});
