#! /usr/bin/env node

import { Employee } from './entities';
import { getFile, getFiles, deleteFile, reset } from './storage';
import { getColumnWidths } from './utils';
import config from './config';

const validCommands = Object.keys(config.validCommands);
const [command, ...args] = process.argv.slice(2);

if (validCommands.includes(command)) {
    const executionMap = {
        all: () => {
            const files = getFiles();
            const employees = files.map(fileName => {
                return getEmployeeFromFile(fileName);
            });

            if (employees.length > 0) {
                const colWidths = getColumnWidths(employees.map(emp => emp.data));

                console.log(employees.map(employee => employee.toString(colWidths)).join("\n"));
            } else {
                console.log("no employees found");
                printHelp();
            }
        },
        add: () => {
            new Employee();
        },
        id: () => {
            if (args.length > 0 && isValidID(args[0])) {
                try {
                    const employee = getEmployeeFromFile(`${args[0]}.txt`);
                    console.log(employee.toString());
                } catch (err) {
                    console.log("employee not found");
                }
            } else {
                console.log("invalid id | emp id [id]");
                printHelp();
            }
        },
        name: () => {
            if (args.length > 0) {
                viewEmployeesBy("name");
            } else {
                console.log("invalid name | emp name [name]");
                printHelp();
            }
        },
        email: () => {
            if (args.length > 0) {
                viewEmployeesBy("email");
            } else {
                console.log("invalid email | emp email [email]");
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
                console.log("invalid id | emp del [id]");
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

    executionMap[command as keyof typeof executionMap]();
} else {
    printHelp();
}

function getEmployeeFromFile(fileName: string) {
    const [id, name, age, contact, email] = getFile(fileName).split(",");
    return new Employee({
        id: parseInt(id), name, age, contact, email
    });
}

function viewEmployeesBy(key: "id" | "name" | "email") {
    try {
        const files = getFiles();
        const employees = files.map(fileName => {
            return getEmployeeFromFile(fileName);
        });

        if (employees.length > 0) {
            const matches = employees.filter(employee => {
                return employee[key] === args[0]
            });

            if (matches.length > 0) {
                const colWidths = getColumnWidths(matches.map(emp => emp.data));
                console.log(matches.map(employee => employee.toString(colWidths)).join("\n"));
            } else {
                console.log("no employees found");
            }
        }
    } catch (err) {
        console.log("employee not found");
    }
}

function isValidID(input: string) {
    return !Number.isNaN(input[0]) &&
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

