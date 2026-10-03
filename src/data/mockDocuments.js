export const INITIAL_DOCUMENTS = [
  {
    id: "doc-1",
    name: "Resume.pdf",
    type: "pdf",
    extension: "PDF",
    size: "142 KB",
    sizeBytes: 145408,
    uploadedAt: "2026-09-28T14:30:00Z",
    modifiedAt: "2026-10-02T09:15:00Z",
    isIndexed: true,
    indexQuality: "100%",
    pages: 2,
    collection: "Personal",
    tags: ["Career", "Fullstack", "AI/ML", "React"],
    visualType: "resume",
    summary: "Senior software engineer resume highlighting 2 completed internships (XYZ Tech & ABC Solutions), B.Tech in CSE (CGPA 9.18), and expertise in React, Node.js, Python, RAG pipelines, and vector databases.",
    keywords: ["React.js", "Python", "FastAPI", "PostgreSQL", "Retrieval-Augmented Generation", "Docker", "Machine Learning", "Internship"],
    detectedEntities: [
      { type: "PERSON", label: "Candidate", value: "Arun Kumar" },
      { type: "DEGREE", label: "Education", value: "B.Tech Computer Science & Engineering" },
      { type: "ORG", label: "Previous Employer", value: "XYZ Technologies" },
      { type: "ORG", label: "Previous Employer", value: "ABC Solutions" },
      { type: "EMAIL", label: "Contact", value: "arun.k@domain.dev" },
      { type: "PHONE", label: "Contact", value: "+91 98450 19283" }
    ],
    extractedText: `ARUN KUMAR
Full-Stack & Applied AI Engineer
Hyderabad, India | +91 98450 19283 | arun.k@domain.dev | github.com/arunkumar-dev

SUMMARY
Passionate engineer specializing in modern web applications, distributed document storage, and natural language information retrieval systems. Experienced with React, Node.js, Python, vector embeddings, and cloud architecture.

EXPERIENCE
1. Software Developer Intern — XYZ Technologies (June 2025 – August 2025)
   - Architected responsive web dashboards in React & TypeScript serving 40k+ monthly active users.
   - Built microservices in Python (FastAPI) and integrated vector embeddings for semantic document search.
   - Reduced client query latency by 38% through intelligent Redis caching and normalized schemas.

2. AI/ML Intern — ABC Solutions (January 2025 – March 2025)
   - Developed end-to-end OCR and document ingestion pipelines handling scanned PDFs and receipts.
   - Fine-tuned transformer models for information extraction with 94.2% entity recognition precision.

EDUCATION
Bachelor of Technology in Computer Science & Engineering
VNR Vignana Jyothi Institute of Engineering & Technology (2021 – 2025)
CGPA: 9.18 / 10.0 (First Class with Distinction)

TECHNICAL SKILLS
Languages: Python, JavaScript/TypeScript, SQL, C++, HTML5, CSS3
Frameworks & Libraries: React.js, Vite, Node.js, Express, FastAPI, LangChain, PyTorch
Data & Storage: PostgreSQL, Redis, Pinecone, ChromaDB, AWS S3
Tools: Docker, Git, Linux, Webpack, Figma`
  },
  {
    id: "doc-2",
    name: "BTech_Certificate.pdf",
    type: "pdf",
    extension: "PDF",
    size: "320 KB",
    sizeBytes: 327680,
    uploadedAt: "2026-09-15T11:20:00Z",
    modifiedAt: "2026-09-15T11:20:00Z",
    isIndexed: true,
    indexQuality: "98%",
    pages: 1,
    collection: "Certificates",
    tags: ["Degree", "Graduation", "University", "CSE"],
    visualType: "certificate",
    summary: "Official Degree Certificate awarded by Jawaharlal Nehru Technological University conferring the degree of Bachelor of Technology in Computer Science & Engineering with First Class with Distinction.",
    keywords: ["Bachelor of Technology", "Computer Science", "First Class with Distinction", "CGPA 9.18", "Roll 21BCE10482"],
    detectedEntities: [
      { type: "PERSON", label: "Recipient", value: "Arun Kumar" },
      { type: "ID", label: "Roll / Reg Number", value: "21BCE10482" },
      { type: "ORG", label: "University", value: "Jawaharlal Nehru Technological University" },
      { type: "DEGREE", label: "Degree", value: "Bachelor of Technology (Computer Science & Engineering)" },
      { type: "GRADE", label: "Classification", value: "First Class with Distinction" },
      { type: "DATE", label: "Conferral Date", value: "July 24, 2025" }
    ],
    extractedText: `JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY
HYDERABAD, TELANGANA, INDIA

This is to certify that
ARUN KUMAR
Son / Daughter of Ramesh Kumar & Shanti Devi
bearing Hall Ticket No: 21BCE10482

having fulfilled all the academic requirements in June 2025
has this day been admitted by the Executive Council to the Degree of

BACHELOR OF TECHNOLOGY
in
COMPUTER SCIENCE AND ENGINEERING

Division: First Class with Distinction (Cumulative Grade Point Average: 9.18 / 10)
Given under the Seal of the University this Twenty-Fourth day of July, Two Thousand Twenty-Five.

Registrar                           Vice-Chancellor
[OFFICIAL EMBOSSED SEAL]`
  },
  {
    id: "doc-3",
    name: "Semester_5_Marksheet.pdf",
    type: "pdf",
    extension: "PDF",
    size: "210 KB",
    sizeBytes: 215040,
    uploadedAt: "2026-09-16T10:00:00Z",
    modifiedAt: "2026-09-16T10:00:00Z",
    isIndexed: true,
    indexQuality: "99%",
    pages: 1,
    collection: "Academic",
    tags: ["Marksheet", "Semester 5", "Transcripts", "CGPA"],
    visualType: "marksheet",
    summary: "Semester 5 Grade Card showing stellar grades in Design and Analysis of Algorithms (A+), Operating Systems (A), Computer Networks (A+), and Artificial Intelligence & ML (O). Semester SGPA: 9.24, Cumulative Percentage: 88.4%.",
    keywords: ["Design & Analysis of Algorithms", "Operating Systems", "Artificial Intelligence & ML", "SGPA 9.24", "Percentage 88.4%"],
    detectedEntities: [
      { type: "PERSON", label: "Student", value: "Arun Kumar" },
      { type: "ID", label: "Roll Number", value: "21BCE10482" },
      { type: "METRIC", label: "Semester SGPA", value: "9.24" },
      { type: "METRIC", label: "Semester Percentage", value: "88.4%" },
      { type: "DATE", label: "Examination Period", value: "Nov-Dec 2024" }
    ],
    extractedText: `COLLEGE OF ENGINEERING & TECHNOLOGY
SEMESTER GRADE REPORT — AUTUMN 2024

Student Name: Arun Kumar
Roll Number: 21BCE10482
Program: B.Tech (Computer Science & Engineering) — Semester 5

COURSE CODE | COURSE TITLE                         | CREDITS | GRADE | GRADE POINT
CS501       | Design & Analysis of Algorithms      | 4       | A+    | 10
CS502       | Operating Systems Concepts           | 4       | A     | 9
CS503       | Computer Networks & Protocols        | 4       | A+    | 10
CS504       | Artificial Intelligence & ML         | 4       | O     | 10
CS505       | Web Application Architecture         | 3       | A+    | 10
CS511       | Algorithms & OS Laboratory           | 2       | O     | 10

TOTAL CREDITS: 21 | CREDITS SECURED: 21
SEMESTER GRADE POINT AVERAGE (SGPA): 9.24 / 10.0
EQUIVALENT SEMESTER PERCENTAGE: 88.4%
OVERALL STATUS: PASSED (DISTINCTION)`
  },
  {
    id: "doc-4",
    name: "Internship_Certificate.pdf",
    type: "pdf",
    extension: "PDF",
    size: "185 KB",
    sizeBytes: 189440,
    uploadedAt: "2026-09-20T16:45:00Z",
    modifiedAt: "2026-09-20T16:45:00Z",
    isIndexed: true,
    indexQuality: "100%",
    pages: 1,
    collection: "Certificates",
    tags: ["Internship", "XYZ Tech", "Software Developer", "Recommendation"],
    visualType: "certificate",
    summary: "Letter of Completion and commendation from XYZ Technologies certifying Arun Kumar completed the Software Developer Internship between June 2025 and August 2025 with exemplary performance.",
    keywords: ["XYZ Technologies", "Software Developer Intern", "June 2025 – August 2025", "Exemplary Performance"],
    detectedEntities: [
      { type: "PERSON", label: "Intern", value: "Arun Kumar" },
      { type: "ORG", label: "Company", value: "XYZ Technologies Inc." },
      { type: "ROLE", label: "Designation", value: "Software Developer Intern" },
      { type: "DATE", label: "Start Date", value: "June 2, 2025" },
      { type: "DATE", label: "End Date", value: "August 29, 2025" }
    ],
    extractedText: `XYZ TECHNOLOGIES INC.
INNOVATION LABS • HITEC CITY, HYDERABAD

CERTIFICATE OF INTERNSHIP COMPLETION
Date of Issue: August 30, 2025
Certificate ID: XYZ-INT-2025-0891

This certificate is proudly awarded to:
ARUN KUMAR

In recognition of successful completion of his tenure as a Software Developer Intern with the Core Engineering Team from June 2, 2025 to August 29, 2025.

During this period, Arun demonstrated outstanding technical capabilities in designing responsive front-end workflows using modern web technologies, optimizing backend microservices in Python, and integrating neural search algorithms. His discipline, innovative mindset, and collaborative team spirit were exemplary.

We wish him the absolute best in all his future endeavors.

Vikram Sengupta                         Neha Sharma
VP of Engineering                       Director, People & Culture
XYZ Technologies Inc.`
  },
  {
    id: "doc-5",
    name: "Internship_Report.pdf",
    type: "pdf",
    extension: "PDF",
    size: "1.4 MB",
    sizeBytes: 1468006,
    uploadedAt: "2026-09-22T08:12:00Z",
    modifiedAt: "2026-09-22T08:12:00Z",
    isIndexed: true,
    indexQuality: "95%",
    pages: 12,
    collection: "Work",
    tags: ["Internship", "Report", "ABC Solutions", "AI/ML"],
    visualType: "report",
    summary: "Comprehensive 12-page technical internship report covering internships at ABC Solutions (AI/ML Intern, Jan-Mar 2025) and XYZ Technologies (Software Developer Intern, Jun-Aug 2025), detailing RAG architectures and benchmarking results.",
    keywords: ["ABC Solutions", "XYZ Technologies", "Internship", "Transformers", "Information Retrieval", "Page 4"],
    detectedEntities: [
      { type: "PERSON", label: "Author", value: "Arun Kumar" },
      { type: "ROLE", label: "Position 1", value: "AI/ML Intern at ABC Solutions (Jan 2025 - Mar 2025)" },
      { type: "ROLE", label: "Position 2", value: "Software Developer Intern at XYZ Technologies (Jun 2025 - Aug 2025)" },
      { type: "ORG", label: "Institutions", value: "ABC Solutions & XYZ Technologies" }
    ],
    extractedText: `INTERNSHIP TECHNICAL SUMMARY & CAPSTONE REPORT
Submitted by: Arun Kumar (Roll No. 21BCE10482)
Faculty Supervisor: Dr. K. Radhakrishnan

EXECUTIVE SUMMARY
Over the course of academic year 2024-2025, I completed two industrial internships:
1. AI/ML Intern at ABC Solutions (January 2025 – March 2025)
   Mentored by Dr. Sunita Rao, Principal AI Scientist.
   Focused on optical character recognition (OCR), text tokenization, and vector store embeddings.

2. Software Developer Intern at XYZ Technologies (June 2025 – August 2025)
   Mentored by Vikram Sengupta, VP of Engineering.
   Focused on production web applications, fast asynchronous APIs, and real-time document retrieval.

Detailed project descriptions, architectural diagrams, benchmark metrics, and production learnings are outlined in Sections 2 through 6 of this report.`
  },
  {
    id: "doc-6",
    name: "Passport.pdf",
    type: "pdf",
    extension: "PDF",
    size: "450 KB",
    sizeBytes: 460800,
    uploadedAt: "2026-08-10T12:00:00Z",
    modifiedAt: "2026-08-10T12:00:00Z",
    isIndexed: true,
    indexQuality: "100%",
    pages: 2,
    collection: "Identity",
    tags: ["Passport", "Identity", "Travel", "Government"],
    visualType: "passport",
    summary: "Official Republic of India Passport for Arun Kumar. Passport Number: Z9182736, Date of Issue: 12 March 2021, Date of Expiry: 11 March 2031, Place of Issue: Hyderabad.",
    keywords: ["Passport No: Z9182736", "Expires: 11 March 2031", "Republic of India", "Hyderabad"],
    detectedEntities: [
      { type: "ID", label: "Passport Number", value: "Z9182736" },
      { type: "PERSON", label: "Holder Name", value: "Arun Kumar" },
      { type: "DATE", label: "Date of Birth", value: "14 August 2003" },
      { type: "DATE", label: "Date of Issue", value: "12 March 2021" },
      { type: "DATE", label: "Date of Expiry", value: "11 March 2031" },
      { type: "LOC", label: "Place of Issue", value: "Hyderabad" }
    ],
    extractedText: `REPUBLIC OF INDIA / RÉPUBLIQUE DE L'INDE
PASSPORT / PASSEPORT

Type: P | Country Code: IND | Passport No: Z9182736

Given Name: ARUN
Surname: KUMAR
Nationality: INDIAN
Sex: M
Date of Birth: 14/08/2003
Place of Birth: HYDERABAD, TELANGANA
Place of Issue: HYDERABAD
Date of Issue: 12/03/2021
Date of Expiry: 11/03/2031

P<INDKUMAR<<ARUN<<<<<<<<<<<<<<<<<<<<<<<<<<<<
Z9182736<9IND0308144M3103118<<<<<<<<<<<<<<02`
  },
  {
    id: "doc-7",
    name: "Aadhaar.pdf",
    type: "pdf",
    extension: "PDF",
    size: "280 KB",
    sizeBytes: 286720,
    uploadedAt: "2026-08-10T12:05:00Z",
    modifiedAt: "2026-08-10T12:05:00Z",
    isIndexed: true,
    indexQuality: "100%",
    pages: 1,
    collection: "Identity",
    tags: ["Aadhaar", "UIDAI", "Identity", "Government"],
    visualType: "idcard",
    summary: "Unique Identification Authority of India (UIDAI) e-Aadhaar card for Arun Kumar. Aadhaar Number: 4829 1048 2910, Address: Flat 402, Green Meadows, Madhapur, Hyderabad - 500081.",
    keywords: ["Aadhaar: 4829 1048 2910", "UIDAI", "Green Meadows", "Madhapur", "Hyderabad"],
    detectedEntities: [
      { type: "ID", label: "Aadhaar Number", value: "4829 1048 2910" },
      { type: "PERSON", label: "Name", value: "Arun Kumar" },
      { type: "DATE", label: "DOB", value: "14/08/2003" },
      { type: "LOC", label: "Address", value: "Flat 402, Green Meadows, Madhapur, Hyderabad, 500081" }
    ],
    extractedText: `GOVERNMENT OF INDIA
UNIQUE IDENTIFICATION AUTHORITY OF INDIA (UIDAI)

Enrollment No: 1048/29104/00291

To:
Arun Kumar
S/O Ramesh Kumar
Flat 402, Green Meadows,
Madhapur, Hyderabad, Telangana - 500081
Mobile: XXXXXXX283

Your Aadhaar Number:
4829 1048 2910

Mera Aadhaar, Meri Pehchan
[QR CODE: Cryptographically signed by UIDAI]`
  },
  {
    id: "doc-8",
    name: "Invoice_March.pdf",
    type: "pdf",
    extension: "PDF",
    size: "98 KB",
    sizeBytes: 100352,
    uploadedAt: "2026-09-02T19:30:00Z",
    modifiedAt: "2026-09-02T19:30:00Z",
    isIndexed: true,
    indexQuality: "96%",
    pages: 1,
    collection: "Finance",
    tags: ["Invoice", "Cloud", "AWS", "March 2025", "Billing"],
    visualType: "invoice",
    summary: "Cloud infrastructure invoice for March 2025 from Amazon Web Services (AWS) for hosting, S3 storage, and compute cluster. Invoice #INV-2025-0382, Total Amount: $142.50 USD, Status: Paid in full.",
    keywords: ["Invoice #INV-2025-0382", "March 15, 2025", "$142.50", "Amazon Web Services", "Paid"],
    detectedEntities: [
      { type: "ID", label: "Invoice Number", value: "INV-2025-0382" },
      { type: "DATE", label: "Invoice Date", value: "March 15, 2025" },
      { type: "ORG", label: "Vendor", value: "Amazon Web Services Inc." },
      { type: "MONEY", label: "Total Amount", value: "$142.50 USD" },
      { type: "STATUS", label: "Payment Status", value: "PAID via Card ending in 4029" }
    ],
    extractedText: `AMAZON WEB SERVICES INC.
PO Box 84023, Seattle, WA 98124-8423

TAX INVOICE
Invoice Number: INV-2025-0382
Invoice Date: March 15, 2025
Billing Period: March 1, 2025 – March 31, 2025
Customer: Arun Kumar | Account ID: 8940-2819-0129

LINE ITEMS:
1. Amazon Elastic Compute Cloud (EC2) - t4g.xlarge instances: $76.20
2. Amazon Simple Storage Service (S3) - Standard Storage & API: $28.30
3. Vector Database Endpoint & VPC Peering: $38.00

Subtotal: $142.50
Tax (0.00%): $0.00
TOTAL AMOUNT DUE: $142.50 USD

STATUS: PAID (Transaction Ref: TXN_AWS_991823, March 16, 2025)`
  },
  {
    id: "doc-9",
    name: "Python_Certificate.pdf",
    type: "pdf",
    extension: "PDF",
    size: "240 KB",
    sizeBytes: 245760,
    uploadedAt: "2026-07-14T15:10:00Z",
    modifiedAt: "2026-07-14T15:10:00Z",
    isIndexed: true,
    indexQuality: "100%",
    pages: 1,
    collection: "Certificates",
    tags: ["Python", "Deep Learning", "Stanford Online", "Credential"],
    visualType: "certificate",
    summary: "Certificate of Completion from Stanford Online & Coursera for 'Advanced Python for Deep Learning & NLP Specialization' completed with Honors grade of 99.4%. Credential ID: PY-STAN-99201.",
    keywords: ["Advanced Python", "Deep Learning", "Stanford Online", "Credential PY-STAN-99201", "Honors 99.4%"],
    detectedEntities: [
      { type: "PERSON", label: "Recipient", value: "Arun Kumar" },
      { type: "ORG", label: "Issuer", value: "Stanford Online / Coursera" },
      { type: "DEGREE", label: "Program", value: "Advanced Python for Deep Learning & NLP Specialization" },
      { type: "ID", label: "Credential ID", value: "PY-STAN-99201" },
      { type: "DATE", label: "Completion Date", value: "July 12, 2025" }
    ],
    extractedText: `STANFORD ONLINE | COURSERA
STATEMENT OF ACCOMPLISHMENT WITH HONORS

Verify at: coursera.org/verify/specialization/PY-STAN-99201
Date: July 12, 2025

This is to certify that
ARUN KUMAR

has successfully completed the 5-course specialization:
ADVANCED PYTHON FOR DEEP LEARNING & NATURAL LANGUAGE PROCESSING

Curriculum covered:
- Pythonic Software Architecture, Typing & Metaclasses
- PyTorch Tensor Math, Autograd & Transformer Implementations
- Vector Embeddings, Sparse/Dense Hybrids & Vector DBs
- Fine-Tuning LLMs with LoRA & Retrieval-Augmented Generation

Final Cumulative Score: 99.4% (Honors Distinction)`
  },
  {
    id: "doc-10",
    name: "Project_Report.pdf",
    type: "pdf",
    extension: "PDF",
    size: "3.2 MB",
    sizeBytes: 3355443,
    uploadedAt: "2026-05-30T17:00:00Z",
    modifiedAt: "2026-05-30T17:00:00Z",
    isIndexed: true,
    indexQuality: "97%",
    pages: 18,
    collection: "Projects",
    tags: ["Capstone", "AI-PIRS", "RAG", "Vector Search"],
    visualType: "report",
    summary: "Engineering Capstone Project Report on 'Autonomous Retrieval-Augmented Generation for Personal Data Storage', presenting benchmark evaluations, OCR pipeline latency, and privacy-preserving embeddings.",
    keywords: ["Capstone", "RAG", "Personal Information Retrieval", "Hybrid Search", "OCR"],
    detectedEntities: [
      { type: "PERSON", label: "Author", value: "Arun Kumar" },
      { type: "DEGREE", label: "Academic Milestone", value: "Final Year B.Tech Project" },
      { type: "ORG", label: "Department", value: "Computer Science & Engineering" },
      { type: "DATE", label: "Submission", value: "May 2025" }
    ],
    extractedText: `DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
FINAL YEAR CAPSTONE PROJECT DISSERTATION

TITLE:
Autonomous Retrieval-Augmented Generation & Personal Document Storage Architecture

Author: Arun Kumar (Roll: 21BCE10482)
Advisors: Dr. V. Murthy & Prof. S. Sen

ABSTRACT
As personal digital footprints expand to include hundreds of certificates, bills, academic transcripts, and legal identity documents, traditional keyword and file-folder taxonomies fail. This dissertation presents an end-to-end framework combining local optical character recognition (OCR), hierarchical semantic chunking, dense vector embeddings, and citation-grounded LLM inference. Experimental evaluations show a 94.8% retrieval precision with zero synthetic hallucinations across 500+ diverse document benchmarks.`
  }
];
