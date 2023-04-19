
import * as url from 'url';
import { join as pathJoin } from 'path';
import {
    readFileSync,
    readdirSync,
    existsSync,
    mkdirSync,
    rmSync,
    writeFileSync
} from 'fs';


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('..', import.meta.url));

const employeesPath = pathJoin(__dirname, 'employees');

export function getFiles() {
    try {
        return readdirSync(employeesPath).sort();
    } catch (err) {
        if (!existsSync(employeesPath)) {
            mkdirSync(employeesPath);
            return [];
        }
    }
}

export function getFile(filename) {
    return readFileSync(employeesPath + '/' + filename, {
        encoding: 'utf8'
    });
}

export function writeFile(filename, content) {
    return writeFileSync(employeesPath + '/' + filename + '.txt', content);
}

export function deleteFile(filename) {
    return rmSync(employeesPath + '/' + filename + '.txt');
}

export function reset() {
    rmSync(employeesPath, { recursive: true });
    mkdirSync(employeesPath);
}

