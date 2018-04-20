import { cmdAddUpdatePage, cmdGetUserData, cmdGetPagesByUrls } from './../shared/types';
import { createOrUpdatePage, getPagesByUrls } from './httpclient';
import { getUserData } from './user'


export function contentHandler(msg, sender, sendResponse) {
    // catch msg only from oraculum client
    if(msg.oraculumCommand && typeof(msg.oraculumCommand) === 'number') {
        switch(msg.oraculumCommand){

            case cmdAddUpdatePage:
            {
                let user = getUserData();
                msg.oraculumData.authorId = user.id;
                createOrUpdatePage(msg.oraculumData).then((result) =>
                    sendResponse(result)
                );
                break;
            };

            case cmdGetUserData:
            {
                let user = getUserData();
                sendResponse(user);
                break;
            };

            case cmdGetPagesByUrls:
            {
                getPagesByUrls(msg.oraculumData).then(({data}) => {
                    if(data){
                        //sendResponse(JSON.stringify(data.pages))
                        sendResponse(data.pages)
                    }
                    else{
                        //sendResponse(JSON.stringify([]))
                        sendResponse([])
                    }
                });

                break;
            };
        }
    }

    return true;
}

