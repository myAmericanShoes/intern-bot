//import { captureCompare } from '/compareLists.js';

/****************************/
//____Supported_Triggers____//

var regID = "Bot regID is: 10x24x19xAA";
var statusFlag = 0;
var hp = 0;
const captureCompare = [/^\Nico$/, /^\Eat a rock$/, /^\\roll d20$/, /^\/roll d20$/, /^\\reg$/, /^\\status$/, /^\hp$/, /^\attack$/, /^\Josh$/, /^\Coolest$/, /^\coolest$/, /^\Happy New Year!$/, /^\Raphtalia$/];
const responseGrid = ["I like rocks XD", "eat", "roll", "roll", regID, "status", "hp", "attack", "Josh-Sama!", "God-Damn-Coolest-O", "God-Damn-Coolest-O", "Reminder: Happy God Damn New Year!", "NAOFUMI-SAMA!"];


/***************************/


var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\eric$/;
  //var botRegex2 = /^\Eric$/;
  //var botRegex3 = /^\overlord$/;
  //var botRegex4 = captureCompare[0];

 for (var i = 0; i < captureCompare.length; i++) {

    botRegex = captureCompare[i];
    
    if(request.text.toLowerCase() && botRegex.test(request.text)) {
    
      this.res.writeHead(200);
      postMessage(responseGrid[i], i);
      this.res.end();
      i = captureCompare.length;
    }
  }

  /*
  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage(" ");
    this.res.end();
  } else if(request.text && botRegex2.test(request.text)) {
    this.res.writeHead(200);
    postMessage(" ");
    this.res.end();
  } else if(request.text && botRegex3.test(request.text)) {
    this.res.writeHead(200);
    postMessage("overlord");
    this.res.end();
  } else if(request.text && botRegex4.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end("/reg");
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }*/
}

function postMessage(input, index) {
  var botResponse, options, body, botReq;

  botResponse = responseGrid[index];
  
  if (input == "status") {
    
    if (statusFlag == 0) { botResponse = "Status: CRITICALLY-NORMAL, eEt mOr cHicKn"; }
    else { botResponse = "Status: BAD"; }
  }
  
  if (input == "roll") {
   
    rollnumber = Math.floor(Math.random() * 20) + 1;
    botResponse = rollnumber.toString();
  }
  
  if (input == "eat") {
   
    rollnumber = Math.floor(Math.random() * 20) + 1;
    botResponse = "Nico ate a rock and gained +" + rollnumber.toString() + " HP";
    hp = hp + rollnumber;
  }

  if (input == "hp") {
    botResponse = "Nico's current health is: " + hp.toString() + " HP";
  }
  
  if (input == "attack") {
    rollnumber = Math.floor(Math.random() * 20) + 1;
    botResponse = "You attack with your great sword, Nico takes " + rollnumber.toString() + " damage";
    hp = hp - rollnumber;
    if (hp < 0) {
      hp = 0;
    }
  }

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
