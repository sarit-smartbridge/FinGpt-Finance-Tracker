# FinGPT — Project Generation Prompt

> Use this file as a complete prompt to regenerate the entire FinGPT Personal Expense Tracker project from scratch using an AI coding assistant.

---

## Master Prompt

Build a full-stack **Personal Expense Tracker** web application called **FinGPT**. The app targets Indian users and uses **Indian Rupees (₹)**. Below is the complete specification for every layer of the project.

---

## 1. Project Overview

**Name:** FinGPT  
**Type:** Full-stack MERN web app (MongoDB, Express, React, Node.js)  
**Purpose:** Help individuals track monthly income and expenses, visualize spending patterns, set category budgets, and get AI-powered financial insights and advice.  
**Target Currency:** Indian Rupees (₹)

---

## 2. Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose ODM
- **Auth:** JWT (JSON Web Tokens) + bcrypt for password hashing
- **AI:** Google Gemini API (`@google/genai`) — model: `gemini-2.5-flash`
- **PDF Export:** pdfkit
- **Other packages:** cors, dotenv, nodemon

### Frontend
- **Framework:** React 18 (Vite)
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS v4 + custom CSS (`theme.css`, `App.css`) + styled-components for chat UI
- **UI Library:** React Bootstrap (for forms)
- **Charts:** Recharts (line chart, pie chart)
- **Icons:** React Icons (FontAwesome subset)
- **Notifications:** react-toastify
- **Cookies:** js-cookies
- **PDF Rendering (client):** @react-pdf/renderer
- **Loader:** react-loader-spinner

---

## 3. Folder Structure

```
Personal Expense Tracker/
├── client/
│   └── client/                   # Vite React app
│       ├── src/
│       │   ├── App.js
│       │   ├── App.css
│       │   ├── theme.css
│       │   ├── index.js
│       │   ├── index.css
│       │   ├── utils/
│       │   │   └── api.js        # Base URL helper
│       │   ├── context/          # (reserved for future context)
│       │   └── components/
│       │       ├── Header/
│       │       ├── Footer/
│       │       ├── Home/
│       │       ├── Login/
│       │       ├── Registration/
│       │       ├── Track/
│       │       ├── AddIncomeAndExpense/
│       │       ├── BudgetManager/
│       │       ├── BudgetAssistant/
│       │       ├── AiLab/
│       │       ├── AiInsights/
│       │       ├── Charts/
│       │       ├── LoaderSpinner/
│       │       ├── ProtectedRoute/
│       │       ├── NotFound/
│       │       └── MyDocument/
│       ├── public/
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
│
├── server/
│   └── server/                   # Express app
│       ├── server.js             # Entry point
│       ├── src/
│       │   ├── app.js            # Express app setup
│       │   ├── db/
│       │   │   └── connect.js    # Mongoose connection
│       │   ├── models/
│       │   │   ├── user.model.js
│       │   │   ├── expense.model.js
│       │   │   └── budget.model.js
│       │   ├── routes/
│       │   │   ├── auth.routes.js
│       │   │   ├── expense.routes.js
│       │   │   ├── user.routes.js
│       │   │   ├── report.routes.js
│       │   │   ├── ai.js
│       │   │   └── budgets.js
│       │   ├── controllers/
│       │   │   ├── auth.controller.js
│       │   │   ├── expense.controller.js
│       │   │   ├── budget.controller.js
│       │   │   ├── ai.controller.js
│       │   │   ├── report.controller.js
│       │   │   └── user.controller.js
│       │   ├── services/
│       │   │   ├── ai.service.js
│       │   │   ├── ai.tools.service.js
│       │   │   ├── expense.service.js
│       │   │   └── budget.service.js
│       │   ├── middleware/
│       │   │   └── auth.middleware.js
│       │   └── utils/
│       └── package.json
│
└── prompts/
    └── project-generation-prompt.md
```

---

## 4. Environment Variables

### Server (`server/server/.env`)
```
MONGO_URI=mongodb://127.0.0.1:27017/fingpt
PORT=5100
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
JWT_SECRET=replace_with_a_long_random_secret
```

### Client (`client/client/.env`)
```
VITE_API_URL=http://localhost:5100
```

---

## 5. Database Models (Mongoose)

### User
```js
{
  firstname: String (required),
  lastname: String (required),
  email: String (required, unique),
  password: String (required, bcrypt-hashed),
}
```

