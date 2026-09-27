# Resume-Worthy App Ideas

A curated list of portfolio projects, grouped by difficulty. Each idea lists a
suggested stack, the skills it shows, and a sample resume bullet you can adapt
once you've built it (swap in your real numbers).

> **Tip:** Recruiters value 2–3 *finished, deployed* projects with a live demo,
> a clean README, and tests far more than 10 half-done ones. Pick ideas that
> match the jobs you're applying for.

---

## Beginner (1–2 weeks each)

### 1. Personal Finance Tracker
- **Stack:** React + TypeScript, Chart.js, localStorage or Firebase
- **Shows:** CRUD, state management, data visualization
- **Features:** add income/expenses, categories, monthly charts, CSV export
- **Resume bullet:** *Built a budgeting web app in React/TypeScript with category
  analytics and CSV export, used to track 500+ transactions.*

### 2. Weather Dashboard
- **Stack:** JavaScript/React, OpenWeather API, Tailwind CSS
- **Shows:** consuming REST APIs, async handling, responsive UI
- **Features:** city search, 7-day forecast, geolocation, saved cities
- **Resume bullet:** *Developed a responsive weather dashboard integrating a
  third-party REST API with caching to cut API calls by 60%.*

### 3. Habit Tracker
- **Stack:** React Native (Expo) or Flutter
- **Shows:** mobile development, local storage, notifications
- **Features:** daily check-ins, streaks, reminders, progress calendar
- **Resume bullet:** *Shipped a cross-platform habit-tracking mobile app with push
  reminders and streak analytics.*

### 4. Recipe Finder
- **Stack:** Vue or React, Spoonacular / TheMealDB API
- **Shows:** search, filtering, routing, favorites
- **Features:** search by ingredients, dietary filters, save favorites

---

## Intermediate (2–4 weeks each)

### 5. Job Application Tracker *(great for job seekers!)*
- **Stack:** Next.js, PostgreSQL + Prisma, NextAuth
- **Shows:** full-stack, authentication, relational data modeling
- **Features:** Kanban board (Applied → Interview → Offer), notes, reminders,
  stats on response rates
- **Resume bullet:** *Built a full-stack job tracker (Next.js, PostgreSQL) with
  OAuth login, drag-and-drop Kanban board, and application analytics.*

### 6. Real-Time Chat App
- **Stack:** Node.js, Express, Socket.IO, MongoDB, React
- **Shows:** WebSockets, real-time systems, auth
- **Features:** rooms, direct messages, typing indicators, read receipts,
  image uploads
- **Resume bullet:** *Engineered a real-time chat platform using WebSockets
  supporting 100+ concurrent users with message persistence.*

### 7. URL Shortener with Analytics
- **Stack:** Go or Node.js, Redis, PostgreSQL, Docker
- **Shows:** backend design, caching, system design fundamentals
- **Features:** custom aliases, click tracking, QR codes, rate limiting
- **Resume bullet:** *Designed a URL-shortening service with Redis caching,
  rate limiting, and click analytics, containerized with Docker.*

### 8. E-Commerce Store
- **Stack:** MERN (MongoDB, Express, React, Node) + Stripe
- **Shows:** payments, cart logic, admin panel, security
- **Features:** product catalog, cart, checkout, order history, admin dashboard
- **Resume bullet:** *Built an e-commerce site with Stripe payments, JWT auth,
  and an admin dashboard for inventory management.*

### 9. Study Group / Event Scheduler
- **Stack:** Django + React, PostgreSQL
- **Shows:** scheduling logic, email notifications, REST APIs
- **Features:** create groups, find common availability, calendar invites

### 10. Fitness / Workout Logger
- **Stack:** Flutter or Swift/Kotlin, Firebase
- **Shows:** native mobile, charts, cloud sync
- **Features:** log workouts, progress charts, personal records, rest timer

---

## Advanced (1–2 months each)

### 11. AI-Powered Resume Analyzer
- **Stack:** Python (FastAPI), an LLM API, React, PDF parsing
- **Shows:** AI integration, NLP, file processing
- **Features:** upload resume + job description → match score, missing
  keywords, rewrite suggestions
- **Resume bullet:** *Created an AI resume analyzer (FastAPI + LLM API) that
  scores resumes against job descriptions and suggests keyword improvements.*

### 12. Collaborative Whiteboard / Doc Editor
- **Stack:** React, WebSockets or CRDTs (Yjs), Node.js
- **Shows:** real-time collaboration, conflict resolution, complex frontend
- **Features:** multi-user drawing/editing, cursors, version history

