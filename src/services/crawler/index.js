import req from 'request-promise';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import { jpushKey, jpushMaster } from '../../config'
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
  let value = [];
  let title = '';
  let c = charset;
  reqOptions.url = url;
  return req.get(reqOptions)
    .then((body) => {
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
      return {title: title, value: value.join('|')};
    });
}

export const jpush = ({jpushids, notification, message}) => {
  console.log(message);
  let auth = 'Basic ' + new Buffer(`${jpushKey}:${jpushMaster}`).toString("base64");
  let options = {
      uri: 'https://api.jpush.cn/v3/push',
      headers : {
        'Authorization' : auth,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
          'platform': 'all',
          'audience': 'all',
    //      audience: {registration_id: jpushids},
          'notification': {'alert': notification},
          'message': { 'msg_content': message}
      })
  };
  return req.post(options);
}
