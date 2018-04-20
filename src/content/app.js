'use strict';

import { Oraculum, inIframe, isGoogle, initTemplates } from './base';
import { initGoogle } from './googleAgent';
import { initContentPanel } from './content';
import { getUserData } from './api';


(function(){
    if(!inIframe()) {
        console.log("getUserData")
        getUserData().then(function(user) {
            Oraculum.user = user;
            if(!user || !user.id){
                return;
            }
            initTemplates().then(function (templates) {
                // save user
                if(isGoogle()){
                    // google agent
                    initGoogle();
                }
                else{
                    // content panel
                    initContentPanel();
                }
            });
        });
    }
})();
