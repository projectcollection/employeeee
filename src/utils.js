
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

//todo: write a function that takes an array of 2d string array
//and get the longest string for each column
