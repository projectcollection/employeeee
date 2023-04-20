
import { createInterface, Interface } from 'readline';
import { Employee } from './entities';

export async function dataEntry(dataShape: Employee) {
    if (!dataShape) {
        throw new Error("dataShape need to be defined as {[key]: 'string', [key]: 'int'");
    }

    const readline = newReadLine();
    const keys = dataShape.keys;

    let inputData: Record<keyof Employee, any> = (() => {
        let temp: Record<string, any> = {};
        keys.forEach(key => {
            temp[String(key)] = undefined;
        });

        return temp;
    }
    )();

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

function ask(readline: Interface, q: string): Promise<string> {
    return new Promise((resolve) => {
        readline.question(`${q}: `, (res) => {
            resolve(res);
        })
    })
}
