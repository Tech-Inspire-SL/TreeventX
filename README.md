# TreeventX 🌳✨

<p align="center">
  <img src="src/app/TreeventX_Logo.png" alt="TreeventX Logo" width="200"/>
</p>

<p align="center">
  <strong>Smart Event Management & Mobile Ticketing for Africa</strong><br/>
  Secure, transparent, and mobile-money-powered event solutions built for Sierra Leone.
</p>

<p align="center">
  <a href="https://vercel.com">
    <img src="https://img.shields.io/badge/Deployed%20on-Vercel-black" alt="Vercel Badge"/>
  </a>
  <img src="https://img.shields.io/badge/Next.js-15-black" alt="Next.js Badge"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-blue" alt="Tailwind Badge"/>
  <img src="https://img.shields.io/badge/Supabase-Backend-green" alt="Supabase Badge"/>
  <img src="https://img.shields.io/badge/MoniMe-Payment-orange" alt="MoniMe Badge"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License"/>
</p>

---

## 🏆 D3: Moonlanding Challenge Submission

**Category:** Open Innovation  
**By:** Tech Inspire SL  

**Team:**
- **Sonia Goba** – Data & Analytics
- **Mohamed Super Dumbuya** – Lead Developer & Project Lead
- **Ahmed I. Sankoh** – Backend & Infrastructure Support
- **Zainab M. Kamara** – UX / Testing & Quality Assurance

---

## 📖 Overview

**TreeventX** is a comprehensive event management and mobile ticketing platform designed to solve the chaos of manual event operations in Sierra Leone. From fake tickets and revenue loss to lack of real-time attendance tracking, TreeventX brings **security, transparency, and efficiency** to the event industry.

Built with **Next.js, Supabase, and Monime mobile money integration**, TreeventX empowers schools, churches, NGOs, concert promoters, and businesses to digitize their event operations — saving time, preventing fraud, and building trust through data-driven insights.

---

## ❓ The Problem It Solves

Event organizers across Sierra Leone face critical challenges:

- **🎫 Fake Tickets & Fraud** → Manual ticketing opens doors to duplicate entries and revenue loss
- **💰 Cash Handling Chaos** → No transparency in money collection; reconciliation takes days
- **📊 No Real-Time Tracking** → Organizers never know who's actually inside their event
- **🌍 Global Platforms Ignore Africa** → No support for Orange Money, Afrimoney, or local payment systems
- **💸 Expensive QR Tools** → Existing solutions are too costly or don't exist locally

**TreeventX solves all of this** — with fraud-proof digital ticketing, instant mobile money payments, real-time attendance logs, and transparent financial reporting.

---

## ✨ Key Features

### 🎟️ **Fraud-Proof QR Ticketing**
Every ticket gets a unique, server-verified QR code — impossible to duplicate or fake.

### 💳 **Mobile Money Integration**
Seamless payments via **MoniMe, Orange Money, and Afrimoney** — built for Africa's mobile-first economy.

### 📱 **Real-Time Attendance Tracking**
QR scanning agents verify entry instantly. Live dashboards show who's inside, when they arrived, and total attendance.

### 🎛️ **Role-Based Dashboards**
- **Admin** → Create events, assign scanner agents, view analytics
- **Scanner Agent** → Check-in/check-out attendees via QR scanning
- **Attendee** → View tickets, event details, and attendance history

### 📈 **Instant Financial Reporting**
Transparent revenue dashboards updated in real time. No more waiting days to reconcile money.

### 🌐 **Cloud-Powered & Scalable**
Built on **Next.js + Supabase**, TreeventX handles events of any size with speed and reliability.

