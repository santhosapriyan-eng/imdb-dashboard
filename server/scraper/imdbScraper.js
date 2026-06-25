const axios = require('axios');
const cheerio = require('cheerio');

const IMDB_URL = 'https://www.imdb.com/chart/boxoffice';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Referer': 'https://www.imdb.com/',
  'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Upgrade-Insecure-Requests': '1'
};

async function scrapeIMDb() {
  try {
    console.log('🎬 Scraping IMDb Box Office data...');
    
    const response = await axios.get(IMDB_URL, {
      headers: HEADERS,
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const movies = [];

    // Try multiple selectors for IMDb's various layouts
    // IMDb uses different structures - try JSON-LD first
    let jsonLdData = null;
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html());
        if (data['@type'] === 'ItemList') {
          jsonLdData = data;
        }
      } catch(e) {}
    });

    // Try scraping from the HTML table/list structure
    const rows = $('tr.chart-layoutrow, .chart-row, [data-testid="chart-layout-main-column"] tr, .lister-list tr').toArray();
    
    // Also try the newer IMDb layout
    const listItems = $('[data-testid="chart-layout-main-column"] li, .ipc-metadata-list li').toArray();

    let rank = 1;

    if (listItems.length > 0) {
      // New IMDb layout
      listItems.slice(0, 10).forEach((item) => {
        const $item = $(item);
        
        const title = $item.find('[data-testid="title"], .ipc-title__text, h3').first().text().trim()
          .replace(/^\d+\.\s*/, '').trim();
        
        const href = $item.find('a[href*="/title/"]').first().attr('href') || '';
        const imdbUrl = href ? `https://www.imdb.com${href.split('?')[0]}` : '';
        
        const poster = $item.find('img').first().attr('src') || 
                       $item.find('img').first().attr('srcset')?.split(',').pop()?.trim().split(' ')[0] || '';
        
        const metaTexts = $item.find('[data-testid="title-metadata-widget"] span, .sc-f30335b4 span, .cli-title-metadata span').map((_, el) => $(el).text().trim()).toArray();
        
        const grossTexts = $item.find('[data-testid*="gross"], span').map((_, el) => $(el).text().trim()).toArray()
          .filter(t => t.includes('$') || t.includes('M') || t.includes('K'));

        if (title && title.length > 1) {
          movies.push({
            rank: rank++,
            title,
            weekendGross: grossTexts[0] || 'N/A',
            totalGross: grossTexts[1] || 'N/A',
            weeks: parseInt(metaTexts.find(t => /^\d+$/.test(t)) || '1') || 1,
            imdbUrl,
            poster: poster || ''
          });
        }
      });
    }

    if (rows.length > 0 && movies.length === 0) {
      // Old table layout
      rows.slice(0, 10).forEach((row) => {
        const $row = $(row);
        
        const titleEl = $row.find('.titleColumn a, td.titleColumn a');
        const title = titleEl.text().trim();
        const href = titleEl.attr('href') || '';
        const imdbUrl = href ? `https://www.imdb.com${href}` : '';
        
        const poster = $row.find('img').attr('src') || '';
        const cells = $row.find('td').map((_, td) => $(td).text().trim()).toArray();
        
        if (title) {
          movies.push({
            rank: rank++,
            title,
            weekendGross: cells.find(c => c.includes('$')) || 'N/A',
            totalGross: cells.filter(c => c.includes('$'))[1] || 'N/A',
            weeks: 1,
            imdbUrl,
            poster
          });
        }
      });
    }

    // If scraping failed or returned too few results, return mock data for demo
    if (movies.length < 3) {
      console.log('⚠️  Live scraping returned insufficient data, using demo data');
      return getMockData();
    }

    console.log(`✅ Scraped ${movies.length} movies successfully`);
    return movies;

  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    console.log('📦 Falling back to demo data');
    return getMockData();
  }
}

