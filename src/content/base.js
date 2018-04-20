'use strict';

export const Oraculum = {
    contentId: "oraculum-coresearch-main-panel",
    badgeId: "oraculum-coresearch-main-badge",
    //currentPanel: "addBookmark",
    googleLinks: [],
    globalTemplates: {},
    user: null
}

export function apiHttp(method, url, data){
    return new Promise(function(resolve){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                return resolve(this.response);
            }
        };

        xhttp.onerror = function () {
            console.log("** An error occurred during the transaction");
            return reject({
                error: "error"
            });
        };

        xhttp.open(method, url, true);
        xhttp.send(data);
    });
}

export function initTemplates(){
    return apiHttp("GET", chrome.extension.getURL("./assets/content.html")).then( (data) => {
        var div = document.createElement('div');
        div.innerHTML = data;
        var templates = {};

        div.childNodes.forEach(function(element){
            if(element.type === "text/template") {
                templates[element.id] = element.innerHTML;
            }
        });

        Oraculum.globalTemplates = templates;
    });
}

export function isGoogle() {
    return document.location.host.indexOf("www.google.com") === 0;
}

export function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

