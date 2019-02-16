import dateFormat from "dateformat";

const logToConsole = (message) => {
    let formattedDate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    console.log("[" + formattedDate + "] " + message);
}

export {logToConsole};