### 13. Stock / Crypto Portfolio Tracker
- **Stack:** Python or Node.js, financial API, React, PostgreSQL
- **Shows:** data pipelines, scheduled jobs, charts
- **Features:** live prices, portfolio P&L, alerts, historical charts

### 14. Food Delivery / Ride-Share Clone
- **Stack:** React Native, Node.js, Google Maps API, PostgreSQL
- **Shows:** maps, geolocation, multi-role apps (customer/driver/admin)
- **Features:** order tracking on a map, driver assignment, ratings

### 15. Video Streaming Platform (mini YouTube)
- **Stack:** Node.js, AWS S3, FFmpeg, React
- **Shows:** cloud storage, media processing, scalability
- **Features:** upload, transcoding, streaming, comments, likes

### 16. DevOps Monitoring Dashboard
- **Stack:** Go/Python, Prometheus, Grafana, Docker, Kubernetes
- **Shows:** infrastructure, observability, CI/CD
- **Features:** service health checks, uptime alerts, metrics dashboards

---

## Really Useful Apps (solve real problems people have)

These stand out because they have real users. An app that people actually use
is the strongest thing you can put on a resume.

### 17. Subscription & Bill Reminder
- **Problem:** people forget free trials and pay for unused subscriptions
- **Stack:** React Native or Next.js, PostgreSQL, email/push notifications
- **Features:** add subscriptions, renewal reminders before charges, monthly
  cost total, "cancel this?" suggestions for unused ones
- **Resume bullet:** *Built a subscription tracker that sends renewal alerts
  before charges, helping users spot and cancel unused services.*

### 18. Receipt Scanner & Expense Splitter
- **Problem:** splitting bills with roommates or friends is a hassle
- **Stack:** Flutter or React Native, OCR (Google ML Kit / Tesseract), Firebase
- **Features:** snap a receipt → items extracted automatically, assign items
  to people, who-owes-who balances, settle-up reminders
- **Resume bullet:** *Developed a mobile app using OCR to scan receipts and
  split costs between groups, with automatic balance tracking.*

### 19. Medication & Health Reminder
- **Problem:** people (especially elderly relatives) miss medications
- **Stack:** React Native / Flutter, local notifications, SQLite
- **Features:** dose schedules, refill alerts, "taken" log, caregiver can see
  if a dose was missed, large-text accessible mode
- **Resume bullet:** *Built an accessible medication reminder app with refill
  alerts and caregiver notifications for missed doses.*

### 20. Local Community Marketplace / Tool Lending
- **Problem:** neighbours buy tools and items they'd only use once
- **Stack:** Next.js, PostgreSQL + PostGIS, maps API, auth
- **Features:** list items to lend/sell/give away, search by distance,
  borrow requests, ratings, in-app chat
- **Resume bullet:** *Created a location-based lending marketplace with
  geospatial search, borrow requests, and user ratings.*

### 21. Grocery List & Pantry Tracker with Expiry Alerts
- **Problem:** households waste food and buy duplicates
- **Stack:** React Native, barcode scanner, Firebase (shared lists)
- **Features:** scan barcodes to add items, expiry reminders, shared family
  shopping list in real time, "what can I cook with what I have?"
- **Resume bullet:** *Built a shared pantry app with barcode scanning and
  expiry alerts to reduce household food waste.*

### 22. Small Business Appointment Booking
- **Problem:** barbers, tutors, and cleaners still take bookings by phone/DM
- **Stack:** Next.js, PostgreSQL, Stripe, Twilio SMS, Google Calendar API
- **Features:** public booking page, available time slots, deposits, SMS
  reminders to cut no-shows, owner dashboard
- **Resume bullet:** *Built a booking platform for small businesses with
  online deposits and SMS reminders, deployed for a real local business.*
- **Tip:** build this for a real local business, then mention it on your resume

### 23. Student Assignment & Exam Planner
- **Problem:** students juggle deadlines across many classes and platforms
- **Stack:** React / Next.js, PostgreSQL, Google Calendar sync
- **Features:** deadlines per course, auto-generated study schedule before
  exams, grade calculator ("what do I need on the final?"), reminders

### 24. Rental / Lease Document Organizer
- **Problem:** tenants lose track of leases, deposits, and repair requests
- **Stack:** Next.js, S3 file storage, PostgreSQL
- **Features:** upload lease/photos, move-in condition checklist with photos
  (proof for your deposit), rent reminders, repair request log with dates

### 25. Accessibility Checker for Websites
- **Problem:** many websites are unusable for people with disabilities
- **Stack:** Node.js, Puppeteer/Playwright, axe-core, React
- **Features:** enter a URL → report on contrast, missing alt text, keyboard
  navigation problems, with plain-English fix suggestions