### Expense (one document per user per month)
```js
{
  userId: String (required),
  monthYear: String (required),    // e.g. "2025"
  monthNumber: Number (required),  // 1-12
  tables: [{
    tableName: String,             // "Income" or "Expense"
    columns: [String],             // ["Date", "Name", "Amount"]
    rows: [{
      date: String,
      name: String,
      amount: Number,
      category: String,            // AI-assigned or manual
    }],
  }],
  calculations: {
    totalIncome: Number,
    totalExpense: Number,
    currentAmount: Number,         // savings = income - expense
  },
}
```

### Budget
```js
{
  userId: String (required),
  category: String (required),
  amount: Number (required),
  month: Number (required),        // 1-12
  year: String (required),
}
// Unique index on: userId + category + month + year
```

---

## 6. API Endpoints

### Auth
| Method | Path       | Description                         |
|--------|------------|-------------------------------------|
| POST   | /signup    | Register user, return JWT + user    |
| POST   | /login     | Login user, return JWT + user       |

### Expenses
| Method | Path                                              | Description                         |
|--------|---------------------------------------------------|-------------------------------------|
| GET    | /expenses/:userId                                 | Get all months for a user           |
| POST   | /expenses                                         | Create a new month                  |
| DELETE | /expenses/month                                   | Delete a month by userId+month+year |
| GET    | /expenses/:id/tables/:tableName/rows/:rowId       | Get a single row                    |
| PUT    | /expenses/:id/tables/:tableName/rows/:rowId       | Edit a row                          |
| DELETE | /expenses/:id/tables/:tableName/rows/:rowId       | Delete a row                        |
| POST   | /addRow                                           | Add a row to a table                |

### Budgets
| Method | Path             | Description                         |
|--------|------------------|-------------------------------------|
| GET    | /budgets/:userId | Get all budgets for user            |
| POST   | /budgets         | Create or update a budget           |
| DELETE | /budgets/:id     | Delete a budget                     |

### AI
| Method | Path               | Description                               |
|--------|--------------------|-------------------------------------------|
| POST   | /ai/categorize     | AI auto-categorize all rows in a month    |
| POST   | /ai/insights       | Generate AI insight cards for a month     |
| POST   | /ai/chat           | Budgeting assistant chat (multi-turn)     |
| POST   | /ai/receipt        | Scan receipt image and extract items      |
| POST   | /ai/tools/:toolId  | Run an AI Lab tool (see Section 10)       |

### Reports
| Method | Path            | Description                      |
|--------|-----------------|----------------------------------|
| POST   | /generate-pdf   | Generate and download PDF report |

---

## 7. Authentication Flow

- On signup/login, server returns `{ token, user: { _id, firstname, ... } }`
- Client stores in cookies: `jwtToken`, `userId`, `userName` (expiry: 30 days, path: `/`)
- Protected routes check for `jwtToken` cookie — redirect to `/login` if missing
- Logout: clear all 3 cookies -> show toast -> navigate to `/login` after 1.5s

---

## 8. Pages & Routes

| Path                    | Component             | Protected |
|-------------------------|-----------------------|-----------|
| `/login`                | Login                 | No        |
| `/signup`               | Registration          | No        |
| `/`                     | Home                  | Yes       |
| `/track`                | Track                 | Yes       |
| `/addincome-or-expense` | AddIncomeAndExpense   | Yes       |
| `/budgets`              | BudgetManager         | Yes       |
| `/assistant`            | BudgetAssistant       | Yes       |
| `/ai-lab`               | AiLab                 | Yes       |
| `/not-found`            | NotFound              | No        |
| `*`                     | -> /not-found         | No        |

---

## 9. Component Descriptions

### Header
- Fixed top navbar with glassmorphism style (frosted glass, blur, white border)
- Logo: teal gradient wallet icon + "FinGPT" wordmark
- Nav links: Home, Track, Add, Budgets, Assistant, AI Lab
- Desktop: pill-shaped Login button (teal gradient, shimmer highlight, hover lift)
- When logged in: shows username pill + logout icon button
- Logout triggers a toast confirmation (Yes / Cancel inline buttons, no auto-close)
- Mobile: hamburger menu, collapsible nav drawer

### Login
- Centered card with ambient background animation
- Email + password fields (password toggle show/hide)
- On success: `toast.success("Welcome back, [Name]!")` -> navigate to `/` after 1s
- On failure: `toast.error("Email or Password didn't match. Please try again.")`
- Link to `/signup`

