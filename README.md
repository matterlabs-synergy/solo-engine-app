# ⚡ Hooks & Highlights // AI Summarizer

A minimalist, high-efficiency web application and serverless pipeline designed to convert long-form video transcripts into viral hooks and structured text insights using the OpenAI API.

## 🚀 Core Features

- **Automated Hook Extraction**: Scans multi-kilobyte text payloads to isolate high-retention opening hooks.
- **Structured Highlights**: Distills lengthy spoken dialogue into punchy, bulleted summaries.
- **Serverless Architecture**: Built with a lightweight, secure Node.js backend hosted natively on Vercel.
- **IPv4 Failsafe Network**: Utilizes an isolated HTTPS request engine to bypass cloud network blocks and firewalls.

---

## 📂 Repository Structure

Your GitHub repository must maintain this exact folder layout:

```text
├── api/
│   └── summarize.js      # Serverless Node.js backend (OpenAI pipeline)
├── index.html            # Minimalist frontend interface
├── vercel.json           # Global routing configurations
└── package.json          # Environment module declarations
```

---

## ⚙️ Configuration Files

Ensure your root configuration files match the specifications below to guarantee flawless compilation on Vercel.

### 1. `package.json`
Forces Vercel to handle the modern ECMAScript module runtime syntax:
```json
{
  "name": "hooks-highlights-backend",
  "version": "1.0.0",
  "type": "module"
}
```

### 2. `vercel.json`
Maps incoming browser traffic to the correct frontend and serverless API endpoints:
```json
{
  "rewrites": [
    { "source": "/api/summarize", "destination": "/api/summarize.js" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🛠️ Deployment Instructions

### Step 1: Link to Vercel
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.

### Step 2: Inject Environment Variables
Before clicking deploy, expand the **Environment Variables** panel in the Vercel project setup interface and add your OpenAI credentials:
- **Key**: `OPENAI_API_KEY`
- **Value**: `sk-proj-...` (Your private secret key from the OpenAI Developer platform)

### Step 3: Clear Cache and Deploy
1. Click **Deploy**.
2. If you make future code modifications, always execute your redeployments with the **"Use existing Build Cache"** toggle turned **OFF** to overwrite older compiled files completely.

---

## 💻 Operational Workflow

1. Open your live Vercel application URL.
2. **Pipeline Connectivity Test**: Type the lowercase word `test` into the main text box and click **Extract Data**. The system will bypass the OpenAI API entirely and return a simulated dataset to confirm your network is completely functional.
3. **Production Use**: Paste a raw video text transcript directly into the application text area and select **Extract Data** to generate real-time AI content analytics.
