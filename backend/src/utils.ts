
import { getFiles } from './storage.js';

function* IDGenerator() {
    const files = getFiles();
    files.sort((a, b) => {
        const intA = parseInt(a.split('.')[0]);;
        const intB = parseInt(b.split('.')[0]);
        if (intA === intB) {
            return 0;
        }
        if (intA > intB) {
            return 1;
        }
        return -1;
    })

    const lastFile = files[files.length - 1];

    let id = lastFile ? parseInt(lastFile.split(".")[0]) + 1 : 0;

    while (true) {
        yield id++;
    }
}

export const ids = IDGenerator();

export function getColumnWidths(table: string[][]) {
    let columnWidths: number[] = new Array(table[0].length).fill(0);

    table.forEach((row) => {
        row.forEach((col, idx) => {
            if (col.length > columnWidths[idx]) {
                columnWidths[idx] = col.length;
            }
        })
    });

    return columnWidths;
}

export function printStrToJSON(str: string) {
    let json: Record<string, string> = {};

    str.split(',').forEach((prop) => {
        const [key, val] = prop.split(':');
        json[key.trim()] = val.trim();
    });

    return json;
}
