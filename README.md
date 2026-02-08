# News Discover - Perplexity Discover Clone
# 📰 News Discover - Perplexity Discover Clone

**Live demo logic**: Hourly RSS → JSON → Dark card grid UI exactly like perplexity.ai/discover.

## Munich-Optimized Categories
- 🇮🇳 India News (NDTV, India Today, Express)
- 🌍 Global (BBC, Spiegel, DW) 
- 🤖 Sci/Tech AI/ML (VentureBeat, ScienceDaily)
- 💹 Finance (ET Markets, S&P 500)
- 🏛️ Politics (BBC/DW)
- ⚽ Sports (Cricinfo, Bundesliga)
- 🗞️ मराठी (Lokmat, ABP Majha)

## 🚀 5-Min Deploy

Production RSS news aggregator with Perplexity Discover UI (dark theme). Updates hourly from 7 categories via GitHub Actions.

## Features
- Responsive 1-4 column card grid (mobile-first)
- Category tabs: India News, Global News, Sci/Tech, Finance, Politics, Sports, Marathi
- Hover effects, images, 3-line summaries, sources/dates
- PWA-ready (Android home screen)
- Hourly auto-update from verified RSS feeds

## Deploy (5 mins)
1. Fork/clone this repo
2. Enable GitHub Pages (Settings > Pages > main branch)
3. Done! Site at `YOURUSERNAME.github.io/news-discover`

## Customization
- Edit `feeds.yaml` to add RSS sources
- Modify colors/UI in `index.html`
- Action runs <5min, <50 items/category, deduped by guid

## Structure
