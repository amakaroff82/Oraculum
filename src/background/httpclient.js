const BASE_URL = "http://localhost:8080/oraculum";

export const createOrUpdatePage = (data) => ( graphQLMutation("createOrUpdatePage", "PageInput", data, `url`));
export const createOrUpdateUsers = (data) => ( graphQLMutation("createOrUpdateUser", "UserInput", data, `id email`));
export const getPagesByUrls = (urls) => ( graphQLQueryWithParams("pages", `_id url title author { id, picture }`, 'urls', '[String]', urls));


function apiHttp(method, url, data){
    return new Promise(function(resolve, reject){
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

        xhttp.responseType = 'json';
        xhttp.open(method, url, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");

        xhttp.send(data);
    });
}

function graphQLMutation(mutationName, mutationInput, data, mutationResult){
    return apiHttp("POST", BASE_URL, JSON.stringify({
        query: `
            mutation ${mutationName}($input: ${mutationInput}) {
              ${mutationName}(input: $input) {
                _id
                ${mutationResult}
              }
            }`,
        variables: {
            input: data
        }
    }));
}

function graphQLQuery(queryName, queryResult){
    return apiHttp("POST", BASE_URL, JSON.stringify({
        query: `
            query {
                ${queryName} {
                    ${queryResult}
                }
            }`,
        variables: {
        }
    }));
}

function graphQLQueryWithParams(queryName, queryResult, inputName, inputType, data){
    return apiHttp("POST", BASE_URL, JSON.stringify({
        query: `
            query ($data: ${inputType}){
                ${queryName} (data: $data){
                    ${queryResult}
                }
            }`,
        variables: {
            data: data
        }
    }));
}
