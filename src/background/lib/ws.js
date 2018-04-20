'use strict';

function WebSocketClient(){
    this.number = 0;	// Message number
    this.autoReconnectInterval = 5*1000;	// ms
}
WebSocketClient.prototype.open = function(url){
    this.url = url;
    this.instance = new WebSocket(this.url);

    this.instance.onopen = () =>{
        this.onopen();
    };

    this.instance.onmessage = (data,flags) => {
        this.number ++;
        this.onmessage(data,flags,this.number);
    };

    this.instance.onclose = (e) => {
        switch (e){
            case 1000:	// CLOSE_NORMAL
                console.log("WebSocket: closed");
                break;
            default:	// Abnormal closure
                this.reconnect(e);
                break;
        }
        this.onclose(e);
    };

    this.instance.onerror = (e) => {
        switch (e.code){
            case 'ECONNREFUSED':
                this.reconnect(e);
                break;
            default:
                this.onerror(e);
                break;
        }
    };
}

WebSocketClient.prototype.send = function(data,option) {
    try{
        this.instance.send(data,option);
    }catch (e){
        console.log("ERROR: WebSocketClient.send", e)
    }
}

WebSocketClient.prototype.reconnect = function(e) {
    console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`,e);
    this.instance.removeEventListener("open", this.instance.onopen);
    this.instance.removeEventListener("message", this.instance.onmessage);
    this.instance.removeEventListener("close", this.instance.onclose);
    this.instance.removeEventListener("error", this.instance.onerror);

    setTimeout(() => {
        console.log("WebSocketClient: reconnecting...");
        this.open(this.url);
    },this.autoReconnectInterval);
}

WebSocketClient.prototype.onopen = function(e){	console.log("WebSocketClient: open",arguments);	}
WebSocketClient.prototype.onmessage = function(data,flags,number){	console.log("WebSocketClient: message",arguments);	}
WebSocketClient.prototype.onerror = function(e){	console.log("WebSocketClient: error",arguments);	}
WebSocketClient.prototype.onclose = function(e){	console.log("WebSocketClient: closed",arguments);	}

module.exports = {
    WebSocketClient: WebSocketClient
}
