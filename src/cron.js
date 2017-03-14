import later from 'later';
import mongoose from './services/mongoose';
import md5 from 'md5';
import Monitor from './api/monitor/model';
import { crawl } from './services/crawler'
const util = require('util');
export default function cron(){
  let s = later.parse.text('at 05:30pm every day');
  //let s = later.parse.recur().every(30).second();
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
    }
    monitor.title = result.title;
    monitor.save();
  });
}
