import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { createWorker } from "tesseract.js";

// Polyfill Promise.try if missing (e.g., in node/vitest test runners)
if (typeof Promise.try !== "function") {
  Promise.try = function (fn) {
    return new Promise((resolve) => resolve(fn()));
  };
}

// Setup PDF.js worker
if (typeof window !== "undefined") {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  } catch {
    // Fallback if URL resolution fails
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || "4.10.38"}/build/pdf.worker.min.mjs`;
  }
}

/**
 * Extracts plain text and page-wise text from an uploaded File.
 * Supported formats: PDF, DOCX, TXT, MD, CSV, JSON, PNG, JPG, JPEG, WEBP.
 *
 * @param {File} file
 * @param {(stage: string, progress: number) => void} onProgress
 * @returns {Promise<{ extractedText: string, pagesText: Array<{ page: number, text: string }>, pages: number }>}
 */
export async function extractDocumentContent(file, onProgress = () => {}) {
  if (!file) {
    throw new Error("No file provided for extraction.");
  }

  const name = file.name.toLowerCase();
  const ext = name.split(".").pop();

  onProgress("reading", 25);

  // 1. PDF Documents
  if (ext === "pdf" || file.type === "application/pdf") {
    onProgress("extracting", 45);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useWorkerFetch: true,
        isEvalSupported: false,
        useSystemFonts: true
      });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages || 1;
      const pagesText = [];
      let fullText = "";

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageItems = textContent.items
          .map(item => item.str || "")
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        pagesText.push({ page: i, text: pageItems });
        fullText += (fullText ? "\n\n" : "") + `[Page ${i}]\n` + pageItems;
        onProgress("extracting", 45 + Math.round((i / numPages) * 35));
      }

      if (!fullText.trim()) {
        throw new Error("No readable text found in PDF. The document might be image-only or password protected.");
      }

      return {
        extractedText: fullText.trim(),
        pagesText,
        pages: numPages
      };
    } catch (err) {
      console.error("PDF Extraction error:", err);
      throw new Error(`Failed to parse PDF: ${err.message || "File could not be parsed"}`);
    }
  }

  // 2. DOCX Documents
  if (ext === "docx" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    onProgress("extracting", 50);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = (result.value || "").trim();

      if (!text) {
        throw new Error("No readable text content found in DOCX file.");
      }

      onProgress("extracting", 80);
      return {
        extractedText: text,
        pagesText: [{ page: 1, text }],
        pages: 1
      };
    } catch (err) {
      console.error("DOCX extraction error:", err);
      throw new Error(`Failed to extract text from DOCX: ${err.message || "Invalid or corrupt document"}`);
    }
  }

  // 3. Plain Text, Markdown, CSV, JSON
  if (["txt", "md", "csv", "json", "log", "text"].includes(ext) || file.type.startsWith("text/")) {
    onProgress("extracting", 60);
    try {
      const text = await file.text();
      if (!text.trim()) {
        throw new Error("The uploaded text file is empty.");
      }

      onProgress("extracting", 85);
      return {
        extractedText: text.trim(),
        pagesText: [{ page: 1, text: text.trim() }],
        pages: 1
      };
    } catch (err) {
      console.error("Text file read error:", err);
      throw new Error(`Failed to read text file: ${err.message}`);
    }
  }

  // 4. Image Files with Tesseract OCR
  if (["png", "jpg", "jpeg", "webp", "bmp"].includes(ext) || file.type.startsWith("image/")) {
    onProgress("extracting", 40);
    try {
      const worker = await createWorker("eng");
      onProgress("extracting", 60);
      const ret = await worker.recognize(file);
      await worker.terminate();

      const ocrText = (ret.data?.text || "").trim();
      if (!ocrText) {
        throw new Error("OCR scan completed but no readable text could be detected in image.");
      }

      onProgress("extracting", 85);
      return {
        extractedText: ocrText,
        pagesText: [{ page: 1, text: ocrText }],
        pages: 1
      };
    } catch (err) {
      console.error("OCR Extraction error:", err);
      throw new Error(`Optical Character Recognition (OCR) failed: ${err.message}`);
    }
  }

  // 5. Unsupported file type
  throw new Error(`Unsupported file type (.${ext || "unknown"}). Supported formats are PDF, DOCX, TXT, MD, CSV, JSON, PNG, JPG, JPEG.`);
}
