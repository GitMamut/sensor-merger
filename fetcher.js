const fetch = require("node-fetch");
const tools = require("./tools")

const sensors = [
    "http://raspberrypi:7000",
    "http://raspberrypi:8080/commonOutdoor",
    "http://raspberrypi:8080/commonIndoor1",
    "http://raspberrypi:8080/commonIndoor2"
]

const fetchAll = (request, myResponse) => {
    Promise
        .all(sensors.map(sensorAddress => fetchData(sensorAddress)))
        .then(responses => responses
            .flatMap(response => reformatFlat(response)))
        .then(flatResponses => sendReply(myResponse, flatResponses));
};

const fetchData = (address) => {
    tools.logToConsole(`Fetching from ${address}`);
    return fetch(address)
        .then(response => response.json())
        .catch(e => e);
}

const reformatFlat = (sensorResponse) => {
    if (sensorResponse.error) {
        return {
            error: sensorResponse
        };
    }
    sensorName = sensorResponse.name;
    return sensorResponse.values.map(reading => {
        return {
            name: `${sensorName}_${reading.name}`,
            value: parseFloat(reading.value)
        };
    })
}

const sendReply = (myResponse, partialReplies) => {
    let correctReplies = {};
    let errorReplies = [];
    partialReplies.forEach(reply => {
        if (!reply.error) {
            correctReplies[reply.name] = reply.value;
        } else {
            errorReplies.push(reply.error);
        }
    });

    myResponse.writeHead(200, {
        "Content-type": "text/json"
    });
    myResponse.end(JSON.stringify({
        date: new Date().getTime(),
        sensorReadings: correctReplies,
        errors: errorReplies
    }));
    tools.logToConsole("RS -> " + myResponse.statusCode);
}

module.exports = {
    fetchAll
};