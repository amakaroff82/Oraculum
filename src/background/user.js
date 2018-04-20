import { createOrUpdateUsers } from './httpclient';

const INVALID_CREDENTIALS = "Invalid Credentials";

let userData = null;

export function getUserData(){
    return Object.assign({}, userData);
};

export function checkUserToken(callback) {
    chrome.storage.sync.get("token", function(data) {
        if(data.token){
            console.log("get token from cache", data.token);
            handleToken(data.token, callback);
        } else {
            // nothing to do
        }
    });
}

export function login(callback){
    chrome.identity.getAuthToken({
        interactive: true
    }, function(token) {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            return;
        }

        chrome.storage.sync.set({"token": token}, function () {

        });

        handleToken(token, callback);
    });
}

export function logout(){
    chrome.storage.sync.get("token", function(data) {
        if(data.token){
            chrome.storage.sync.set({"token": null});
            chrome.identity.removeCachedAuthToken({
                'token': data.token
            }, function(){

                window.fetch(`https://accounts.google.com/o/oauth2/revoke?token=${data.token}`).then(function(response){
                    console.log(response)
                }).catch(function(err){
                    console.log("err: ", err)
                })

                /*chrome.identity.launchWebAuthFlow(
                    {
                        'url': 'https://accounts.google.com/logout',
                        'interactive': true
                    },
                    function(tokenUrl) {
                        //responseCallback();
                    }
                );*/

                userData = null;
                alert("See you soon!!!")
            });
        }
    });
}

export function handleToken(token, callback){
    loadUserData(token).then(
        function (user) {
            createOrUpdateUsers(user).then(function (res) {
                console.log("load user:", user);
                userData = user;
                callback();
                //startApp();
            });
        },
        function (err) {
            console.log("error handle token");
            if(err.error && err.error.message === INVALID_CREDENTIALS) {
                // remove token and relogin
                console.log("remove invalid token");
                chrome.identity.removeCachedAuthToken(
                    { 'token': token },
                    () => {
                        console.log("try to relogin");
                        return login(callback);
                    }
                );
            }else{
                console.log("Error: ", err);
            };
        });
}

export function loadUserData(token){
    return new Promise(function(resolve, reject) {
        var x = new XMLHttpRequest();
        x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
        x.onload = function () {
            if (this.status === 401) {
                // This status may indicate that the cached
                // access token was invalid. Retry once with
                // a fresh token.
                reject({
                    error: {
                        message: INVALID_CREDENTIALS,
                        code: 401
                    }
                });
                return;
            }

            resolve(JSON.parse(x.response));
        };
        x.onerror = function(err){
            reject(err);
        };
        x.send();
    });
}