### Registration
- Same card style as Login
- Fields: First Name, Last Name, Email, Password
- On success: navigate to `/login`

### Home
- Landing/dashboard hero page for logged-in users
- Highlights: current month summary cards (total income, total expense, savings)
- Quick links to Track, Add, Budgets, Assistant, AI Lab

### Track
- Year + Month filter toolbar
- "Add New Month" and "Delete Month" buttons
- For each month: Income table + Expense table (editable rows, add row, delete row)
- Each row has inline edit (save button) and delete button
- Summary cards per month: Total Income, Total Expense, Current Savings (INR)
- Overspending alert if expense > 50% of income
- Monthly Trend Line Chart (Recharts) across all months
- Category Pie Chart per month
- AI Insights panel per month (generated on demand)
- AI Auto-categorize button per month
- Download PDF button per month

### AddIncomeAndExpense
- Form to create a new month entry
- Select year, month
- Add Income table rows (date, name, amount)
- Add Expense table rows (date, name, amount)
- Auto-calculates totalIncome, totalExpense, currentAmount on submit

### BudgetManager
- View, set, and delete category budgets for a given month/year
- Shows budget vs actual spending per category with a progress bar
- Over-budget categories highlighted in red
- Predefined expense categories: Rent, Utilities, Groceries, Food & Dining, Transport,
  Shopping, Health, Entertainment, Education, Subscriptions, Other

### BudgetAssistant
- Full-screen chat interface (styled-components)
- Header bar with robot icon + title "Budgeting Assistant"
- Message thread with user/bot bubbles (teal gradient for user, light grey for bot)
- Starter suggestions shown when no messages yet
- Sends conversation history + userId to `/ai/chat`
- AI answers grounded in the user's actual expense data

### AiLab
- Sidebar with 12 AI tool cards
- Right panel shows selected tool's fields and "Run" button
- Tools:
  1. Spending forecast — predict next month with confidence range
  2. Anomaly detector — find unusual/duplicate transactions
  3. Smart budget — auto-generate category limits from history
  4. Quick transaction — parse natural language into a transaction
  5. Receipt scanner — upload receipt image, extract items via Gemini vision
  6. Subscription finder — detect recurring expenses
  7. Savings goal — input target amount, already saved, target date -> monthly plan
  8. What-if simulator — simulate add/reduce expense or income change
  9. Smart search — semantic search across transactions
  10. Financial timeline — key events and changes in financial history
  11. Financial digest — concise briefing with actions and risks
  12. Explain my charts — natural language trend explanation
- Result rendered recursively (handles nested objects, arrays, booleans, numbers)
- Numbers formatted as INR if key name suggests a money value

### AiInsights
- Embedded in Track page per month
- "Generate Insights" button -> calls `/ai/insights`
- Returns summary text + 3-5 insight cards (title, detail, severity: good/warning/neutral)
- Colour-coded: green=good, amber=warning, grey=neutral

### Charts
- MonthlyTrendChart — Recharts LineChart, plots income/expense/savings across all months
- CategoryPieChart — Recharts PieChart, shows spending breakdown by category for one month

### ProtectedRoute
- Reads `jwtToken` cookie
- If missing -> `<Navigate to="/login" />`
- If present -> render the wrapped Component

---

## 10. AI Service Design

All AI calls use Google Gemini (`gemini-2.5-flash`) via `@google/genai`.

### categorizeTransactions(monthId)
- Fetches all rows for the month
- Sends them to Gemini with expense and income category lists
- Returns structured JSON `{ categories: [{ id, category }] }`
- Updates each row's category field and saves

### generateInsights(monthId)
- Sends full month data to Gemini
- Returns `{ summary: string, insights: [{ title, detail, severity }] }`
- Severity: "good" | "warning" | "neutral"

### getAssistantReply({ userId, messages })
- Fetches all months for the user as a financial snapshot
- Passes snapshot in the system prompt alongside the chat history
- Returns a grounded, concise reply (max 600 tokens)

### analyzeImage({ data, mimeType, prompt, schema })
- Sends a base64 image inline to Gemini
- Used for receipt scanning