### 🔒 **Security & Transparency**
All transactions logged. All scans verified. All payments reconciled. Zero room for fraud.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router) |
| **UI/Styling** | [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/) |
| **Backend & Database** | [Supabase](https://supabase.io/) (PostgreSQL + Auth) |
| **Payments** | MoniMe Mobile Money API |
| **QR Generation** | qrcode.react |
| **Deployment** | [Vercel](https://vercel.com) |
| **Version Control** | GitHub |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm or yarn
- A [Supabase](https://supabase.io/) account
- MoniMe API credentials (for payment integration)

### Local Setup

1. **Clone the repository:**
```bash
   git clone https://github.com/TechInspireSL/TreeventX.git
   cd TreeventX
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   MONIME_API_KEY=your_monime_api_key
   MONIME_SECRET_KEY=your_monime_secret
```

4. **Run database migrations:**
```bash
   # Use Supabase CLI or run SQL migrations in Supabase dashboard
```

5. **Start the development server:**
```bash
   npm run dev
```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

---

## 📂 Project Structure
```
TreeventX/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── (auth)/         # Authentication pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── scanner/        # Scanner agent interface
│   │   ├── attendee/       # Attendee dashboard
│   │   └── api/            # API routes
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utilities & helpers
│   │   ├── supabase.ts    # Supabase client
│   │   └── monime.ts      # Payment integration
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
└── supabase/              # Database migrations & schemas
```

---

## 🎯 Use Cases

TreeventX is perfect for:

- 🎓 **Universities & Schools** → Graduations, orientations, campus events
- ⛪ **Churches & Religious Organizations** → Conferences, programs, fundraisers
- 🎤 **Concert Promoters** → Music festivals, shows, entertainment events
- 🏢 **Corporate Events** → Conferences, training sessions, team building
- 🎉 **Community Events** → Festivals, sports tournaments, public gatherings
- 🎨 **NGOs & Non-Profits** → Workshops, charity events, community outreach

---

## 💼 Revenue Model

TreeventX operates on a sustainable, scalable business model:

1. **Per-Event Fees** → Le 50,000 - Le 500,000 per event (tiered by size)
2. **Subscriptions** → Le 200,000 - Le 1,000,000+ monthly for institutions
3. **Transaction Fees** → 1.5% - 3% commission on ticket sales
4. **Premium Add-Ons** → Analytics packages, white-labeling, certificate generation
5. **Future Streams** → Vendor marketplace, B2B insights

---

## 🌍 Why TreeventX Matters

### Built for Africa
Unlike foreign platforms, TreeventX understands local payment systems, affordability constraints, and the need for offline-capable solutions.

### Security First
Fraud-proof QR verification protects both organizers and attendees.

### Transparency
Real-time financial reporting builds trust between organizers, sponsors, and stakeholders.

### Empowerment
Digital tools that make professional event management accessible to everyone — from small community groups to large institutions.

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Current)
- Event creation & management
- QR ticketing system
- Mobile money integration
- Basic dashboards
- Role-based access

### Phase 2: Expansion (Q1 2026)
- Advanced analytics dashboard
- Event discovery marketplace
- SMS ticket delivery
- Bulk attendee import
- Multi-event organizer accounts

### Phase 3: Scale (Q2-Q3 2026)
- Offline-capable scanner mode
- AI-powered attendance prediction
- Vendor marketplace
- White-labeling for enterprises
- Regional expansion across West Africa

---

## 🤝 Contributing

We welcome contributions! If you'd like to help improve TreeventX:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

**Tech Inspire SL**  
🌐 Website: [techinspiresl.com](https://techinspiresl.com)  
📧 Email: dumbuya366@gmail.com  
📱 WhatsApp: +232 90 471 725

**D3: Moonlanding Challenge**  
📧 d3@knesst.com  
🌐 [knesst.com/moonlanding](https://knesst.com/moonlanding)

---

## 🙏 Acknowledgments

- **UNICEF & KNESST** for the D3: Moonlanding Challenge opportunity
- **Tech Inspire SL** for organizational support
- The Sierra Leone tech community for feedback and encouragement
- All event organizers who shared their challenges and helped shape TreeventX

---

<p align="center">
  <strong>TreeventX — Growing connections, securing events, transforming Africa's event industry.</strong><br/>
  Made with ❤️ in Sierra Leone 🇸🇱
</p>

<p align="center">
  <a href="#-getting-started">Get Started</a> •
  <a href="#-use-cases">Use Cases</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-contact--support">Contact</a>
</p>

---

**⭐ If you find TreeventX useful, please star this repository!**