- **Resume bullet:** *Built a web accessibility auditing tool using headless
  browser automation to detect WCAG violations and suggest fixes.*

### 26. Volunteer / Donation Matcher for Local Charities
- **Problem:** charities struggle to find volunteers for specific shifts
- **Stack:** Django or Rails, PostgreSQL, email notifications
- **Features:** charities post shifts and needed items, volunteers sign up,
  hour tracking with certificates (useful for students' community hours)
- **Tip:** partner with a real charity — great talking point in interviews

### 27. Browser Extension: Job Posting Saver
- **Problem:** job seekers lose track of listings across many sites
- **Stack:** Chrome Extension (JavaScript), backend API, React dashboard
- **Features:** one click to save a job from LinkedIn/Indeed, auto-extract
  title/company/salary, sync to your Job Tracker (idea #5)
- **Resume bullet:** *Published a Chrome extension that captures job postings
  from multiple sites into a personal tracking dashboard.*

### 28. Price Drop Tracker
- **Problem:** people overpay or miss sales
- **Stack:** Python (scraping + scheduler), PostgreSQL, email alerts
- **Features:** paste a product URL, price history chart, alert when price
  drops below your target

---

## Niche & Complex (stand-out projects, 2–4 months each)

Few candidates build these. Each one gives you a deep technical story for
interviews. Build a small working core first, then add features.

### 29. Self-Hosted Log Search Engine (mini Elasticsearch)
- **Niche:** developer infrastructure
- **Stack:** Rust or Go, custom inverted index, gRPC, React UI
- **Hard parts:** writing your own inverted index, tokenizer, and compression;
  time-range queries; ingesting 10k+ log lines/second
- **Resume bullet:** *Built a log search engine in Rust with a custom inverted
  index, ingesting 50k lines/sec with sub-100ms full-text queries.*

### 30. Distributed Key-Value Store with Raft
- **Niche:** distributed systems
- **Stack:** Go, Raft consensus (implemented yourself), Docker Compose cluster
- **Hard parts:** leader election, log replication, surviving node crashes,
  network-partition tests (use a chaos script to kill nodes)
- **Resume bullet:** *Implemented a fault-tolerant distributed key-value store
  using the Raft consensus algorithm, verified under node failures and
  network partitions.*

### 31. Multiplayer Game Server with Lag Compensation
- **Niche:** game networking
- **Stack:** C++/Rust/Go server, UDP, Godot or Phaser client
- **Hard parts:** authoritative server, client-side prediction, server
  reconciliation, interpolation, anti-cheat validation
- **Resume bullet:** *Built an authoritative multiplayer game server over UDP
  with client prediction and lag compensation for 64 concurrent players.*

### 32. Local-First Notes App with CRDT Sync
- **Niche:** offline-first software
- **Stack:** TypeScript, Automerge or Yjs, SQLite (WASM), Electron or Tauri
- **Hard parts:** works fully offline, merges edits from multiple devices
  without conflicts, end-to-end encrypted sync server
- **Resume bullet:** *Developed a local-first, end-to-end encrypted notes app
  using CRDTs for conflict-free multi-device sync.*

### 33. RAG Assistant for a Specific Domain
- **Niche:** applied AI (e.g. building codes, court rulings, medical guidelines,
  a university's course handbook)
- **Stack:** Python, pgvector or Qdrant, an LLM API, FastAPI, React
- **Hard parts:** PDF/table parsing, chunking strategy, hybrid search
  (keyword + vector), reranking, citations to source pages, an evaluation set
  measuring answer accuracy
- **Resume bullet:** *Built a retrieval-augmented assistant over 3,000 pages of
  building regulations with cited answers, improving answer accuracy from 62%
  to 88% on a custom evaluation set.*

### 34. Satellite / Drone Imagery Change Detector
- **Niche:** geospatial + computer vision
- **Stack:** Python, PyTorch, Sentinel-2 free satellite data, Leaflet map UI
- **Hard parts:** handling multi-band images, cloud masking, detecting
  deforestation, floods, or new construction between two dates
- **Resume bullet:** *Trained a segmentation model on Sentinel-2 imagery to
  detect land-use changes, with an interactive map for exploring results.*

### 35. Real-Time Transit Delay Predictor
- **Niche:** public transport data (GTFS / GTFS-Realtime feeds)
- **Stack:** Python, Kafka or Redpanda, TimescaleDB, ML model, map UI
- **Hard parts:** streaming live vehicle positions, predicting arrival delays,
  handling messy real-world data
- **Resume bullet:** *Built a streaming pipeline processing live transit feeds
  to predict bus delays, outperforming official ETAs by 23%.*

### 36. Smart Contract Security Scanner
- **Niche:** blockchain security
- **Stack:** Python or Rust, Solidity AST parsing, static analysis, web UI
- **Hard parts:** detecting reentrancy, integer overflows, and access-control
  bugs; testing against known-vulnerable contracts
- **Resume bullet:** *Wrote a static analyzer for Solidity smart contracts
  detecting 8 vulnerability classes, validated on 200 known-vulnerable
  contracts.*

### 37. Home Energy Optimizer (IoT)
- **Niche:** IoT + energy
- **Stack:** Raspberry Pi / ESP32, MQTT, InfluxDB, Grafana, Python
- **Hard parts:** reading real sensors or smart plugs, scheduling appliances
  when electricity prices are cheapest, forecasting usage
- **Resume bullet:** *Built an IoT energy system using ESP32 sensors and MQTT
  that shifts appliance use to off-peak hours, cutting a household's bill 15%.*

### 38. Build Your Own Programming Language / Interpreter
- **Niche:** compilers
- **Stack:** Rust, C, or Go; optionally compile to WebAssembly
- **Hard parts:** lexer, parser, type checker, garbage collector, online
  playground that runs in the browser
- **Resume bullet:** *Designed and implemented a statically typed programming
  language with a bytecode VM and a browser playground via WebAssembly.*

### 39. Privacy-Preserving Health Data Platform
- **Niche:** health tech + security
- **Stack:** Next.js, PostgreSQL row-level security, encryption at rest,
  FHIR standard API
- **Hard parts:** following the FHIR healthcare data standard, audit logs,
  role-based access (patient / doctor / admin), consent management
- **Resume bullet:** *Built a FHIR-compliant patient records platform with
  role-based access control, full audit logging, and encrypted storage.*

### 40. Algorithmic Trading Backtester
- **Niche:** quantitative finance
- **Stack:** Python (NumPy, Pandas) or C++, historical market data, dashboard
- **Hard parts:** event-driven engine, realistic fees and slippage, avoiding
  look-ahead bias, risk metrics (Sharpe ratio, max drawdown)
- **Resume bullet:** *Built an event-driven backtesting engine modelling fees
  and slippage, processing 10 years of minute-level data in under 30 seconds.*

### 41. Code Review Bot for GitHub
- **Niche:** developer tools + AI
- **Stack:** TypeScript, GitHub App API, webhooks, LLM API, static analysis
- **Hard parts:** reading PR diffs, posting inline comments, avoiding noisy
  false positives, running at scale with a job queue
- **Resume bullet:** *Built a GitHub App that reviews pull requests using
  static analysis plus an LLM, installed on 30+ repositories.*

### 42. Browser-Based Video Editor
- **Niche:** media processing on the web
- **Stack:** TypeScript, WebCodecs, FFmpeg.wasm, WebGL, Canvas
- **Hard parts:** timeline editing, trimming, effects rendered on the GPU,
  exporting video entirely in the browser (no server)
- **Resume bullet:** *Built an in-browser video editor using WebCodecs and
  WebGL with real-time preview and fully client-side export.*

---

## Pick by Target Role

| Target role          | Best picks                  |
|----------------------|-----------------------------|
| Frontend developer   | 1, 2, 4, 12, 25, 27, 42     |
| Backend developer    | 6, 7, 13, 16, 28, 29, 30    |
| Full-stack developer | 5, 8, 9, 11, 20, 22, 26, 39 |
| Mobile developer     | 3, 10, 14, 18, 19, 21, 32   |
| AI / ML engineer     | 11, 13, 18, 33, 34, 35      |
| DevOps / Cloud       | 7, 15, 16, 29, 41           |
| Systems / Low-level  | 30, 31, 38                  |
| Security             | 36, 39                      |
| Quant / Fintech      | 13, 40                      |
| Embedded / IoT       | 37                          |

---

## Make Every Project Resume-Ready

- [ ] Deploy it (Vercel, Netlify, Render, Fly.io, or app stores)
- [ ] Clear README: problem, screenshots/GIF, tech stack, how to run
- [ ] Write some tests (unit + at least one integration test)
- [ ] Set up CI with GitHub Actions
- [ ] Use real commits over time, not one giant commit
- [ ] Add measurable results to your resume bullet (users, speed, % improvement)
- [ ] Link the live demo **and** the GitHub repo on your resume
