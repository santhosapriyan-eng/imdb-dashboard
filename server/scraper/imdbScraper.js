const puppeteer = require('puppeteer');

const IMDB_URL = 'https://www.imdb.com/chart/boxoffice/';

async function scrapeIMDb() {
  let browser;

  try {
    console.log('🎬 Scraping IMDb Box Office data...');

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
    );

    await page.goto(IMDB_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Give IMDb some time to render
    await new Promise(resolve => setTimeout(resolve, 3000));

    const movies = await page.evaluate(() => {
      const data = [];

      const links = [
        ...document.querySelectorAll('a[href*="/title/"]')
      ];

      const seen = new Set();

      links.forEach((link) => {
        const title = link.innerText.trim();

        if (
          title &&
          title.length > 1 &&
          !seen.has(title)
        ) {
          seen.add(title);

          data.push({
            rank: data.length + 1,
            title,
            weekendGross: 'N/A',
            totalGross: 'N/A',
            weeks: 1,
            imdbUrl:
              'https://www.imdb.com' +
              link.getAttribute('href').split('?')[0],
            poster: ''
          });
        }
      });

      return data.slice(0, 10);
    });

    console.log(`✅ Scraped ${movies.length} movies`);

    if (movies.length === 0) {
      console.log('⚠️ Using fallback data...');
      return getMockData();
    }

    return movies;
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    return getMockData();
  } finally {
    if (browser) {
      await browser.close();
    }
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
      poster: ""
    },
    {
      rank: 2,
      title: "A Quiet Place: Day One",
      weekendGross: "$52.3M",
      totalGross: "$134.7M",
      weeks: 2,
      imdbUrl: "https://www.imdb.com/title/tt14444726/",
      poster: ""
    },
    {
      rank: 3,
      title: "Horizon: An American Saga",
      weekendGross: "$11.0M",
      totalGross: "$26.5M",
      weeks: 2,
      imdbUrl: "https://www.imdb.com/title/tt13560574/",
      poster: ""
    },
    {
      rank: 4,
      title: "Bad Boys: Ride or Die",
      weekendGross: "$7.9M",
      totalGross: "$187.3M",
      weeks: 6,
      imdbUrl: "https://www.imdb.com/title/tt13358894/",
      poster: ""
    },
    {
      rank: 5,
      title: "The Bikeriders",
      weekendGross: "$6.5M",
      totalGross: "$19.2M",
      weeks: 2,
      imdbUrl: "https://www.imdb.com/title/tt11057302/",
      poster: ""
    },
    {
      rank: 6,
      title: "Garfield",
      weekendGross: "$4.8M",
      totalGross: "$83.1M",
      weeks: 5,
      imdbUrl: "https://www.imdb.com/title/tt5779228/",
      poster: ""
    },
    {
      rank: 7,
      title: "The Watchers",
      weekendGross: "$4.2M",
      totalGross: "$14.8M",
      weeks: 2,
      imdbUrl: "https://www.imdb.com/title/tt26736843/",
      poster: ""
    },
    {
      rank: 8,
      title: "IF",
      weekendGross: "$3.1M",
      totalGross: "$55.6M",
      weeks: 7,
      imdbUrl: "https://www.imdb.com/title/tt11152168/",
      poster: ""
    },
    {
      rank: 9,
      title: "Kingdom of the Planet of the Apes",
      weekendGross: "$2.8M",
      totalGross: "$168.5M",
      weeks: 8,
      imdbUrl: "https://www.imdb.com/title/tt11389872/",
      poster: ""
    },
    {
      rank: 10,
      title: "Furiosa: A Mad Max Saga",
      weekendGross: "$1.9M",
      totalGross: "$68.3M",
      weeks: 7,
      imdbUrl: "https://www.imdb.com/title/tt12037194/",
      poster: ""
    }
  ];
}

module.exports = {
  scrapeIMDb,
  getMockData
};