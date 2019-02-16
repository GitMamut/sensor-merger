import http from "http";
import { Fetcher } from "./fetcher";
import { logToConsole } from "./tools";

const fetcher = new Fetcher();

const server = http.createServer((function (request, myResponse) {
    logToConsole("RQ <- " + request.url);
    if (request.url == "/") {
        fetcher.fetchAll(request, myResponse);
    } else {
        myResponse.statusCode = 404;
        myResponse.end();
        logToConsole("RS -> " + myResponse.statusCode);
    }
}));
server.listen(7001);

logToConsole("Server running!");


