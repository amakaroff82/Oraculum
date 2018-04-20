'use strict';

import { Oraculum } from './base';
import { addPage } from './api';

function loadImage(path, elementId){
    var imgURL = chrome.extension.getURL(path);
    document.getElementById(elementId).src = imgURL;
}

export function initContentPanel(){
    let mainPanel = document.getElementById(Oraculum.contentId);
    if(!mainPanel){
        mainPanel = renderTemplate("main", {
            id: Oraculum.contentId
        })
        document.body.prepend(mainPanel);
    };

    // load user avatar
    let avatar = mainPanel.querySelector("#oracle_user_avatar");
    if(avatar){
        avatar.src = Oraculum.user.picture;
    };

    let badge = document.getElementById(Oraculum.badgeId);
    if(!badge) {
        badge = renderTemplate("badge", {
            id: Oraculum.badgeId
        });
        document.body.prepend(badge);
        loadImage("assets/logo.png", "oraculum-logo");
        badge.onclick = function(){
            addPage({
                url: document.location.href,
                title : document.title,
                content: document.body.innerText
            });
            mainPanel.className = "opened";
        }

        mainPanel.querySelector(".oraculum-bookmark").addEventListener("mouseleave", function(){
            mainPanel.className = "";
        });
    }

    return mainPanel;
}

export function renderTemplate(name, attr){
    let template = Oraculum.globalTemplates[name];
    if(!template)
        return;

    let el = document.createElement('div');
    if(attr){
        for(let at in attr){
            el.setAttribute(at, attr[at]);
        }
    }

    el.innerHTML = template;
    return el;
}

function showPanel(){

}

