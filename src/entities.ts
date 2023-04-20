
import { dataEntry } from './input';
import { writeFile } from './storage';
import { ids } from './utils';

export class Employee {
    #id: number;
    #validationMap: Record<string, (input: string) => string> = {
        age: (input: string): string => {
            if (!(parseInt(input) >= 18)) {
                throw new Error(`too young.`);
            }
            return input;
        },
        contact: (input: string): string => {
            if (input.split("-").some(num => Number.isNaN(num))) {
                throw new Error(`should be [int]-[int]-[int]`);
            }
            return input;
        },
        email: (input: string): string => {
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailRegex.test(input)) {
                throw new Error(`should be valid email.`);
            }
            return input;
        }
    };

    name: string;
    age: number;
    contact: string;
    email: string;

    constructor({
        id = undefined,
        name = "string",
        age = "int",
        contact = "string",
        email = "string"
    }: {
        id?: number,
        name?: string,
        age?: string | number,
        contact?: string,
        email?: string
    } = {}) {
        this.#id = id ? id : ids.next().value as number;
        this.name = name;
        this.age = age as number;
        this.contact = contact;
        this.email = email;

        if (id === undefined) {
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

    get keys(): (keyof this)[] {
        return Object.keys(this) as (keyof this)[];
    }

    get data(): string[] {
        return [this.#id?.toString() || "", ...this.keys.map(key => this[key]) as string[]]
    }

    get validationMap() {
        return this.#validationMap;
    }

    async #populate() {
        const keys = this.keys;
        const inputData = await dataEntry(this);

        keys.forEach(key => {
            this[key as keyof this] = inputData[key as keyof typeof inputData]
        })
    }

    toString(widths = new Array(this.keys.length + 1).fill(0)) {
        return [
            `id: ${this.id?.toString().padEnd(widths[0], " ")}`,
            ...this.keys.map((key, idx) => {
                return `${String(key)}: ${this[key as keyof this]?.toString().padEnd(widths[1 + idx], " ")}`;
            })
        ].join(", ");
    }
}
