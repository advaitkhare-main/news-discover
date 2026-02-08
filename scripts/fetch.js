const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser({
    customFields: { item: ['media:content', 'enclosure', 'thumbnail', 'dc:creator'] },
    maxEntriesPerFeed: 50,
    headers: { 'User-Agent': 'NewsDiscover/1.0' }  // Avoid blocks
});

// EXACT feeds - all verified 2026-02-08
const feeds = {
    india: [
        {url: 'https://feeds.feedburner.com/ndtvnews-latest', source: 'NDTV'},
        {url: 'https://indiatoday.in/rss/home', source: 'India Today'},
        {url: 'https://indianexpress.com/feed/', source: 'Indian Express'}
    ],
    global: [
        {url: 'https://feeds.bbci.co.uk/news/rss.xml', source: 'BBC'},
        {url: 'https://www.spiegel.de/schlagzeilen/tops/index.rss', source: 'Der Spiegel'},
        {url: 'https://rss.dw.com/rdf/rss-en-all', source: 'DW'}
    ],
    scitech: [
        {url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat AI'},
        {url: 'https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml', source: 'ScienceDaily AI'},
        {url: 'https://phys.org/rss-feed/technology-news/machine-learning-ai/', source: 'Phys.org AI'}
    ],
    finance: [
        {url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', source: 'ET Markets'},
        {url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=%5EGSPC', source: 'Yahoo S&P500'}
    ],
    politics: [
        {url: 'https://feeds.bbci.co.uk/news/politics/rss.xml', source: 'BBC Politics'},
        {url: 'https://rss.dw.com/rdf/rss-en-politics', source: 'DW Politics'}
    ],
    sports: [
        {url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', source: 'ESPN Cricinfo'},
        {url: 'https://www.bundesliga.com/en/rss/news.xml', source: 'Bundesliga'}
    ],
    marathi: [
        {url: 'https://www.lokmat.com/rss/', source: 'Lokmat'},
        {url: 'https://www.abplive.com/rss/feeds/abpmajha-marathi-news-5.xml', source: 'ABP Majha'},
        {url: 'https://maharashtratimes.indiatimes.com/rssfeeds/3485006.cms', source: 'Maharashtra Times'}
    ]
};

const seen = new Set();
let allNews = [];

(async () => {
    console.log('Fetching from 21 RSS feeds...');
    
    for (const [category, feedList] of Object.entries(feeds)) {
        console.log(`\n${category.toUpperCase()}:`);
        for (const {url, source} of feedList) {
            try {
                console.log(`  ${source}...`);
                const feed = await parser.parseURL(url);
                let count = 0;
                
                for (const item of feed.items.slice(0, 50)) {
                    const id = item.guid || item.link || item.title + item.pubDate;
                    if (seen.has(id) || count >= 25) continue;  // 25/feed max
                    
                    // Robust image extraction
                    let image = null;
                    if (item.enclosure?.url) image = item.enclosure.url;
                    else if (item['media:content']?.$.url) image = item['media:content'].$.url;
                    else if (item.thumbnail?.url) image = item.thumbnail.url;
                    else if (item.content) {
                        const match = item.content.match(/<img[^>]+src=["']([^"']+)/i);
                        if (match) image = match[1];
                    }
                    
                    allNews.push({
                        id: id,
                        category,
                        title: (item.title || '').trim().slice(0, 120) || 'No title',
                        summary: (item.contentSnippet || item.content || item.description || '').trim().slice(0, 250).replace(/<[^>]*>/g, '').replace(/\s+/g, ' '),
                        image: image || `https://source.unsplash.com/400x250/?news&sig=${Math.floor(Math.random()*20)}`,
                        source,
                        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
                        link: item.link || '#'
                    });
                    seen.add(id);
                    count++;
                }
                console.log(`    ✓ ${count} items`);
            } catch (e) {
                console.error(`    ✗ ${source}: ${e.message}`);
            }
        }
    }
    
    // Munich time sort (newest first CET)
    allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    allNews = allNews.slice(0, 200);  // Top 200 newest
    
    const outputPath = path.join('docs', 'news.json');
    fs.writeFileSync(outputPath, JSON.stringify(allNews, null, 2));
    
    console.log(`\n✅ Generated ${allNews.length} news items → ${outputPath}`);
    console.log(`⏰ Latest: ${new Date(allNews[0]?.pubDate).toLocaleString('de-DE')}`);
})();
