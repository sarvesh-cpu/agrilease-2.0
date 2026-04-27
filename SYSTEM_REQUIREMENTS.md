# AgriLease — System Requirements Specification (SRS)

> **Project:** AgriLease — Agricultural Land Leasing Platform  
> **Team:** Vidhi, Harshita, Vedant, Sarvesh  
> **Contact:** sarveshkasar1210@gmail.com  
> **Version:** 1.0.0  
> **Last Updated:** April 2026

---

## 1. Introduction

### 1.1 Purpose
AgriLease is a digital platform that connects **landowners** with **lessees (farmers)** to facilitate secure, verified, and transparent agricultural land leasing. The system digitizes the entire leasing workflow — from land listing and verification to digital agreements and escrow-secured payments.

### 1.2 Scope
The platform covers:
- User registration and role-based access (Landowner, Lessee, Admin)
- Land listing with 7/12 document OCR extraction
- Land discovery and search/filter
- Digital lease agreement generation
- Escrow-based payment management
- AI-powered chatbot assistant
- Admin dashboard for transaction oversight

### 1.3 Target Users
| Role | Description |
|------|-------------|
| **Landowner** | Owns agricultural land and wants to lease it out |
| **Lessee (Farmer)** | Wants to find and lease agricultural land for farming |
| **Admin** | Platform administrator managing verifications and transactions |

---

## 2. Functional Requirements

### 2.1 User Authentication & Authorization
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Users can register with Full Name, Phone, Password, and Role selection | High |
| FR-02 | Users can log in with Phone and Password | High |
| FR-03 | Role-based access control (Landowner / Lessee / Admin) | High |
| FR-04 | User session persistence via localStorage | Medium |

### 2.2 Identity Verification (KYC)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-05 | Users must upload Aadhaar / PAN documents for identity verification | High |
| FR-06 | Verification status is displayed on the Dashboard (Verified / Pending) | High |
| FR-07 | Only verified users can list lands on the platform | High |

### 2.3 Land Listing & Management
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-08 | Landowners can upload 7/12 extract documents | High |
| FR-09 | OCR-based extraction of land details (Survey Number, Area, Location) | High |
| FR-10 | Landowners can verify/edit extracted details before submission | Medium |
| FR-11 | Landowners can set pricing per acre and lease duration | High |
| FR-12 | Land listings have status tracking: Pending → Approved / Rejected | High |
| FR-13 | Multi-step form wizard for land listing (Upload → Verify → Price) | Medium |

### 2.4 Land Discovery & Search
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-14 | Lessees can browse all verified/approved lands | High |
| FR-15 | Search lands by location | High |
| FR-16 | Filter lands by maximum price per acre | High |
| FR-17 | Each land card displays: Type, Area, Price, Location, Duration, Image | High |
| FR-18 | Wishlist/Favorite functionality on land cards | Low |

### 2.5 Digital Lease Agreements
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-19 | Clicking "Request Lease" opens a digital agreement modal | High |
| FR-20 | Agreement displays: Parties, Land Details, Financial Terms | High |
| FR-21 | Legal self-declaration checkbox before signing | High |
| FR-22 | Token amount (10% of price) is calculated and displayed | Medium |
| FR-23 | Digital signature simulation (Fingerprint icon acknowledgment) | Medium |

### 2.6 Escrow Payment System
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-24 | Token payments are held in escrow until lease finalization | High |
| FR-25 | Admin can release escrow funds to the landowner | High |
| FR-26 | Transaction records track: Amount, Type, Status, Parties | High |
| FR-27 | Dashboard shows total held in escrow and total released | Medium |

### 2.7 AI Chatbot Assistant
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-28 | Floating chatbot widget accessible on all pages | High |
| FR-29 | Text-based queries about land listing, leasing, pricing, crops | High |
| FR-30 | Image upload for soil/land analysis (Vision-based mock) | Medium |
| FR-31 | Contextual responses based on keywords | Medium |
| FR-32 | Image preview before sending | Low |

### 2.8 Admin Panel
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-33 | View all platform transactions | High |
| FR-34 | Release escrow funds per transaction | High |
| FR-35 | Overview of total escrow held and released amounts | Medium |

---

## 3. Non-Functional Requirements

### 3.1 Performance
| ID | Requirement |
|----|-------------|
| NFR-01 | Pages must load within 3 seconds on standard broadband |
| NFR-02 | Animations must run at 60fps (using Framer Motion) |
| NFR-03 | AI chatbot responses must return within 2 seconds |

### 3.2 Usability
| ID | Requirement |
|----|-------------|
| NFR-04 | Responsive design across desktop and tablet viewports |
| NFR-05 | Intuitive multi-step forms with progress indicators |
| NFR-06 | Consistent design language across all pages (Outfit font, olive/beige theme) |
| NFR-07 | Preloader animation during initial app load |

### 3.3 Security
| ID | Requirement |
|----|-------------|
| NFR-08 | CORS enabled on the backend API |
| NFR-09 | User data stored in SQLite with parameterized queries |
| NFR-10 | Image uploads limited to 5MB maximum |
| NFR-11 | Legal self-declarations required before agreement signing |

### 3.4 Reliability
| ID | Requirement |
|----|-------------|
| NFR-12 | Graceful error handling for API failures (fallback messages in chat) |
| NFR-13 | Database auto-creates tables on first run |
| NFR-14 | Seeding script available for demo data |

---

## 4. Technology Stack

