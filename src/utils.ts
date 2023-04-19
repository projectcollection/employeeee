
import { getFiles } from './storage.js';

function* IDGenerator() {
    const files = getFiles();

    const lastFile = files[files.length - 1];

    let id = lastFile ? parseInt(lastFile.split(".")[0]) + 1 : 0;

    while (true){
        yield id++;
    }
}

export const ids = IDGenerator();

export function getColumnWidths(table) {
    if (!table || !table[0] || table[0].length < 1) {
        throw new Error("empty table");
    }

    let columnWidths = new Array(table[0].length).fill(0);

    table.forEach((row) => {
        row.forEach((col, idx) => {
            if (col.length > columnWidths[idx]) {
                columnWidths[idx] = col.length;
            }
        })
    });

    return columnWidths;
}
