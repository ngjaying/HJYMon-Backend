import later from 'later';
import mongoose from './services/mongoose';
import md5 from 'md5';
import Monitor from './api/monitor/model';
import { crawl, jpush } from './services/crawler'
const util = require('util');
export default function cron(){
  let s = later.parse.recur().on(17,30).hour();
  //let s = later.parse.recur().every(30).second();
  let occurrences = later.schedule(s).next(10);
  for(let o of occurrences){
    console.log(o);
  }
  later.setInterval(() => {
    console.log('crawling');
    //TODO paging here
    Monitor.find().then((monitors)=>{
      for(let monitor of monitors){
          crawlMonitor(monitor);
      }
    });
	}, s);
};

const crawlMonitor = (monitor) => {
  crawl(monitor).then(result => {
    console.log(`crawl ${monitor.id}`);
    let currentMD5 = md5(monitor.value || '');
		if (md5(result.value || '') !== currentMD5){
      console.log(`crawl ${monitor.id}, update value`);
      monitor.value = result.value;
      monitor.oldMD5 = currentMD5;
      monitor.title = result.title;
      monitor.save();
      Monitor.findById(monitor.id).populate('launchies').then((monitor) => {
        console.log(`monitor value: ${monitor}`);
        return Monitor.populate(monitor, {path: 'launchies.user', model: 'User'});
      }).then((monitor) => {
        let jpushids = [];
        for(let launchy of monitor.launchies){
          console.log(`launchy:${launchy}`);
          if(launchy.user.jpushid)
            jpushids.push(launchy.user.jpushid);
        }
        console.log(`jpushids ${jpushids}`);
        if(jpushids.length > 0){
          return jpush({jpushids, notification: `${monitor.title}有更新`, message: monitor.value.substring(0, 100)});
        }
      });
    }
  });
}
