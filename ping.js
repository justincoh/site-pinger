"use strict";

let request = require('request'),
    async = require('async'),
    fs = require('fs'),
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

//Create/append to log
function logResults(results){
    fs.appendFile('log.txt', results +'\n', (err)=>{
        if(err){ return; }//oh well
    });
}

//ping my projects, send text if error
function pingSites(){
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
                sendText(JSON.stringify(statuses));
                return;
            }

            // write to log on success
            let res = {};
            res[Date()] = statuses;
            logResults(JSON.stringify(res))

        }
    )
}

pingSites()

module.exports = pingSites;