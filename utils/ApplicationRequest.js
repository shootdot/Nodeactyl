const axios = require('axios');

class Request {
    constructor(host, key) {
        this.host = host;
        this.key = key;
    }

    getRequest = (request, data) => {
        let URL = getUrl(request, this.host, data);
        return axios.default.get(URL, {
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + this.key,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            if (request == 'GetAllServers') {
                return response.data.data;
            } else if (request == 'GetAllUsers') {
                return response.data.data;
            } else if (request == 'GetUserInfo') {
                return response.data.attributes;
            } else if (request == 'GetNodeInfo') {
                return response.data;
            } else if (request == 'GetAllNodes') {
                return response.data.data;
            }
        }).catch(error => {
            let err = createError(request, error);
            if (err != undefined) {
                return err;
            } else {
                return error;
            }
        });
    }

    postRequest = (request, data) => {
        let URL = getUrl(request, this.host, null);
        return axios({
            url: URL,
            method: 'POST',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + this.key,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
            data: data
        }).then(function (response) {
            if (request == 'CreateServer') {
                // If people want make it return the server object
                return response.data.attributes;
            } else if (request == 'CreateUser') {
                return response.data.attributes;
            } else if (request == 'CreateNode') {
                return response.data.attributes;
            }
        }).catch(function (error) {
            let err = createError(request, error);
            if (err != undefined) {
                return err;
            } else {
                return error;
            }
        });
    }
    // Third arg is nullable
    patchRequest(request, data, data1) {
        let URL = getUrl(request, this.host, data1); // _data = nullable
        return axios({
            url: URL,
            method: 'PATCH',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + this.key,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
            data: data
        }).then(function (response) {
            if (request == 'EditUser') {
                // If people want make it return the server object
                return response.data.attributes;
            } else if (request == 'CreateUser') {
                return response.data.attributes;
            }
        }).catch(function (error) {
            let err = createError(request, error);
            if (err != undefined) {
                return err;
            } else {
                return error;
            }
        });
    }

    deleteRequest(request, data) {
        let URL = getUrl(request, this.host, data); // _data = nullable
        return axios({
            url: URL,
            method: 'DELETE',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + this.key,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
            data: data
        }).then(function (response) {
            if (request == 'DeleteUser') {
                // If people want make it return the server object
                return 'User deleted successfully.';
            } else if (request == 'DeleteNode') {
                return 'Node deleted successfully';
            }
        }).catch(function (error) {
            let err = createError(request, error);
            if (err != undefined) {
                return err;
            } else {
                return error;
            }
        });
    }
}

const server = ['CreateServer', 'GetAllServers'];
const users = ['CreateUser', 'GetAllUsers'];
const user = ['EditUser', 'DeleteUser', 'GetUserInfo'];
const nodes = ['GetAllNodes', 'CreateNode'];
const node = ['GetNodeInfo', 'DeleteNode'];
function getUrl(request, host, data) { // _data = nullable
    if (user.indexOf(request) > -1) {
        return host + "/api/application/users/" + data;
    } else if (server.indexOf(request) > -1) {
        return host + "/api/application/servers";
    } else if (users.indexOf(request) > -1) {
        return host + "/api/application/users";
    } else if (node.indexOf(request) > -1) {
        return host + "/api/application/nodes/" + data;
    } else if (nodes.indexOf(request) > -1) {
        return host + "/api/application/nodes";
    }
}

function createError(request, err) {
    let error;
    if (request == 'CreateUser' || request == 'EditUser' || request == 'GetUserInfo') {
        if (err.response.status == 422) {
            error = new Error("User already exists! (Or Email/Username is existing already)");
            error.status = 422;
            return error;
        } else if (err.response.status == 404) {
            error = new Error("User does not exist!");
            error.status = 404;
            return error;
        } else {
            return err;
        }
    }
}

module.exports = Request;
