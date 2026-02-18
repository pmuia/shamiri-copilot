This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Perfect. Below is a production-quality README tailored specifically to your Shamiri Supervisor Copilot project.

It is structured the way senior engineers submit take-home assignments:

Clear architecture explanation

AI engineering decisions

Setup instructions

Prisma 7 notes

Human-in-the-loop explanation

Deployment instructions

AI usage disclosure section

You can paste this directly into README.md.

🧠 Shamiri Supervisor Copilot

A web-based AI-powered dashboard that amplifies Tier 2 Supervisors’ capacity to review therapy sessions delivered by Shamiri Fellows.

Built as part of the Senior Software Engineer Take-Home Assignment.

🌍 Context

Shamiri delivers evidence-based mental health interventions using a Tiered Care Model:

Fellows (Tier 1) → Lay providers delivering group sessions

Supervisors (Tier 2) → Semi-professionals overseeing quality & safety

As Shamiri scales to millions of youths, Supervisors cannot manually review every session.

This product introduces:

An AI Copilot that analyzes session transcripts, scores quality, flags risks, and supports human validation.

✨ Features
📊 Dashboard

Lists completed sessions

Displays:

Fellow name

Group ID

Date

Status (Pending / Processed / Flagged / Safe)

Risk sessions visually highlighted

One-click AI analysis

🤖 AI Analysis Engine

Each session transcript is evaluated against a structured rubric:

1️⃣ Content Coverage

Did the Fellow teach Growth Mindset correctly?

2️⃣ Facilitation Quality

Was delivery empathetic and engaging?

3️⃣ Protocol Safety

Did the Fellow stay within curriculum boundaries?

🚨 Risk Detection

Binary flag:

SAFE

RISK (with extracted quote)

👩🏽‍⚖️ Human-in-the-Loop

Supervisors can:

Validate AI findings

Override status

Add notes

Confirm or reject risk flags

AI does not replace supervision — it augments it.

🏗 Architecture
Stack
Layer Technology
Framework Next.js 16 (App Router)
Language TypeScript
Database PostgreSQL
ORM Prisma 7
AI Model OpenAI GPT-4o-mini
Validation Zod
Styling Tailwind CSS
Hosting Vercel (recommended)
System Design
Dashboard → API Route → AI Analyzer → Zod Validation → Database
↓
Supervisor Review

Database Schema

Core models:

Supervisor

Fellow

Session

SessionAnalysis

SupervisorReview

AI results and Supervisor reviews are stored separately to preserve audit integrity.

🤖 AI Engineering Approach

This project does not simply send raw text to an LLM.

It implements:

✅ Structured JSON Output Enforcement

Uses OpenAI JSON mode + Zod validation.

✅ Defensive Prompting

Strict rubric definitions.
Explicit scoring criteria.
Hard constraints on output format.

✅ Risk Extraction

Self-harm phrases trigger:

riskFlag = true

Quote extraction

✅ Validation Layer

All AI responses are validated with Zod before persistence.

If validation fails → request fails safely.

🚀 Getting Started
1️⃣ Install Dependencies
npm install

2️⃣ Environment Variables

Create .env in project root:

DATABASE_URL=postgresql://user:password@localhost:5432/dbname
OPENAI_API_KEY=your_openai_key

⚠️ Encode special characters in DB passwords.

3️⃣ Prisma Setup
npx prisma generate
npx prisma migrate dev

4️⃣ Seed Database
npx prisma db seed

Seeds:

1 Supervisor

3 Fellows

10 Session transcripts

Risk & protocol violation examples

5️⃣ Run Dev Server
npm run dev

Visit:

http://localhost:3000/dashboard

📂 Project Structure
app/
├── dashboard/
├── session/[id]/
├── api/
│ ├── analyze/[id]/
│ └── review/
lib/
├── prisma.ts
└── ai/
├── analyzer.ts
├── prompt.ts
└── schema.ts
components/
├── AnalyzeButton.tsx
└── ReviewPanel.tsx

🔐 Prisma 7 Note

Prisma 7 requires driver adapters.

This project uses:

@prisma/adapter-pg

Connection is configured in:

lib/prisma.ts

🧠 AI Usage Disclosure

AI coding tools were used intentionally and critically:

Used AI For:

Initial Prisma schema scaffolding

Drafting base prompt structure

Generating synthetic therapy transcripts

Hand-Engineered:

AI prompt refinement

Zod validation schema

Defensive output handling

Human-in-loop workflow

Database modeling

Error handling

Risk detection logic

Architecture decisions

All AI-generated code was manually reviewed, refactored, and tested.

🧪 Evaluation Criteria Alignment
Engineering Architecture

Proper relational modeling

Clean separation of AI and human decisions

Type-safe Prisma + Zod enforcement

Next.js Server / Client component separation

AI Engineering

Structured output

Rubric enforcement

Risk extraction

Low temperature

JSON mode

Product Sense

Risk visually urgent

Minimal, accessible UI

Clear scoring explanations

Lightweight interface

Shamiri Alignment

Growth Mindset terminology

Tier 2 Supervisor framing

Evidence-based tone

Human oversight prioritized

🧭 Future Improvements

If extended further:

Transcript chunking for large sessions

AI confidence scoring

Streaming analysis

Background job queue

Supervisor analytics dashboard

Real authentication layer

Multi-Supervisor access control

📦 Deployment

Recommended:

Database → Neon or Railway

App → Vercel

Environment variables configured in hosting dashboard

🎯 Final Note

This system demonstrates:

AI as structured decision support

Human validation loop

Defensive engineering

Scalable architecture thinking

The Supervisor Copilot is not a chatbot.

It is an AI-assisted quality assurance system designed for scale.
