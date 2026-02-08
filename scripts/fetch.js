const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser({ maxEntriesPerFeed: 20 });

// TOP 7 feeds only (fastest, reliable)
const feeds = [
  {url: 'https://feeds.feedburner.com/ndtvnews-latest', category: 'india', source: 'NDTV'},
  {url: 'https://feeds.bbci.co.uk/news/rss.xml', category: 'global', source: 'BBC'},
  {url: 'https://venturebeat.com/category/ai/feed/', category: 'scitech', source: 'VentureBeat'},
  {url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', category: 'finance', source: 'ET'},
  {url: 'https://feeds.bbci.co.uk/news/politics/rss.xml', category: 'politics', source: 'BBC Politics'},
  {url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', category: 'sports', source: 'Cricinfo'},
  {url: 'https://www.lokmat.com/rss/', category: 'marathi', source: 'Lokmat'}
];

(async () => {
  console.log('🚀 Fetching 7 RSS feeds...');
  let allNews = [];
  
  for (const feed of feeds) {
    try {
      console.log(`📡 ${feed.source}...`);
      const data = await parser.parseURL(feed.url);
      
      for (const item of data.items.slice(0, 10)) {
        allNews.push({
          id: item.guid || item.link,
          category: feed.category,
          title: item.title?.slice(0, 100) || 'News',
          summary: (item.contentSnippet || item.description || '').slice(0, 200),
          image: 'https://picsum.photos/400/250?news',  // Placeholder for speed
          source: feed.source,
          pubDate: item.pubDate || new Date().toISOString(),
          link: item.link || '#'
        });
      }
      console.log(`   ✅ ${data.items.length} items`);
    } catch (e) {
      console.log(`   ❌ ${feed.source}: ${e.message}`);
    }
  }
  
  // Save & log
  fs.writeFileSync(path.join('docs', 'news.json'), JSON.stringify(allNews.slice(0, 50), null, 2));
  console.log(`\n🎉 SAVED ${allNews.length} articles to docs/news.json`);
})();
