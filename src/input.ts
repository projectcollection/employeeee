
import { createInterface } from 'readline';

export async function dataEntry(dataShape) {
    if (!dataShape) {
        throw new Error("dataShape need to be defined as {[key]: 'string', [key]: 'int'");
    }

    const readline = newReadLine();
    const keys = Object.keys(dataShape);

    let inputData = {};

    for (let idx in keys) {
        const input = await ask(readline, keys[idx]);
        const validation = dataShape.validationMap[keys[idx]];
        inputData[keys[idx]] = validation ? validation(input) : input;
    }

    readline.close();

    return inputData;
}

function newReadLine() {
    return createInterface({
        input: process.stdin,
        output: process.stdout
    })
}

function ask(readline, q) {
    return new Promise((resolve) => {
        readline.question(`${q}: `, (res) => {
            resolve(res);
        })
    })
}
