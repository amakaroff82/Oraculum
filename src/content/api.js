'use strict';

import { cmdAddUpdatePage, cmdGetUserData, cmdGetPagesByUrls } from './../shared/types';
import { Oraculum } from './base'

export function addPage(data){
    chrome.runtime.sendMessage({
        oraculumCommand: cmdAddUpdatePage,
        oraculumData: data
    }, function(response) {
        //console.log("Response: ", response);
    });
}

export function getUserData(){
    return new Promise(function(resolve, reject){
        chrome.runtime.sendMessage({
            oraculumCommand: cmdGetUserData
        }, function(userData) {
            Oraculum.user = userData;
            resolve(Oraculum.user);
        });
    });
}

export function getPagesByUrls(urls){
    return new Promise(function(resolve, reject){
        chrome.runtime.sendMessage({
            oraculumCommand: cmdGetPagesByUrls,
            oraculumData: urls
        }, function(pages) {
            console.log("Pages: ", pages);
            resolve(pages);
        });
    });
}