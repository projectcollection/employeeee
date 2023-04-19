
import { dataEntry } from './input.js';
import { writeFile } from './storage.js';
import { ids } from './utils.js';

export class Employee {
    #id;
    #validationMap = {
        age: (input) => {
            if (!(parseInt(input) >= 18)) {
                throw new Error(`too young.`);
            }
            return input;
        },
        contact: (input) => {
            if (input.split("-").some(num => isNaN(num))) {
                throw new Error(`should be [int]-[int]-[int]`);
            }
            return input;
        },
        email: (input) => {
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailRegex.test(input)) {
                throw new Error(`should be valid email.`);
            }
            return input;
        }
    };

    constructor({
        id,
        name = "string",
        age = "int",
        contact = "string",
        email = "string"
    } = {}) {
        this.#id = id ? id : ids.next().value;
        this.name = name;
        this.age = age;
        this.contact = contact;
        this.email = email;

        if (!id) {
            this.#populate().then(() => {
                writeFile(`${this.id}`, [
                    this.id,
                    this.keys.map(key => this[key])
                ].join(","));

                console.log(this.toString());
            });
        }
    }

    get id() {
        return this.#id;
    }

    get keys() {
        return Object.keys(this)
    }

    get data() {
        return [this.#id.toString(), ...this.keys.map(key => {
            return this[key];
        })]
    }

    get validationMap() {
        return this.#validationMap;
    }

    async #populate() {
        const keys = this.keys;
        const inputData = await dataEntry(this);

        keys.forEach(key => {
            this[key] = inputData[key]
        })
    }

    toString(widths) {
        widths = widths ? widths : new Array(this.keys.length + 1).fill(0);

        return [
            `id: ${this.id.toString().padEnd(widths[0], " ")}`,
            ...this.keys.map((key, idx) => {
                return `${key}: ${this[key].toString().padEnd(widths[1 + idx], " ")}`;
            })
        ].join(", ");
    }
}
