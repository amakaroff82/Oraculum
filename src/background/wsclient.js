'use strict';

import { WebSocketClient } from './lib/ws';

var wsc = new WebSocketClient();
wsc.open('ws://localhost:1337/');
wsc.onopen = function(e){
    console.log("WebSocketClient connected:");
    this.send("Connected");
}

wsc.onmessage = function(data,flags,number){
    console.log(`WebSocketClient message #${number}: `,data);
}

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
    }
});

module.exports = {
    wsc: wsc
}