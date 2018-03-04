import {getCommandsFromMultipleDefinitions} from "../src/command-generator";
const input = document.querySelector("input");
const commandsTextArea: any = document.querySelector("#commands");
const onFileUpload = (event) => {
    const reader = new FileReader();

    reader.onload = onFileRead;

    reader.readAsText(event.target.files[0]);
};
const onFileRead = (event) => {
    const jsonObj = JSON.parse(event.target.result);
    const commands = getCommandsFromMultipleDefinitions(jsonObj.definitions);
    commandsTextArea.value = commands.join("\n");
};
input.addEventListener("change", onFileUpload);
