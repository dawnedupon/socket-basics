var moment = require('moment');

//Current time
var now = moment();

// console.log(now.format('X')); //Epoch time. Seconds since 1 Jan 1970
// console.log(now.format('x')); //Epoch time. Miliseconds since 1 Jan 1970
// console.log(now.valueOf()); //Javascript timestamp

var timestamp = 1495702871556;
var timestampMoment = moment.utc(timestamp);
console.log(timestampMoment.local().format('h:mma'));

//now.subtract(1, 'year');
//console.log(now.format());
//console.log(now.format('h:mma, dddd, D MMM YYYY'));
