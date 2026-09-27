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

## Pick by Target Role

| Target role          | Best picks                  |
|----------------------|-----------------------------|
| Frontend developer   | 1, 2, 4, 12, 25, 27         |
| Backend developer    | 6, 7, 13, 16, 28            |
| Full-stack developer | 5, 8, 9, 11, 20, 22, 26     |
| Mobile developer     | 3, 10, 14, 18, 19, 21       |
| AI / ML engineer     | 11, 13, 18                  |
| DevOps / Cloud       | 7, 15, 16                   |

---

## Make Every Project Resume-Ready

- [ ] Deploy it (Vercel, Netlify, Render, Fly.io, or app stores)
- [ ] Clear README: problem, screenshots/GIF, tech stack, how to run
- [ ] Write some tests (unit + at least one integration test)
- [ ] Set up CI with GitHub Actions
- [ ] Use real commits over time, not one giant commit
- [ ] Add measurable results to your resume bullet (users, speed, % improvement)
- [ ] Link the live demo **and** the GitHub repo on your resume
