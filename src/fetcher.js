import fetch from "node-fetch";
import {
    logToConsole
} from "./tools";

export class Fetcher {
    constructor() {
        this.sensors = [
            "http://raspberrypi:7000",
            "http://raspberrypi:8080/commonOutdoor",
            "http://raspberrypi:8080/commonIndoor1",
            "http://raspberrypi:8080/commonIndoor2"
        ]
    }

    fetchAll(request, myResponse) {
        Promise
            .all(this.sensors.map(sensorAddress => this.fetchData(sensorAddress)))
            .then(responses => responses
                .flatMap(response => this.reformatFlat(response)))
            .then(flatResponses => this.sendReply(myResponse, flatResponses))
            .catch(e => logToConsole(e));
    }

    async fetchData(address) {
        logToConsole(`Fetching from ${address}`);
        try {
            const response = await fetch(address);
            return await response.json();
        } catch (e) {
            logToConsole(e);
            return {error: e};
        }
    }

    reformatFlat(sensorResponse) {
        if (sensorResponse.error) {
            return {
                error: sensorResponse
            };
        }
        const sensorName = sensorResponse.name;
        return sensorResponse.values.map(reading => {
            return {
                name: `${sensorName}_${reading.name}`,
                value: parseFloat(reading.value)
            };
        })
    }

    sendReply(myResponse, partialReplies) {
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
        logToConsole("RS -> " + myResponse.statusCode);
    }
}