import req from 'request-promise';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
let reqOptions = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1)' +
      ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36',
  },
  encoding: null,
  url: null,
};

const util = require('util')
export const crawl = ({charset, url, jqpath}) => {
  console.log(`start crawl`);
  console.log(`step 0: ${util.inspect({charset, url, jqpath})}`);
  let value = [];
  let title = '';
  let c = charset;
  reqOptions.url = url;
  return req.get(reqOptions)
    .then((body) => {
      console.log(`step 1: ${util.inspect(body)}`);
      if (!c) {
        let arr = String(body).match(/<meta([^>]*?)>/g);
        if (arr) {
          for (let val of arr) {
            let match = val.match(/charset\s*=\s*(.+)"/);
            if (match && match[1]) {
              if (match[1].substr(0, 1) === '"') match[1] = match[1].substr(1);
              c = match[1].trim();
              console.log(`get charcode ${c}`);
              break;
            }
          }
        }
      }

      if (c) {
        body = iconv.decode(new Buffer(body), c);
      }

      let $ = cheerio.load(body);
      $(jqpath).each((i, elem) => {
        value.push($(elem).text().replace(/[\r\n]/g, '').trim());
      });
      title = $("title").text();
      return {title: title, value: value};
    });
}
