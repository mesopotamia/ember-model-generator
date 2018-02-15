import {readFile} from "fs";
import nodemon from "nodemon";
import {cd, exec} from "shelljs";
import {getCommandsFromMultipleDefinitions} from "../command-generator";

cd("dummy-app");
exec("ember new forms --skip-bower true --skip-npm true", () => {
    /*tslint:disable:no-console*/
    console.info("FINISHED INSTALLING EMBER");
    cd("forms");

    readFile("../data/swagger-sample.json", "utf8", (err, data) => {
        if (err) {
            throw err;
        }
        const swaggerDefinition = JSON.parse(data).definitions;
        getCommandsFromMultipleDefinitions(swaggerDefinition).forEach((command) => {
            exec(command);
        });
        nodemon.emit("quit");
    });
});
