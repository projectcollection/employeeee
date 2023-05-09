#! /usr/bin/env node

import { Employee } from './entities.js';
import { getFile, getFiles, deleteFile, reset } from './storage.js';
import { getColumnWidths } from './utils.js';
import config from './config.js';

const validCommands = Object.keys(config.validCommands);
const [command, ...args] = process.argv.slice(2);

export const executionMap = {
    all: (shouldReturn = true) => {
        const files = getFiles();
        const employees = files.map(fileName => {
            return getEmployeeFromFile(fileName);
        });

        if (employees.length > 0) {
            const colWidths = getColumnWidths(employees.map(emp => emp.data));
            const all = employees.map(employee => employee.toString(colWidths)).join("\n");

            if (shouldReturn) {
                return all;
            }
            console.log(all);
        } else {
            console.log("no employees found");
            printHelp();
        }
    },
    add: () => {
        new Employee();
    },
    id: (id: string | undefined = undefined) => {
        if (id && isValidID(id) || args.length > 0 && isValidID(args[0])) {
            const employeeId = id || args[0];
            try {
                const employee = getEmployeeFromFile(`${employeeId}.txt`);
                if (id) {
                    return employee;
                }
                console.log(employee.toString());
            } catch (err) {
                console.log("employee not found");
                throw new Error("employee not found");
            }
        } else {
            console.log("invalid id | emp id [id]");
            printHelp();
        }
    },
    name: (name: string | undefined = undefined) => {
        if (name || args.length > 0) {
            return viewEmployeesBy("name", name);
        } else {
            console.log("invalid name | emp name [name]");
            printHelp();
        }
    },
    email: (email: string | undefined = undefined) => {
        if (email || args.length > 0) {
            return viewEmployeesBy("email", email);
        } else {
            console.log("invalid email | emp email [email]");
            printHelp();
        }
    },
    del: (id: string | undefined = undefined) => {
        if (id && isValidID(id) || args.length > 0 && isValidID(args[0])) {
            const employeeId = id || args[0];
            try {
                deleteFile(`${employeeId}`);
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

if (validCommands.includes(command)) {
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

function viewEmployeesBy(key: "id" | "name" | "email", val: string | undefined = undefined) {
    try {
        const files = getFiles();
        const employees = files.map(fileName => {
            return getEmployeeFromFile(fileName);
        });

        const queryVal = val || args[0];

        if (employees.length > 0) {
            const matches = employees.filter(employee => {
                return employee[key] === queryVal;
            });

            if (matches.length > 0) {
                const colWidths = getColumnWidths(matches.map(emp => emp.data));
                const result = matches.map(employee => employee.toString(colWidths)).join("\n");

                if (queryVal) {
                    return result;
                }
                console.log(result);
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

