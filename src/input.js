
import { createInterface } from 'readline';

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

export async function dataEntry(dataShape) {
    if (!dataShape) {
        throw new Error("dataShape need to be defined as {[key]: 'string', [key]: 'int'");
    }

    const readline = newReadLine();
    const keys = Object.keys(dataShape);

    let inputData = {};

    for (let idx in keys) {
        inputData[keys[idx]] = await ask(readline, keys[idx])
    }

    readline.close();

    //todo: validate input data type string or int
    return inputData;
}
