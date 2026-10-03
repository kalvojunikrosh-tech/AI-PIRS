export const PRESET_CONVERSATIONS = [
  {
    id: "conv-1",
    question: "What internships have I completed?",
    timestamp: "Just now",
    answer: "You have completed 2 internships based on the documents currently indexed in your repository:",
    structuredData: [
      {
        title: "Software Developer Intern",
        organization: "XYZ Technologies Inc.",
        period: "June 2025 – August 2025",
        summary: "Worked with the Core Engineering Team building responsive web dashboards in React & TypeScript and Python microservices with vector search embeddings."
      },
      {
        title: "AI/ML Intern",
        organization: "ABC Solutions",
        period: "January 2025 – March 2025",
        summary: "Developed end-to-end OCR and document ingestion pipelines, fine-tuning transformer models for information extraction with 94.2% precision."
      }
    ],
    sources: [
      {
        docId: "doc-4",
        docName: "Internship_Certificate.pdf",
        page: 1,
        relevance: 96,
        snippet: "Certificate of Internship Completion: Awarded to Arun Kumar for tenure as Software Developer Intern from June 2, 2025 to August 29, 2025."
      },
      {
        docId: "doc-5",
        docName: "Internship_Report.pdf",
        page: 4,
        relevance: 89,
        snippet: "Executive Summary: Over academic year 2024-2025, completed two internships: AI/ML Intern at ABC Solutions (Jan–Mar 2025) and Software Developer Intern at XYZ Technologies (Jun–Aug 2025)."
      }
    ],
    trustBadge: "Answer generated from your indexed documents."
  },
  {
    id: "conv-2",
    question: "Where is my Aadhaar number?",
    timestamp: "10 mins ago",
    answer: "Your Aadhaar number is 4829 1048 2910, registered under your name Arun Kumar with address in Madhapur, Hyderabad.",
    structuredData: [
      {
        title: "Aadhaar Card Details",
        organization: "Unique Identification Authority of India (UIDAI)",
        period: "Enrollment # 1048/29104/00291",
        summary: "Number: 4829 1048 2910 • Name: Arun Kumar • Address: Flat 402, Green Meadows, Madhapur, Hyderabad - 500081."
      }
    ],
    sources: [
      {
        docId: "doc-7",
        docName: "Aadhaar.pdf",
        page: 1,
        relevance: 99,
        snippet: "GOVERNMENT OF INDIA (UIDAI) — Your Aadhaar Number: 4829 1048 2910. Address: Flat 402, Green Meadows, Madhapur, Hyderabad."
      }
    ],
    trustBadge: "Answer generated from your indexed documents."
  },
  {
    id: "conv-3",
    question: "When does my passport expire?",
    timestamp: "Yesterday",
    answer: "Your Republic of India passport expires on 11 March 2031. It was issued in Hyderabad on 12 March 2021.",
    structuredData: [
      {
        title: "Indian Passport (Type P)",
        organization: "Ministry of External Affairs, India",
        period: "Valid: 12/03/2021 to 11/03/2031",
        summary: "Passport No: Z9182736 • Place of Issue: Hyderabad • Holder: Arun Kumar (DOB: 14/08/2003)"
      }
    ],
    sources: [
      {
        docId: "doc-6",
        docName: "Passport.pdf",
        page: 1,
        relevance: 98,
        snippet: "Passport No: Z9182736 | Date of Issue: 12/03/2021 | Date of Expiry: 11/03/2031 | Place of Issue: HYDERABAD"
      }
    ],
    trustBadge: "Answer generated from your indexed documents."
  },
  {
    id: "conv-4",
    question: "Find the invoice from March",
    timestamp: "3 days ago",
    answer: "Found 1 invoice from March 2025: Amazon Web Services (AWS) Invoice #INV-2025-0382 for $142.50 USD, marked as paid.",
    structuredData: [
      {
        title: "AWS Cloud Infrastructure Invoice",
        organization: "Amazon Web Services Inc.",
        period: "Billed on: March 15, 2025 (Period: Mar 1–31, 2025)",
        summary: "Includes EC2 instances ($76.20), S3 Standard Storage ($28.30), and Vector Database Endpoint ($38.00). Total: $142.50. Status: PAID."
      }
    ],
    sources: [
      {
        docId: "doc-8",
        docName: "Invoice_March.pdf",
        page: 1,
        relevance: 97,
        snippet: "TAX INVOICE INV-2025-0382 • Dated March 15, 2025 • Total Amount Due: $142.50 USD • Status: PAID"
      }
    ],
    trustBadge: "Answer generated from your indexed documents."
  },
  {
    id: "conv-5",
    question: "Which certificate mentions Python?",
    timestamp: "4 days ago",
    answer: "Your 'Advanced Python for Deep Learning & Natural Language Processing Specialization' certificate issued by Stanford Online / Coursera explicitly covers Python with an Honors score of 99.4%.",
    structuredData: [
      {
        title: "Advanced Python for Deep Learning & NLP Specialization",
        organization: "Stanford Online / Coursera",
        period: "Issued: July 12, 2025",
        summary: "Credential ID: PY-STAN-99201. Covers Pythonic architecture, PyTorch transformer implementations, and vector database embeddings."
      }
    ],
    sources: [
      {
        docId: "doc-9",
        docName: "Python_Certificate.pdf",
        page: 1,
        relevance: 99,
        snippet: "Statement of Accomplishment with Honors: ADVANCED PYTHON FOR DEEP LEARNING & NATURAL LANGUAGE PROCESSING. Score: 99.4%."
      },
      {
        docId: "doc-1",
        docName: "Resume.pdf",
        page: 1,
        relevance: 88,
        snippet: "Technical Skills: Languages: Python, JavaScript/TypeScript, SQL... Frameworks: FastAPI, LangChain, PyTorch."
      }
    ],
    trustBadge: "Answer generated from your indexed documents."
  },
  {
    id: "conv-6",
    question: "What was my semester 3 percentage?",
    timestamp: "5 days ago",
    answer: "Your available marksheet records reflect Semester 5 Grade Report where you secured an SGPA of 9.24 and an equivalent percentage of 88.4% (First Class with Distinction). Overall degree CGPA across all completed semesters is 9.18.",
    structuredData: [
      {
        title: "Semester 5 Grade Report",
        organization: "College of Engineering & Technology",
        period: "Autumn 2024",
        summary: "SGPA: 9.24 / 10.0 • Percentage: 88.4% • A+ in Algorithms and Networks, O grade in AI & ML."
      },
      {
        title: "Cumulative B.Tech Degree Record",
        organization: "Jawaharlal Nehru Technological University",
        period: "Conferred: July 2025",
        summary: "Cumulative CGPA: 9.18 / 10.0 • Classification: First Class with Distinction."
      }
    ],
    sources: [
      {
        docId: "doc-3",
        docName: "Semester_5_Marksheet.pdf",
        page: 1,
        relevance: 95,
        snippet: "SEMESTER GRADE REPORT: SGPA 9.24 / 10.0 | Equivalent Semester Percentage: 88.4% | Passed (Distinction)"
      },
      {
        docId: "doc-2",
        docName: "BTech_Certificate.pdf",
        page: 1,
        relevance: 91,
        snippet: "BACHELOR OF TECHNOLOGY: Division: First Class with Distinction (Cumulative Grade Point Average: 9.18 / 10)"
      }
    ],
    trustBadge: "Answer generated from your indexed documents."
  }
];

