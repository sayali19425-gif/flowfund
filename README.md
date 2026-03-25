# ⬡ FlowFund – Milestone-Based Trustless Funding Platform

![Stellar](https://img.shields.io/badge/Built%20on-Stellar-blue?style=for-the-badge&logo=stellar)
![Soroban](https://img.shields.io/badge/Smart%20Contracts-Soroban-purple?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%2018-cyan?style=for-the-badge&logo=react)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📌 Problem Statement

Many freelancers, developers, and project creators face challenges when receiving funding online due to lack of trust between funders and creators. Funders hesitate to provide money because they are unsure if the project will be completed as promised. At the same time, creators worry about not receiving payment after delivering their work.

Traditional crowdfunding platforms usually release the full payment upfront, which increases the risk of misuse, project abandonment, or incomplete delivery. This lack of transparency and accountability discourages people from supporting innovative ideas and small projects.

---

## 💡 Solution — FlowFund

FlowFund addresses this problem by introducing a **milestone-based funding platform** built on the **Stellar network**:

- Projects are divided into multiple milestones
- Funds are locked in a **Soroban escrow smart contract**
- Payments are released **only when milestones are completed and approved** by the funder
- **Freighter wallet** signs and sends XLM directly to creator on approval
- All projects stored permanently in **Supabase real-time database**

---

## 🔗 Live Demo
**[https://flowfund-dusky.vercel.app](https://flowfund-dusky.vercel.app)**

## 🎥 Demo Video
**[Watch Full Demo](https://drive.google.com/file/d/11_OTQ_EllD_HWb31qgVO8qsTK1r3ouFo/view?usp=sharing)**

---

## 👥 Testnet User Wallet Addresses

### Live User Responses Sheet
👉 **[View Google Sheet — Live User Data](https://docs.google.com/spreadsheets/d/1CgcM3lSJhEdhpaHWm3pluOP7oCRn2xs_d8ilSLIK2sQ/edit?usp=sharing)**

> This sheet updates automatically as new users submit the form.
> Mentor can verify user count and wallet addresses in real time.

### User Registration Form
👉 **[Register as FlowFund User](https://forms.gle/K7hG4CW9JtpPufgK8)**

All transactions verifiable on testnet 

---## 👥 Project Participants

| # | Role    | Email ID                     | Wallet Address                                                                 | Explorer Link |
|---|---------|-----------------------------|---------------------------------------------------------------------------------|--------------|
| 1 | Funder  | sayali19425@gmail.com       | `GCMAVWID35TS7SFMSSYFEGJ2R42KSCUKKYH62H6JHPE3UDLT65DPLIS3`                      | [View ↗](https://stellar.expert/explorer/testnet/account/GCMAVWID35TS7SFMSSYFEGJ2R42KSCUKKYH62H6JHPE3UDLT65DPLIS3) |
| 2 | Creator | rutvikghadge933@gmail.com   | `GD5B3XLT2WRSACEFMQP35MYWRIMGK3HIJVIRFL6A4KOXFSSH5XJYFTVS`                      | [View ↗](https://stellar.expert/explorer/testnet/account/GD5B3XLT2WRSACEFMQP35MYWRIMGK3HIJVIRFL6A4KOXFSSH5XJYFTVS) |
| 3 | Creator | sanikanaikare19@gmail.com   | `GDGFJBGBADBOM6Z3BNGENHEBRIX2E6XUXVCCZ2OKH6GOFUE2USZUQNDU`                      | [View ↗](https://stellar.expert/explorer/testnet/account/GDGFJBGBADBOM6Z3BNGENHEBRIX2E6XUXVCCZ2OKH6GOFUE2USZUQNDU) |
| 4 | Creator | maubunny0524@gmail.com      | `GCTQ2N6VIM3DYHMMHU2TGLIOSWWD7PXNNONSGDPUA4M7ZYZ6ZURATV3X`                      | [View ↗](https://stellar.expert/explorer/testnet/account/GCTQ2N6VIM3DYHMMHU2TGLIOSWWD7PXNNONSGDPUA4M7ZYZ6ZURATV3X) |
| 5 | Creator | kobalpriya1@gmail.com       | `GB7OO2BO2HEE4R2IQINIECMVEXRUISKX3TNN2LHY4BIW3WS7GNETKI2R`                      | [View ↗](https://stellar.expert/explorer/testnet/account/GB7OO2BO2HEE4R2IQINIECMVEXRUISKX3TNN2LHY4BIW3WS7GNETKI2R) |
| 6 | Creator | radhamane01933@gmail.com    | `GC5YOINWNQMJUPYS5NJHNXI262WVPLMI5CNE6KBZCA67DWHF77WF7NML`                      | [View ↗](https://stellar.expert/explorer/testnet/account/GC5YOINWNQMJUPYS5NJHNXI262WVPLMI5CNE6KBZCA67DWHF77WF7NML) |
| 7 | Creator | sayalin2006@gmail.com       | `GDZ46AZQNIYM2LZCO2P2JY4E6EQTUI6O52LGFLPWVN4QXIXJMRRO7HVZ`                      | [View ↗](https://stellar.expert/explorer/testnet/account/GDZ46AZQNIYM2LZCO2P2JY4E6EQTUI6O52LGFLPWVN4QXIXJMRRO7HVZ) |

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Trustless Escrow | Funds locked in Soroban smart contracts |
| 👥 Role-Based Access | Separate Creator and Funder dashboards |
| 📸 Proof Submission | Creators upload photo proof per milestone |
| ✅ Milestone Approval | Funders review and approve with one click |
| 💸 Real XLM Transfer | Freighter wallet signs and sends XLM on approval |
| 📊 Progress Tracking | Visual progress bar for each project |
| 🏆 Project History | Permanent record of all funded projects |
| 🔄 Real-time Updates | Supabase database syncs across all users |
| 🔗 Project URLs | Creators add live demo or GitHub links |
| 💾 Persistent Storage | Projects saved permanently in Supabase |

---

## 🏗️ Architecture
```
flowfund/
│
├── contract/                    # Soroban Smart Contract (Rust)
│   ├── src/
│   │   └── lib.rs               # Escrow logic
│   └── Cargo.toml
│
└── frontend/                    # React + Vite Frontend
    ├── src/
    │   ├── App.jsx              # Main app with routing & Supabase
    │   ├── supabase.js          # Supabase client config
    │   ├── index.css            # Emerald theme design system
    │   ├── main.jsx             # Entry point
    │   ├── pages/
    │   │   ├── Home.jsx         # Landing + wallet connect + role select
    │   │   ├── Creator.jsx      # Creator dashboard
    │   │   ├── Funder.jsx       # Funder dashboard + XLM transfer
    │   │   └── History.jsx      # All projects history
    │   ├── components/
    │   │   ├── Navbar.jsx       # Navigation with role badge
    │   │   ├── WalletButton.jsx # Freighter wallet connection
    │   │   └── MilestoneCard.jsx# Reusable milestone component
    │   └── stellar/
    │       └── contract.js      # Stellar SDK contract calls
    └── index.html
```

---

## 🔄 System Architecture
```
Creator                    Supabase DB              Funder
   │                           │                      │
   │── Create Project ────────▶│                      │
   │                           │◀── Load Projects ────│
   │── Submit Milestone ──────▶│                      │
   │                           │◀── Review Project ───│
   │                           │                      │
   │◀── XLM Received ──────────────── Freighter ─────│
   │                           │◀── Approve + Update ─│
   │                           │                      │
   │── View in History ────────▶│                     │
```

---

## 🔄 User Flow

### Creator Flow
```
Connect Wallet → Select Creator Role → Fill Project Details
→ Add Description + URL + Milestones → Create Project
→ Upload Photo Proof per Milestone → Submit for Review
→ Receive XLM when Funder Approves
```

### Funder Flow
```
Connect Wallet → Select Funder Role → View All Projects
→ Click Project → Review Milestone Proofs
→ Click Approve & Release → Confirm in Freighter Popup
→ XLM Sent to Creator Automatically
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Blockchain | Stellar Testnet |
| Smart Contracts | Soroban (Rust) |
| Frontend | React 18 + Vite |
| Database | Supabase (PostgreSQL) |
| Wallet | Freighter v5 |
| Stellar SDK | @stellar/stellar-sdk |
| Freighter API | @stellar/freighter-api |
| Styling | CSS-in-JS (Emerald Theme) |
| Fonts | Syne + DM Mono |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Rust + Cargo
- Soroban CLI
- Freighter browser extension
- Git

### Frontend Setup
```bash
# Clone repository
git clone https://github.com/sayali19425-gif/flowfund.git
cd flowfund/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
http://localhost:5173
```

### Smart Contract Setup
```bash
# Install Soroban CLI
cargo install --locked soroban-cli

# Add testnet network
soroban network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate and fund keypair
soroban keys generate mykey --network testnet
soroban keys fund mykey --network testnet

# Build contract
cd contract
cargo build --target wasm32-unknown-unknown --release

# Deploy contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/flowfund.wasm \
  --source mykey \
  --network testnet
```

Contract ID : CADDNP7CPQF737YKYXUJBLESA2DLZDBJVUON4FRB7GJTRHV3LILLIHO5
Network     : Stellar Testnet
Explorer    : https://stellar.expert/explorer/testnet/contract/CADDNP7CPQF737YKYXUJBLESA2DLZDBJVUON4FRB7GJTRHV3LILLIHO5

---

## 📋 User Feedback Documentation

### Testing Round 1

**Test Date:** March 2026
**Participants:** 5+ testnet users
**Platform:** Stellar Testnet via Vercel deployment

#### Feedback Collected

| # | User | Role | Feedback | Priority |
|---|---|---|---|---|
| 1 | User 1 | Creator | Unclear which milestone gets funded next | High |
| 2 | User 2 | Funder | No confirmation when fund is released | High |
| 3 | User 3 | Creator | Cannot see photo proof before submitting | Medium |
| 4 | User 4 | Funder | Wallet address too long in navbar | Low |
| 5 | User 5 | Creator | Need to see history of all projects | High |

#### Iteration 1 — Changes Made After Feedback

| Feedback | Action Taken | Status |
|---|---|---|
| Unclear milestone order | Added numbered progress bar with % completion | ✅ Done |
| No fund confirmation | Added Freighter popup + confirmation modal | ✅ Done |
| Cannot preview proof | Photo preview added in MilestoneCard | ✅ Done |
| Wallet address too long | Truncated to 6+4 chars in navbar | ✅ Done |
| Need project history | Added permanent History page showing all projects | ✅ Done |
| Projects not shared | Added Supabase real-time database | ✅ Done |
| Duplicate projects | Added duplicate prevention in Supabase | ✅ Done |

---

## 📊 MVP Validation Results

| Metric | Target | Achieved |
|---|---|---|
| Testnet Users | 5+ | 5+ ✅ |
| Projects Created | 3+ | 5+ ✅ |
| Milestones Approved | 5+ | 10+ ✅ |
| XLM Transactions | 5+ | 10+ ✅ |
| Feedback Items | 5+ | 7 ✅ |
| Iterations Completed | 1+ | 1 ✅ |

---

## ✅ Submission Checklist

- [x] Public GitHub repository
- [x] README with complete documentation
- [x] Architecture document included
- [x] Minimum 10+ meaningful commits
- [x] Live demo link (Vercel)
- [x] Demo video link
- [x] List of 5+ user wallet addresses
- [x] User feedback documentation
- [x] Smart contract deployed on testnet
- [x] MVP fully functional
- [x] Role-based access (Creator / Funder)
- [x] Real XLM transfers via Freighter
- [x] Milestone proof submission with photos
- [x] Real-time database (Supabase)
- [x] Persistent project history

---

## 🔗 Important Links

| Resource | Link |
|---|---|
| Live Demo | https://flowfund-dusky.vercel.app |
| GitHub | https://github.com/sayali19425-gif/flowfund |
| Demo Video | https://your-video-link.com |
| Contract Explorer | https://stellar.expert/explorer/testnet/contract/CADDNP7CPQF737YKYXUJBLESA2DLZDBJVUON4FRB7GJTRHV3LILLIHO5 |
| Stellar Testnet | https://horizon-testnet.stellar.org |
| Freighter Wallet | https://freighter.app |
| Supabase Dashboard | https://supabase.com |

---

## 🔧 Smart Contract Functions
```rust
// Create new escrow project
create_project(creator, funder, milestone_labels, total_xlm) -> u64

// Creator submits proof for milestone
submit_milestone(project_id, milestone_idx, proof_hash)

// Funder approves — XLM auto released
approve_milestone(project_id, milestone_idx)

// Funder rejects — creator resubmits
reject_milestone(project_id, milestone_idx)

// Read project state
get_project(project_id) -> Project

// Get total count
get_count() -> u64
```

---

## 📄 License

MIT License — free to use and modify.

---

## 🙏 Built With

- [Stellar Development Foundation](https://stellar.org)
- [Soroban Smart Contracts](https://soroban.stellar.org)
- [Freighter Wallet](https://freighter.app)
- [Supabase](https://supabase.com)
- [Vercel](https://vercel.com)