### 4.1 Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI library |
| Vite | 8.x | Build tool & dev server |
| React Router DOM | 7.x | Client-side routing |
| Framer Motion | 12.x | Animations & transitions |
| Lucide React | 0.577.x | Icon library |
| Axios | 1.x | HTTP client |

### 4.2 Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express | 5.x | Web framework |
| SQLite3 | 6.x | Database |
| CORS | 2.x | Cross-origin resource sharing |
| Multer | 2.x | File upload handling |
| Dotenv | 17.x | Environment variables |

### 4.3 AI / ML (Planned)
| Technology | Version | Purpose |
|------------|---------|---------|
| Genkit AI Core | 1.x | AI framework (planned integration) |
| Genkit Google AI | 1.x | Google AI plugin (planned integration) |

### 4.4 Deployment
| Technology | Purpose |
|------------|---------|
| Netlify | Frontend hosting |

---

## 5. Hardware Requirements

### 5.1 Development Environment
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Processor** | Intel i3 / AMD Ryzen 3 | Intel i5 / AMD Ryzen 5 or higher |
| **RAM** | 4 GB | 8 GB or more |
| **Storage** | 500 MB free disk space | 1 GB+ free disk space |
| **OS** | Windows 10 / macOS 12 / Ubuntu 20.04 | Latest stable version |
| **Network** | Broadband internet | Stable broadband (for npm packages & Unsplash images) |

### 5.2 Production Server
| Component | Minimum |
|-----------|---------|
| **Processor** | 1 vCPU |
| **RAM** | 512 MB |
| **Storage** | 1 GB (SQLite DB + static assets) |
| **Network** | Stable internet with HTTPS |

---

## 6. Software Requirements

### 6.1 Prerequisites
| Software | Version | Required For |
|----------|---------|-------------|
| **Node.js** | ≥ 18.0.0 | Backend runtime & frontend build |
| **npm** | ≥ 9.0.0 | Package management |
| **Git** | ≥ 2.30 | Version control |
| **Web Browser** | Chrome 100+ / Firefox 100+ / Edge 100+ | Testing & usage |

### 6.2 Optional Tools
| Software | Purpose |
|----------|---------|
| VS Code | Recommended code editor |
| Nodemon | Auto-restart backend on file changes (dev dependency) |
| Postman | API testing |

---

## 7. Database Schema

### 7.1 Entity-Relationship Overview

```
┌──────────┐    ┌──────────────┐    ┌─────────────┐
│  Users   │───<│    Lands     │───<│   Lease     │
│          │    │              │    │  Requests   │
└──────────┘    └──────────────┘    └──────┬──────┘
                                          │
                                   ┌──────┴──────┐
                                   │ Agreements  │
                                   └──────┬──────┘
                                          │
                                   ┌──────┴──────┐
                                   │  Payments   │
                                   └─────────────┘
```

### 7.2 Tables

| Table | Key Columns | Description |
|-------|------------|-------------|
| **users** | id, fullName, phone, role, isVerified | User accounts & KYC status |
| **lands** | id, ownerId, surveyNumber, area, location, pricePerAcre, status | Land listings |
| **lease_requests** | id, landId, lesseeId, ownerId, status | Lease request tracking |
| **agreements** | id, requestId, signedByOwner, signedByLessee | Digital agreements |
| **payments** | id, agreementId, amount, type, status | Escrow payment records |

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check — returns "AgriLease API is running" |
| `POST` | `/api/ai/chat` | AI chatbot — accepts `{ message, image }`, returns `{ reply }` |

> **Note:** Additional CRUD endpoints for users, lands, lease requests, agreements, and payments are planned for future iterations.

---

## 9. Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd agrilease

# --- Backend Setup ---
cd backend
npm install
npm run seed    # Populate sample data
npm start       # Starts on http://localhost:5000

# --- Frontend Setup ---
cd ../frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

---

## 10. Project Structure

```
agrilease/
├── backend/
│   ├── server.js          # Express server entry point
│   ├── db.js              # SQLite database connection & schema
│   ├── ai.js              # AI chatbot route handler
│   ├── seed.js            # Database seeding script
│   ├── package.json       # Backend dependencies
│   └── database.sqlite    # SQLite database file
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx       # React entry point
│   │   ├── App.jsx        # Root component with routing & layout
│   │   ├── index.css      # Global styles & design tokens
│   │   ├── forms.css      # Form element styles
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Landing page with hero & features
│   │   │   ├── Discovery.jsx  # Land browsing & search
│   │   │   ├── Dashboard.jsx  # User dashboard & admin panel
│   │   │   ├── Login.jsx      # Login page
│   │   │   └── Signup.jsx     # Registration page
│   │   └── components/
│   │       ├── AIAssistant.jsx    # Floating AI chatbot
│   │       ├── AgreementModal.jsx # Digital lease agreement
│   │       ├── AdminDashboard.jsx # Admin transaction panel
│   │       ├── LandListings.jsx   # Land management component
│   │       └── Preloader.jsx      # Loading animation
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
│
└── .gitignore
```

---

## 11. Future Enhancements

| Feature | Description |
|---------|-------------|
| **Real OCR Integration** | Replace mock OCR with Tesseract.js or Google Vision API |
| **Genkit AI Integration** | Connect to Gemini models for intelligent crop/soil recommendations |
| **Payment Gateway** | Integrate Razorpay/Stripe for real escrow payments |
| **Map Integration** | Google Maps for land location visualization |
| **Push Notifications** | Lease request updates and payment confirmations |
| **Mobile App** | React Native version for field use |
| **Multi-language Support** | Hindi, Marathi localization for rural users |

---

*© 2026 AgriLease. All rights reserved.*
