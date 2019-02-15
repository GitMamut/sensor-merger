const dateFormat = require("dateformat");

function logToConsole(message) {
    let formattedDate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    console.log("[" + formattedDate + "] " + message);
}

module.exports = {logToConsole};