export function generateGroundingAnswer(query, documents) {
  const qLower = query.toLowerCase().trim();

  // Check exact/close matches to pre-seeded queries
  if (qLower.includes("internship")) {
    return PRESET_CONVERSATIONS[0];
  }
  if (qLower.includes("aadhaar") || qLower.includes("adhar") || qLower.includes("uidai")) {
    return PRESET_CONVERSATIONS[1];
  }
  if (qLower.includes("passport") || qLower.includes("expire") || qLower.includes("expiry")) {
    return PRESET_CONVERSATIONS[2];
  }
  if (qLower.includes("invoice") || qLower.includes("march") || qLower.includes("bill") || qLower.includes("aws")) {
    return PRESET_CONVERSATIONS[3];
  }
  if (qLower.includes("python") || qLower.includes("stanford") || qLower.includes("deep learning")) {
    return PRESET_CONVERSATIONS[4];
  }
  if (qLower.includes("percentage") || qLower.includes("marksheet") || qLower.includes("semester") || qLower.includes("cgpa") || qLower.includes("grade")) {
    return PRESET_CONVERSATIONS[5];
  }
  if (qLower.includes("skill") || qLower.includes("tech stack")) {
    return {
      id: "conv-dyn-" + Date.now(),
      question: query,
      timestamp: "Just now",
      answer: "According to your Resume.pdf, your key technical competencies span frontend, backend, and AI/ML engineering:",
      structuredData: [
        {
          title: "Languages & Core",
          organization: "Skill Profile",
          period: "Extracted from Resume",
          summary: "Python, JavaScript/TypeScript, SQL, C++, HTML5, CSS3"
        },
        {
          title: "Frameworks & AI",
          organization: "Skill Profile",
          period: "Extracted from Resume",
          summary: "React.js, Vite, Node.js, Express, FastAPI, LangChain, PyTorch, Vector Embeddings"
        },
        {
          title: "Databases & Cloud",
          organization: "Skill Profile",
          period: "Extracted from Resume",
          summary: "PostgreSQL, Redis, Pinecone, ChromaDB, AWS S3, Docker"
        }
      ],
      sources: [
        {
          docId: "doc-1",
          docName: "Resume.pdf",
          page: 1,
          relevance: 98,
          snippet: "TECHNICAL SKILLS: Languages: Python, JavaScript/TypeScript, SQL... Frameworks: React.js, FastAPI, LangChain, PyTorch..."
        }
      ],
      trustBadge: "Answer generated from your indexed documents."
    };
  }

  // Dynamic search across all active documents
  const scored = documents.map(doc => {
    let score = 0;
    const nameMatch = doc.name.toLowerCase().includes(qLower) ? 40 : 0;
    const summaryMatch = doc.summary.toLowerCase().includes(qLower) ? 35 : 0;
    const textMatch = doc.extractedText.toLowerCase().includes(qLower) ? 30 : 0;
    const keywordMatch = doc.keywords.some(k => k.toLowerCase().includes(qLower)) ? 25 : 0;
    score = Math.min(99, nameMatch + summaryMatch + textMatch + keywordMatch);
    return { doc, score };
  }).filter(item => item.score > 20).sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    const topDoc = scored[0].doc;
    return {
      id: "conv-dyn-" + Date.now(),
      question: query,
      timestamp: "Just now",
      answer: `Based on your indexed document "${topDoc.name}", here is the information matching your query:`,
      structuredData: [
        {
          title: topDoc.name.replace(".pdf", ""),
          organization: topDoc.collection + " Collection",
          period: "Indexed • " + topDoc.size,
          summary: topDoc.summary
        }
      ],
      sources: scored.slice(0, 3).map((item, idx) => ({
        docId: item.doc.id,
        docName: item.doc.name,
        page: idx + 1,
        relevance: item.score,
        snippet: item.doc.extractedText.slice(0, 160) + "..."
      })),
      trustBadge: "Answer generated from your indexed documents."
    };
  }

  // Fallback state
  return {
    id: "conv-dyn-" + Date.now(),
    question: query,
    timestamp: "Just now",
    answer: "No specific match found across your current documents. Try searching for terms found in your certificates, resume, bills, or identity records.",
    structuredData: [],
    sources: [],
    empty: true,
    trustBadge: "Answer generated from your indexed documents."
  };
}
