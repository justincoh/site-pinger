"use strict";

let CronJob = require('cron').CronJob,
    pingSites = require('./ping');

/*
    Pings at 9AM and 6PM each day
    texts me if errors
    writes results to log
*/

let job = new CronJob({
    cronTime: "* * 9,18 * * *",
    onTick: pingSites,
    start: true,
    timeZone: 'America/New_York'
});
