const fetcher = require("./fetcher");
const http = require('http');
const tools = require("./tools")

var server = http.createServer((function (request, myResponse) {
    tools.logToConsole("RQ <- " + request.url);
    if (request.url == "/") {
        fetcher.fetchAll(request, myResponse);
    } else {
        myResponse.statusCode = 404;
        myResponse.end();
        tools.logToConsole("RS -> " + myResponse.statusCode);
    }
}));
server.listen(7001);

tools.logToConsole("Server running");


