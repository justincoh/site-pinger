"use strict";

let request = require('request'),
    async = require('async'),
    settings = require('./settings');

let sites = settings.sites,
    statuses = {};

let twilio = require('twilio')(settings.ACCOUNT_SID, settings.AUTH_TOKEN);

//send text
function sendText(body){
    twilio.sendMessage({
        to: settings.MY_NUMBER,
        from: settings.TWILIO_NUMBER,
        body: body
    }, (err, res) =>{
            if(err) {return console.log("Twilio Error: ",err); }
        }
    )
}

//ping my projects
async.each(sites, (site, callback) => {
    request.get(site, (err, res, body) => {
        if(err){
            statuses[site] = res.statusCode;
            callback(err);
        }

        statuses[site] = res.statusCode;
        callback();
    });
}, function(err){
        if(err){
            return console.log("Error: ",err);
        }
            sendText(JSON.stringify(statuses));
    }
)