### AI Tools (ai.tools.service.js) — 12 tools
Each tool receives the user's full expense data and optional user inputs:
- forecast — linear projection of next month income/expense/savings with confidence range
- anomalies — find transactions that are outliers or duplicates
- smart-budget — derive category limits from 3-month average spending
- parse-transaction — extract date, name, amount, category from free text
- receipt — vision model extracts merchant, items, totals, date from image
- subscriptions — detect monthly recurring charges and estimate annual cost
- goal — calculate required monthly saving rate to hit a target by a deadline
- simulate — project savings impact of a hypothetical monthly change
- search — semantic search returning matching transactions
- timeline — ordered list of significant financial events
- digest — executive summary with top action items and financial risks
- explain — plain-language narrative of spending trends

---

## 11. Design System

### Colors
```
--brand-500: #0f766e   (primary teal)
--brand-600: #0f766e
--brand-700: #126b66
--ink-900: #0f172a     (near-black text)
--ink-700: #334155
--ink-500: #64748b     (muted text)
--surface: #f8fafc
--line: rgba(0,0,0,0.08)
--expense: #ef4444     (red for expenses)
--income: #22c55e      (green for income)
```

### Typography
- Import Inter from Google Fonts
- Font weights used: 400, 600, 700, 800 (extrabold)
- Brand display font for "FinGPT" wordmark: tighter tracking, extrabold

### Component Styling Patterns
- Glassmorphism panels: backdrop-blur, bg-white/78, border border-white/90
- Cards: border-radius 22px, deep box-shadow
- Buttons: Pill-shaped (rounded-full) or rounded-[14px], teal gradient, hover lift + glow
- Micro-animations: transition-all duration-300, hover:-translate-y-[2px]
- Ambient background: floating orbs, gradient ribbons, 3D coin/card/cube decorations
  (CSS only, aria-hidden, pointer-events-none — purely decorative)

### Toast Notifications (react-toastify)
- ToastContainer in App.js — position: top-right, autoClose: 3000, theme: light
- Login success: toast.success("Welcome back, [Name]!")
- Login failure: toast.error("Email or Password didn't match. Please try again.")
- Network error: toast.error("Something went wrong. Please try again.")
- Logout click: toast.info(...) with inline "Yes, Logout" / "Cancel" buttons, autoClose: false
- Logout confirmed: toast.success("You have been logged out. See you soon!")

---

## 12. PDF Export

- Server-side using pdfkit
- Endpoint: POST /generate-pdf with `{ month }` body (full month object)
- Generates a styled report with income/expense tables and summary calculations
- Client downloads it as report.pdf via a Blob URL

---

## 13. Running the Project

### Server
```bash
cd server/server
npm install
npm run dev    # nodemon server.js -- runs on http://localhost:5100
```

### Client
```bash
cd client/client
npm install
npm run dev    # vite -- runs on http://localhost:3000
```

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017 (or provide a remote MONGO_URI)
- A valid GEMINI_API_KEY from Google AI Studio (for AI features)

---

## 14. Key Patterns to Follow

1. **Cookie-based auth:** Use js-cookies. Store jwtToken, userId, userName.
   Always set path "/" and expiry 30 * 24 * 60 * 60 seconds.

2. **API URL helper:** All fetch calls use apiUrl(path) from src/utils/api.js
   which reads VITE_API_URL env var and falls back to http://localhost:5100.

3. **No bare alert() or window.confirm():** Use react-toastify for all user
   notifications. For destructive confirmations, embed inline action buttons
   inside the toast with autoClose: false and closeButton: false.

4. **AI is optional:** If GEMINI_API_KEY is not set, the server returns a 503
   with a helpful error message. AI-related UI should handle this gracefully
   and show the error to the user without crashing.

5. **Inline row editing in Track:** Only one row editable at a time, identified
   by editId state. Save triggers a PUT request. Clicking edit fetches fresh
   row data from the server before populating the inline form.

6. **Month data structure:** Each month document has a tables array with exactly
   two entries: tableName "Income" and tableName "Expense". Each table has
   columns: ["Date", "Name", "Amount"].

7. **Protected routes:** Use a ProtectedRoute wrapper — check cookie, not server
   — for instant redirect without a network round-trip.

8. **Responsive layout:** The header collapses to a hamburger menu on screens
   narrower than xl (1280px). Use Tailwind xl: breakpoint for nav visibility.

9. **Calculations are server-side:** When rows are added, edited, or deleted,
   the server recalculates totalIncome, totalExpense, currentAmount and saves
   them back to the Expense document before returning the response.

10. **Unique budget constraint:** The Budget model enforces a unique compound
    index on { userId, category, month, year }. On POST /budgets, upsert if
    the combination already exists rather than creating a duplicate.
