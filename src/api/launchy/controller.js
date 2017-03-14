import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { crawl } from '../../services/crawler'
import { Launchy, Monitor } from '.'

const util = require('util')
export const create = ({ user, body }, res, next) =>{
  // try{
  //   let monitor = await Monitor.findOne({...body});
  //   console.log(`step 1 monitor: ${monitor}`);
  //   if(!monitor){
  //     monitor = await Monitor.create({...body});
  //   }
  //   console.log(`step 2 monitor: ${monitor}`);
  //   let launchy = await Launchy.create({ monitor, user });
  //   console.log(`step 3 launchy: ${launchy}`);
  //   monitor.launchies.push(launchy);
  //   await monitor.save();
  //   console.log(`step 4 monitor: ${monitor}`);
  //   launchy.view(true);
  //   success(res, 201);
  // }catch(next);
  console.log(`launchy create start\nstep 0 body: ${util.inspect(body)}`);
  let m;
  Monitor.findOne({...body})
    .then((monitor) => {
      console.log(`step 1 monitor: ${monitor}`);
      if(!monitor)
        return Monitor.create({...body});
    })
    .then((monitor) => {
      console.log(`step 2 monitor: ${monitor}`);
      m = monitor;
      return Launchy.create({ monitor, user, blockname: body.blockname || '' });
    })
    .then((launchy) => {
      console.log(`step 3 launchy: ${launchy}`);
      launchy.view(true);
      m.launchies.push(launchy);
      return m.save();
    })
    .then(success(res))
    .catch(next);
}

export const index = ({ user, querymen: { query, select, cursor } }, res, next) =>{
  query['user'] = user.id;
  Launchy.find(query, select, cursor)
    .populate('monitor')
    .then((launchies) => launchies.map((launchy) => launchy.view()))
    .then(success(res))
    .catch(next);
}

export const show = ({ params }, res, next) => {
  let l, r;
  Launchy.findById(params.id)
    .populate(['user', 'monitor'])
    .then(notFound(res))
    .then((launchy) => {
      console.log(`launchy show start\nstep 0 launchy: ${util.inspect(launchy)}`);
      l = launchy
      return launchy? crawl(launchy.monitor): null
    })
    .then((result) =>{
      r = result;
      console.log(`step 1 result: ${result}`);
      return Monitor.findById(l.monitor.id)
    })
    .then((monitor) =>{
      if(monitor){
        monitor.title = r.title
        monitor.value = r.value;
        console.log(`step 2 monitor: ${monitor}`);
        return monitor.save();
      }
    })
    .then((monitor) => {
      l.blockname = l.blockname || monitor.title;
      return l;
    })
    .then(success(res))
    .catch(next)
  }

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Launchy.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((launchy) => launchy ? _.merge(launchy, body).save() : null)
    .then((launchy) => launchy ? launchy.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Launchy.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((launchy) => launchy ? launchy.remove() : null)
    .then(success(res, 204))
    .catch(next)
