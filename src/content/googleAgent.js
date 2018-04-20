'use strict';

import { Oraculum } from './base';

import { getPagesByUrls } from './api'
import { renderTemplate } from './content'

let timer = null;


function initGoogle(){
    tryToFetch();
}

function tryToFetch(){
    timer = setInterval(function(){
        if(fetchLinksFromGoogleResults()){
            clearInterval(timer);
            timer = null;
        }
    }, 1000);
}

function fetchLinksFromGoogleResults(){
    let links = document.querySelectorAll(".bkWMgd .g .rc .r a");

    Oraculum.googleLinks = [];

    if(links.length == 0){
        return false;
    }

    links.forEach((link) => {
        try{
            let url = link.getAttribute("ping").split("?")[1].split("&url=")[1].split("&ved=")[0];
            let title = link.innerText;

            if(url){
                Oraculum.googleLinks.push({
                    url: url,
                    title: title,
                    elementRef: link
                });
            }
        }
        catch(e){

        }
    });

    checkLinks();

    return true;
}

function checkLinks(){
    const urls = Oraculum.googleLinks.map(link => link.url);
    const pages = getPagesByUrls(urls).then(function(pages) {
        for(var i = 0; i < Oraculum.googleLinks.length; i++) {
            for (var j = 0; j < pages.length; j++) {
                if (Oraculum.googleLinks[i].url === pages[j].url) {
                    initLink(Oraculum.googleLinks[i], pages[j]);
                }
            }
        }
    });
}

function initLink(link, pageData){
    link.elementRef.parentElement.style.backgroundColor = "lightgreen";
    const template = renderTemplate("link");
    const linkPanel = link.elementRef.parentElement.appendChild(template);
    linkPanel.querySelector(".oraculum-link-author").src = pageData.author.picture;
}

module.exports = {
    initGoogle: initGoogle
}
