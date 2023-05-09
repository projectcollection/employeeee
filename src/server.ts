import http from 'http';

import { Employee } from './entities.js';
import { executionMap } from './index.js';

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.url) {
        const [path, queryString] = req.url?.split('?');

        if (path === '/employees') {
            switch (req.method) {
                case 'GET': {
                    if (!queryString) {
                        const allEmployees = executionMap['all']();

                        if (allEmployees) {
                            const jsonEmployees = allEmployees.split('\n').map((entry) => {
                                return strToJSON(entry);
                            });

                            res.setHeader('content-type', 'application/json');
                            res.statusCode = 200;
                            res.end(JSON.stringify(jsonEmployees));
                        }
                    } else {

                        const [key, val] = queryString.split('=');

                        if (key === 'id') {
                            try {
                                const employee = executionMap['id'](val);

                                if (employee) {
                                    res.setHeader('content-type', 'application/json');
                                    res.statusCode = 200;
                                    res.end(JSON.stringify(strToJSON(employee.toString())));
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
                                        return strToJSON(entry);
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
                                        return strToJSON(entry);
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
                    break;
                }
                case 'POST': {
                    let chunks: Uint8Array[] = [];

                    req.on('data', (chunk) => {
                        chunks.push(chunk);
                    });

                    req.on('end', () => {
                        const data = Buffer.concat(chunks);
                        //todo: need validation
                        const newEmployee = new Employee(JSON.parse(data.toString()))

                        res.setHeader('content-type', 'application/json');
                        res.statusCode = 200;
                        res.end(JSON.stringify(strToJSON(newEmployee.toString())));
                    });
                    break;
                }
                case 'DELETE': {
                    let chunks: Uint8Array[] = [];

                    req.on('data', (chunk) => {
                        chunks.push(chunk);
                    });

                    req.on('end', () => {
                        const data = JSON.parse(Buffer.concat(chunks).toString());

                        try {
                            if (data.id) {
                                executionMap['del'](`${data.id}`);
                                res.setHeader('content-type', 'application/json');
                                res.statusCode = 200;
                                res.end(JSON.stringify({ message: "deleted" }));
                            }

                        } catch (err) {
                            res.setHeader('content-type', 'application/json');
                            res.statusCode = 404;
                            res.end(JSON.stringify({ message: "not found" }));
                        }
                    });
                }
            }
        }
    }
});

function strToJSON(str: string) {
    let json: Record<string, string> = {};

    str.split(',').forEach((prop) => {
        const [key, val] = prop.split(':');
        json[key.trim()] = val.trim();
    });

    return json;
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
