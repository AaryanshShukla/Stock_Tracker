# Signalist - Stock Market Tracker

A real-time stock market tracking application built with Next.js 16, TypeScript, and Tailwind CSS.

## Live Demo

**[View Live App](https://stock-tracker-app-steel.vercel.app/dashboard)**

> After publishing, replace the URL above with your actual Vercel deployment URL.

## Features

- **Real-Time Stock Data** - Live quotes from Finnhub API with auto-refresh every 30 seconds
- **Interactive Charts** - Area charts with time range toggles (1D, 1W, 1M, 3M, 1Y)
- **Portfolio Management** - Track holdings with real-time P&L calculations
- **Watchlist** - Monitor your favorite stocks with price alerts
- **Price Alerts** - Set alerts for price above/below thresholds
- **Dark Theme** - Beautiful dark UI inspired by Signalist design
- **Fully Responsive** - Mobile-first design that works on all devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Charts**: Recharts
- **API**: Finnhub Stock API
- **State**: React Context + localStorage

## Getting Started

### Prerequisites

- Node.js 18+
- Finnhub API Key (free at [finnhub.io](https://finnhub.io))

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/signalist-stock-tracker.git

# Navigate to project
cd signalist-stock-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your FINNHUB_API_KEY to .env.local

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FINNHUB_API_KEY` | Your Finnhub API key | Yes |

## Project Structure

\`\`\`
├── app/                  # Next.js App Router pages
│   ├── dashboard/        # Main dashboard
│   ├── portfolio/        # Portfolio management
│   ├── watchlist/        # Stock watchlist
│   ├── alerts/           # Price alerts
│   ├── settings/         # User settings
│   └── stock/[symbol]/   # Stock detail pages
├── components/
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Header, Sidebar, AppShell
│   ├── stocks/           # Stock-related components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API client
├── types/                # TypeScript definitions
└── contexts/             # React Context providers
\`\`\`

## Screenshots

### Dashboard
![Dashboard](/images/dashboard.png)

## License

MIT License - feel free to use this project for learning or as a starting point for your own stock tracker.

## Acknowledgments

- Design inspired by [Signalist](https://github.com/adrianhajdin/signalist_stock-tracker-app) by Adrian Hajdin
- Stock data provided by [Finnhub](https://finnhub.io)
