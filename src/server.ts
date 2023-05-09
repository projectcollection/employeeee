import http from 'http';
import fs from 'fs';
import { join } from 'path';

import { Employee } from './entities.js';
import { executionMap } from './index.js';

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.url) {
        const [path, queryString] = req.url?.split('?');

        if (path === '/employees') {
            if (req.method == "GET") {
                if (!queryString) {
                    const allEmployees = executionMap['all']();

                    if (allEmployees) {
                        const jsonEmployees = allEmployees.split('\n').map((entry) => {
                            let json: Record<string, string> = {};

                            entry.split(',').forEach((prop) => {
                                const [key, val] = prop.split(':');
                                json[key.trim()] = val.trim();
                            });

                            return json;
                        });

                        res.setHeader('content-type', 'application/json');
                        res.statusCode = 200;
                        res.end(JSON.stringify(jsonEmployees));
                    }
                }

                const [key, val] = queryString.split('=');

                if (key === 'id') {
                    try {
                        const employee = executionMap['id'](val);

                        if (employee) {

                            let json: Record<string, string> = {};

                            employee.toString().split(',').forEach((prop) => {
                                const [key, val] = prop.split(':');
                                json[key.trim()] = val.trim();
                            });

                            res.setHeader('content-type', 'application/json');
                            res.statusCode = 200;
                            res.end(JSON.stringify(json));
                        }
                    } catch (err) {
                        res.statusCode = 404;
                        res.end('employee not found');
                    }
                } else if (key === 'name') {
                    try {
                        const matches = executionMap['name'](val);

                        if (matches) {
                            const jsonEmployees = matches.split('\n').map((entry) => {
                                let json: Record<string, string> = {};

                                entry.split(',').forEach((prop) => {
                                    const [key, val] = prop.split(':');
                                    json[key.trim()] = val.trim();
                                });

                                return json;
                            }).filter((entry) => {
                                return entry.name === val;
                            });

                            res.setHeader('content-type', 'application/json');
                            res.statusCode = 200;
                            res.end(JSON.stringify(jsonEmployees));
                        }
                    } catch (err) {
                        res.statusCode = 404;
                        res.end('employee not found');
                    }
                } else if (key === 'email') {
                    try {
                        const matches = executionMap['email'](decodeURIComponent(val));

                        if (matches) {
                            const jsonEmployees = matches.split('\n').map((entry) => {
                                let json: Record<string, string> = {};

                                entry.split(',').forEach((prop) => {
                                    const [key, val] = prop.split(':');
                                    json[key.trim()] = val.trim();
                                });

                                return json;
                            })

                            res.setHeader('content-type', 'application/json');
                            res.statusCode = 200;
                            res.end(JSON.stringify(jsonEmployees));
                        }
                    } catch (err) {
                        res.statusCode = 404;
                        res.end('employee not found');
                    }
                }

            }


            if (req.method == 'POST') {
                let chunks: Uint8Array[] = [];

                req.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                req.on('end', () => {
                    const data = Buffer.concat(chunks);

                    console.log(data.toString());
                    //todo: need validation
                    const newEmloyee = new Employee(JSON.parse(data.toString()))

                    res.setHeader('content-type', 'application/json');
                    res.statusCode = 200;
                    res.end(newEmloyee.toString());
                })
            }
        }
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


    //if (req.url === '/image' && req.method == "POST") {
    //    const contentType = req.headers['content-type']?.split('/');

    //    if (!contentType || contentType[0] != 'image') {
    //        res.end('error');
    //        return;
    //    }

    //    const path = join(`./uploadedimage.${contentType[1]}`);
    //    const imageStream = fs.createWriteStream(path);

    //    imageStream.on('open', () => {
    //        req.pipe(imageStream)
    //    });

    //    imageStream.on('close', () => {
    //        console.log('start streaming to res');
    //        fs.createReadStream(path).pipe(res);
    //    })
    //}
