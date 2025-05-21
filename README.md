## 🚀 Introduction

Welcome to the **AI-Powered Mini CRM** – a lightweight and intelligent Customer Relationship Management solution designed specifically for sales professionals.

This application helps you:

- 🧩 Manage and track leads efficiently  
- 💬 Keep a record of conversations and progress  
- 🤖 Leverage AI-powered suggestions (via Gemini API) to boost productivity  

Built using modern technologies like **Next.js**, **MongoDB**, and **Tailwind CSS**, this CRM offers a fast, modular, and smart user experience.


## 🧱 Tech Stack

| Layer        | Technology                                                  |
|--------------|-------------------------------------------------------------|
| **Frontend** | Next.js (with TypeScript), Tailwind CSS, Headless UI        |
| **Backend**  | Node.js with Express or Next.js API Routes                  |
| **Database** | MongoDB                                                     |
| **AI**       | Gemini API for AI-powered features                          |


## 🚀 How to Run

Follow these steps to run the project locally:

**1. 📦 Clone the Repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

**2. 📥 Install Dependencies**
   ```bash
   npm install
   ```

**3. 🛠️ Create Environment File**
Create a .env.local file in the root directory and add the following variables:
   ```bash
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```
✅ Replace the values with your actual credentials.


**4. 🧪 Run the Development Server**
Create a .env.local file in the root directory and add the following variables:
   ```bash
   npm run dev
   ```
Open your browser and navigate to http://localhost:3000 to view the application.





##📁 Folder Structure


```bash
.
├── app/                      # Next.js app directory (App Router)
│   ├── api/                 # API route handlers (server functions)
│   │   └── leads/           # Lead-related API routes
│   │       └── [id]/        # API routes for individual lead operations
│   │           └── route.ts # GET, PUT, DELETE handlers for specific lead
│   │       └── route.ts     # POST handler to create new lead
│   ├── leads/               # Frontend routes for leads
│   │   ├── [id]/            # Lead detail/edit page
│   │   │   └── page.tsx
│   │   ├── new/             # Create new lead page
│   │   │   └── page.tsx
│   │   └── page.tsx         # Lead list (main table)
│   ├── layout.tsx           # App layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
│
├── components/              # Reusable UI components
│   └── ...                  # (e.g., LeadTable, LeadForm, Modal, etc.)
│
├── hooks/                   # Custom React hooks
│   └── useLeads.ts
│   └── useSelection.ts
│   └── useFilteredSortedLeads.ts
│   └── useTimeAgo.ts
│
├── lib/                     # Utility functions and services
│   └── ...                  # (e.g., db.ts, apiClient.ts, constants.ts)
│
├── models/                  # Database models or TypeScript interfaces
│   └── lead.ts              # Lead schema/model
│
├── .env.local               # Environment variables (e.g., DB_URI)
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Ignored files and folders
├── components.json          # (Optional config for storybook or other tools)
└── node_modules/            # Installed dependencies
```


