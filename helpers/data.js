const fs = require("fs"),
  url = require("url"),
  request = require("request"),
  cheerio = require("cheerio"),
  NodeCache = require("node-cache"),
  cacheOptions = {
    stdTTL: 3600,
  },
  cacheTwitterData = new NodeCache(cacheOptions),
  cacheSiteData = new NodeCache(cacheOptions);

const tokenFile = "./.data/token";
const tweetsDirectory = "./.data/tweets";

const existsToken = fs.existsSync(tokenFile);
const existsTweetsDirectory = fs.existsSync(tweetsDirectory);

if (!existsTweetsDirectory) {
  fs.mkdirSync(tweetsDirectory);
}

const getPageMetadataFn = (pageUrl) => {
  if (pageUrl.length > 0) {
    return new Promise((resolve, reject) => {
      let domain = url.parse(pageUrl).hostname;

      if (domain.indexOf("www.") === 0) {
        /* Remove leading www */
        domain = domain.substr(4);
      }

      const r = request.get(pageUrl, (err, res, body) => {
        if (r !== undefined) {
          const $ = cheerio.load(body);
          const pageTitle =
            $('meta[property="og:title"]').attr("content") ||
            $('meta[property="twitter:text:title"]').attr("content") ||
            $("title").text() ||
            "";
          const pageDescription =
            $('meta[name="description"]').attr("content") ||
            $('meta[name="twitter:title"]').attr("content") ||
            $('meta[property="og:title"]').attr("content") ||
            "";
          const image =
            $('meta[name="twitter:image"]').attr("content") ||
            $('meta[property="og:image"]').attr("content") ||
            "";
          const siteData = {
            title: pageTitle.trim(),
            description: pageDescription.trim(),
            image: image,
            "original-url": pageUrl,
            domain: domain,
          };

          cacheSiteData.set(pageUrl, siteData);
          return resolve(siteData);
        }
      });
    });
  } else {
    return false;
  }
};

const dataHelper = {
  storeTweetData: (tweet) => {
    let valuesSQL = [];
    fs.writeFileSync(
      `${tweetsDirectory}/${tweet.id}.json`,
      JSON.stringify(tweet),
      {
        /* flag: 'wx' */
      }
    );
  },
  getTweetData: (tweetIds, cb) => {
    let tweetData = [];

    tweetIds.forEach((id) => {
      const filePath = `${tweetsDirectory}/${id}.json`;
      tweetData.push(JSON.parse(fs.readFileSync(filePath)));
    });

    if (cb) {
      cb(tweetData);
    }
  },
  storeTwitterToken: (token, cb) => {
    fs.writeFile(tokenFile, token, (err) => {
      if (cb) {
        cb(err, token);
      }
    });
  },
  getTwitterToken: (cb) => {
    fs.readFile(tokenFile, (err, token) => {
      if (cb) {
        cb(err, token);
      }
    });
  },
  getSiteData: (pageUrl, cb) => {
    const urls = [pageUrl],
      siteInfo = cacheSiteData.get(pageUrl);

    if (!siteInfo) {
      const urls = [pageUrl];

      let actions = urls.map(getPageMetadataFn);
      let results = Promise.all(actions);

      results.then((results) => {
        if (cb) {
          cb(null, results[0]);
        }
      });
    } else {
      if (cb) {
        cb(null, siteInfo);
      }
    }
  },
};

module.exports = dataHelper;
