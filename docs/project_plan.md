# Mobile Phone Store E-Commerce — Academic Project Plan

## 1. Project Title & Overview
- **Project Title**: Mobile Phone Store Online Business E-Commerce System
- **Authors**: Senior Full-Stack Engineering Capstone Project
- **Target Audience**: Smartphone consumers seeking technical clarity & Store administrators managing inventory
- **Stack**: React (Frontend) + Express.js (Node.js REST API) + PostgreSQL (Database)

---

## 2. Problem Statement & Solution
### Problem Statement
Purchasing modern smartphones online frequently suffers from:
1. Incomplete or unstructured technical specifications.
2. Fragmented variant management (confusing storage/color options with separate listings).
3. Inability to compare 2–4 models side-by-side on exact technical metrics (screen type, chipset, battery, cameras).
4. Lack of real-time inventory tracking leading to checkout discrepancies.

### Proposed Solution
A purpose-built mobile phone e-commerce platform that implements:
- Normalized phone variant architecture (one base model holding multiple color/storage SKU combinations).
- An interactive phone comparison engine highlighting hardware differences.
- Fully transactional PostgreSQL checkout guaranteeing atomicity of inventory deductions.
- An intuitive Admin Management Dashboard with revenue metrics, inventory warnings, and order workflow state machine.

---

## 3. Work Breakdown Structure (WBS) & Milestones

### Week 8 Midterm Requirements Checklist
| Requirement | Status | Verification Artifact |
| :--- | :--- | :--- |
| **1. Project Plan** | Completed | `docs/project_plan.md` |
| **2. Frontend UI** | In Progress | Responsive customer catalog, detail, cart & admin layout |
| **3. Backend UI / Code Test** | Completed | Layered Express REST API + automated test suite |
| **4. Database Diagram** | Completed | `docs/database_diagram.md` + `backend/database/schema.sql` |
| **5. Git/GitHub Deployment** | Ready | Git initialized, clean `.gitignore`, clear commit logs |

### Week 14 Final Requirements Roadmap
| Phase | Focus Areas | Deliverable |
| :--- | :--- | :--- |
| **Phase 4** | Complete customer flow | Checkout, wishlist, customer review ratings, live tracking |
| **Phase 5** | Complete admin capabilities | Variant creator, low stock alert notifications, customer management |
| **Phase 6** | System hardening & testing | Integration testing, error boundary, edge cases |
| **Phase 7** | Project Book / Academic Report | 5-chapter formal documentation (Analysis, Design, Implementation, Testing, Conclusion) |
| **Phase 8** | Presentation Defense | Slides deck (Architecture, Demo, Technical Highlights) |

---

## 4. Academic Evaluation Criteria & Best Practices
1. **Separation of Concerns**: Client UI contains zero direct SQL; Backend validates all untrusted inputs; Database enforces relational integrity through constraints.
2. **Security Baseline**: Passwords hashed with bcrypt (cost factor 10); Stateless JWT authorization; Parameterized queries preventing SQL injection; Role-based access control (RBAC).
3. **Responsive UI/UX**: Mobile-first fluid grid, CSS variables design system, accessible contrast ratios, and interactive states.
