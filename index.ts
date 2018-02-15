import {getCommandsFromMultipleDefinitions} from "./src/command-generator";
import {readFile} from "fs";

readFile("./data/swagger-sample.json", "utf8", (err, data) => {
    if (err) {
        throw err;
    }
    const swaggerDefinition = JSON.parse(data).definitions;
    let commands = [];
    getCommandsFromMultipleDefinitions(swaggerDefinition).forEach((command) => {
        commands.push(command);
    });
    console.log(commands);
});