#! /usr/bin/env node

import { Employee } from './entities.js';
import { getFile, getFiles, deleteFile, reset } from './storage.js';
import config from './config.js';


const validCommands = Object.keys(config.validCommands);

const [command, ...args] = process.argv.slice(2);

if (!command || command === 'h') {
    printHelp();
}

if (validCommands.includes(command) || !isNaN(command)) {

    const executionMap = {
        all: () => {
            const files = getFiles();
            const employees = files.map(fileName => {
                return getEmployeeFromFile(fileName);
            });

            if (employees.length > 0) {
                console.log(employees.map(employee => employee.toString()).join("\n"));
            } else {
                console.log("no employees found");
                printHelp();
            }
        },
        add: () => {
            new Employee();
        },
        show: () => {
            if (args.length > 0 && isValidID(args[0])) {
                try {
                    const employee = getEmployeeFromFile(`${args[0]}.txt`);
                    console.log(employee.toString());
                } catch (err) {
                    console.log("employee not found");
                }
            } else {
                console.log("invalid id");
                printHelp();
            }
        },
        del: () => {
            if (args.length > 0 && isValidID(args[0])) {
                try {
                    deleteFile(`${args[0]}`);
                    console.log("delete successful");
                } catch (err) {
                    console.log(err)
                    console.log("employee not found");
                }
            } else {
                console.log("invalid id");
                printHelp();
            }
        },
        reset: () => {
            reset();
        },
        h: () => {
            printHelp();
        },
    };

    if (validCommands.length != Object.keys(executionMap).length) {
        throw new Error("validCommands and implementation doesn't match");
    }

    executionMap[command]();
}

function getEmployeeFromFile(fileName) {
    const [id, name, age, contact, email] = getFile(fileName).split(",");
    return new Employee({
        id, name, age, contact, email
    });
}

function isValidID(input) {
    return !isNaN(input[0]) &&
        parseInt(input[0]) >= 0;
}

function printHelp() {
    const commandDetails = validCommands.map(key => {
        return `- ${key}: ${config.validCommands[key][1]}`;
    }).join("\n        ");

    console.log(`
    prefix: emp
        available commands:
        ${commandDetails}
    `);
}

