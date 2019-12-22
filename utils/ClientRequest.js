const axios = require('axios');

class Request {
    constructor(host, key) {
        this.host = host;
        this.key = key;
    }

    getRequest(request, data) {
        let URL = getUrl(request, this.host, data); // data is nullable
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
            } else if(request == 'GetServerInfo') {
                return response.data;
            } else if (request == 'GetServerStatus') {
                return response.data.attributes.state;
            } else if (request == 'IsOwner') {
                return response.data.attributes.server_owner;
            } else if (request == 'GetCPUCores') {
                return response.data.attributes.cpu.cores;
            } else if (request == 'GetCPUUsage') {
                return { "current": response.data.attributes.cpu.current, "limit": response.data.attributes.cpu.limit };
            } else if (request == "GetRAMUsage") {
                return { "current": response.data.attributes.memory.current, "limit": response.data.attributes.memory.limit };
            } else if (request == "GetDiskUsage") {
                return { "current": response.data.attributes.disk.current, "limit": response.data.attributes.disk.limit };
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

    postRequest = (request, data, data_) => { // data_ is normally the serverID
        let URL = getUrl(request, this.host, data_);
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
            if (request == 'StartServer') {
                return "Server started successfully";
            }  else if (request == "StopServer") {
                return "Server stopped successfully";
            } else if (request == "KillServer") {
                return "Server killed successfully";
            } else if (request == "RestartServer") {
                return "Server restarted successfully";
            } else if (request == "SendCommand") {
                return "Command send successfully";
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

let utilization = ["GetServerStatus", "GetCPUCores", "GetCPUUsage", "GetRAMUsage", "GetDiskUsage"];
let info = ["GetServerInfo", "IsOwner"];
let powerAction = ["StartServer", "StopServer", "KillServer", "RestartServer"];
function getUrl(request, host, data) {
    if (request == "GetAllServers") {
        return host + "/api/client";
    } else if (info.indexOf(request) > -1) {
        return host + "/api/client/servers/" + data;
    } else if (utilization.indexOf(request) > -1) {
        return host + "/api/client/servers/" + data + "/utilization"
    } else if (powerAction.indexOf(request) > -1) {
        return host + "/api/client/servers/" + data + "/power";
    } else if (request == "SendCommand") {
        return host + "/api/client/servers/" + data + "/command";
    }
}

function createError(request, err) {
    return err; // will work on this later
}

module.exports = Request;