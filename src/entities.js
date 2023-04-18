
import { dataEntry } from './input.js';
import { writeFile } from './storage.js';
import { ids } from './utils.js';

export class Employee {
    #id;

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
                    Object.keys(this).map(key => this[key])
                ].join(","));

                console.log(this.toString());
            });
        }
    }

    get id() {
        return this.#id;
    }

    async #populate() {
        const keys = Object.keys(this);
        const inputData = await dataEntry(this);

        keys.forEach(key => {
            this[key] = inputData[key]
        })
    }

    toString() {
        return [
            `id: ${this.id}`,
            ...Object.keys(this).map(key => {
                return `${key}: ${this[key]}`;
            })
        ].join(", ");
    }
}
