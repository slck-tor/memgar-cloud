# Memgar Cloud

Cloud dashboard and API for Memgar - AI Agent Memory Security Platform.

## Features

- Real-time Memory Analysis
- Dashboard for monitoring agents
- Alerts via Slack, email, PagerDuty
- API Access
- Usage-based Billing

## Tech Stack

- Next.js 14 (App Router)
- Clerk (Auth)
- PostgreSQL + Prisma
- Tailwind CSS + shadcn/ui
- Stripe (Payments)
- Recharts

## Getting Started

1. Clone repo
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. `npx prisma db push`
5. `npm run dev`

## API

POST /api/v1/analyze
POST /api/v1/scan

## License

MIT