function getMockData() {
  return [
    {
      rank: 1,
      title: "Inside Out 2",
      weekendGross: "$154.2M",
      totalGross: "$498.9M",
      weeks: 3,
      imdbUrl: "https://www.imdb.com/title/tt22022452/",
      poster: "https://m.media-amazon.com/images/M/MV5BOTggMWM0OGQtNjNlYy00MDM5LTgyMjYtYWYzOTY0MzY1NmIzXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_UX67_CR0,0,67,98_AL_.jpg"
    },
    {
      rank: 2,
      title: "A Quiet Place: Day One",
      weekendGross: "$52.3M",
      totalGross: "$134.7M",
      weeks: 2,
      imdbUrl: "https://www.imdb.com/title/tt14444726/",
      poster: "https://m.media-amazon.com/images/M/MV5BYmQ2MjM5MDYtMzlkMy00OTM5LTg3ODctYTgxNmI5ZTIwNzRlXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_UX67_CR0,0,67,98_AL_.jpg"
    },
    {
      rank: 3,
      title: "Horizon: An American Saga",
      weekendGross: "$11.0M",
      totalGross: "$26.5M",
      weeks: 2,
      imdbUrl: "https://www.imdb.com/title/tt13560574/",
      poster: "https://m.media-amazon.com/images/M/MV5BNjhlMjQ0MjQtN2EyZS00M2M5LTlhMzMtMzM3MzU1MWMxZTlhXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_UX67_CR0,0,67,98_AL_.jpg"
    },
    {
      rank: 4,
      title: "Bad Boys: Ride or Die",
      weekendGross: "$7.9M",
      totalGross: "$187.3M",
      weeks: 6,
      imdbUrl: "https://www.imdb.com/title/tt13358894/",
      poster: "https://m.media-amazon.com/images/M/MV5BOGM3OTQ5YjgtY2YzZC00ZWE2LTliNDQtNmJhZWY2ZTlkNDRmXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_UX67_CR0,0,67,98_AL_.jpg"
    },
    {
      rank: 5,
      title: "The Bikeriders",
      weekendGross: "$6.5M",
      totalGross: "$19.2M",
      weeks: 2,
      imdbUrl: "https://www.imdb.com/title/tt11057302/",
      poster: "https://m.media-amazon.com/images/M/MV5BOGNiNGJiYTctOTFlZC00NGVlLThkYzgtZmQ4NjE1ZTY1ODliXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_UX67_CR0,0,67,98_AL_.jpg"
    },
    {
      rank: 6,
      title: "Garfield",
      weekendGross: "$4.8M",
      totalGross: "$83.1M",
      weeks: 5,
      imdbUrl: "https://www.imdb.com/title/tt5974556/",
      poster: "https://m.media-amazon.com/images/M/MV5BOWEzMGMzOTktZThmYi00ZDViLTlmZGMtNWI2NzZhYTFkYWZmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_UX67_CR0,0,67,98_AL_.jpg"
    },
    {
      rank: 7,
      title: "The Watchers",
      weekendGross: "$4.2M",
      totalGross: "$14.8M",
      weeks: 2,
      imdbUrl: "https://www.imdb.com/title/tt13433812/",
      poster: "https://m.media-amazon.com/images/M/MV5BZWNlYWRiNTQtNzM3OS00MzVmLWE0YTgtNzRlNmFiMzU0ZjI2XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_UX67_CR0,0,67,98_AL_.jpg"
    },
    {
      rank: 8,
      title: "IF",
      weekendGross: "$3.1M",
      totalGross: "$55.6M",
      weeks: 7,
      imdbUrl: "https://www.imdb.com/title/tt14849194/",
      poster: "https://m.media-amazon.com/images/M/MV5BMTYyNTk2NTk2MF5BMl5BanBnXkFtZTcwNjU4NzExMw@@._V1_UX67_CR0,0,67,98_AL_.jpg"
    },
    {
      rank: 9,
      title: "Kingdom of the Planet of the Apes",
      weekendGross: "$2.8M",
      totalGross: "$168.5M",
      weeks: 8,
      imdbUrl: "https://www.imdb.com/title/tt11389872/",
      poster: "https://m.media-amazon.com/images/M/MV5BM2FiMjUyNWQtYThiNC00ZjgzLTgxMmYtMjU1ZDlhNGM1NjE1XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_UX67_CR0,0,67,98_AL_.jpg"
    },
    {
      rank: 10,
      title: "Furiosa: A Mad Max Saga",
      weekendGross: "$1.9M",
      totalGross: "$68.3M",
      weeks: 7,
      imdbUrl: "https://www.imdb.com/title/tt12037194/",
      poster: "https://m.media-amazon.com/images/M/MV5BMTZhNjVmNzctZDBhZi00MmY3LWI2NzktYzU2YzNhMzkzMTdlXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_UX67_CR0,0,67,98_AL_.jpg"
    }
  ];
}

module.exports = { scrapeIMDb, getMockData };
