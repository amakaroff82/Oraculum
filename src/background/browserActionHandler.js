import { contentHandler } from './contentHandler';
import { login, logout, getUserData } from './user';

export function browserActionHandler() {
    let user = getUserData()
    console.log("user: ", user)
    if(user.id){
        logoutQuestion();
        //openWindow();
    } else {
        login(() => openPage("https://www.google.com"));
    }
}

function logoutQuestion(){
    if(confirm("Do you really want to log out?")){
        logout();
    }
}

function openPage(page){
    chrome.tabs.create({ url: page });
}


function openWindow(){
    chrome.tabs.create({ url: chrome.extension.getURL('assets/oraculum.html') });
}

export function showNewIcon(){
    chrome.browserAction.setIcon({path: 'assets/logo1.png'});
}

export function showAddedIcon(){
    chrome.browserAction.setIcon({path: 'assets/logo2.png'});
}
