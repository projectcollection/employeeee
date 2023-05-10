import express from 'express';

import { executionMap } from '../index.js';
import { Employee } from '../entities.js';
import { printStrToJSON } from '../utils.js';

const router = express.Router();

router.get('/', (req, res) => {
    if (Object.keys(req.query).length === 0) {
        const allEmployees = executionMap['all']();

        if (allEmployees) {
            const jsonEmployees = allEmployees.split('\n').map((entry) => {
                return printStrToJSON(entry);
            });

            res.setHeader('content-type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(jsonEmployees));
        }
    } else {
        if (req.query.id) {
            try {
                const employee = executionMap['id'](req.query.id as string);

                if (employee) {
                    res.setHeader('content-type', 'application/json');
                    res.statusCode = 200;
                    res.end(JSON.stringify(printStrToJSON(employee.toString())));
                }
            } catch (err) {
                res.statusCode = 404;
                res.end('employee not found');
            }
        } else if (req.query.name) {
            try {
                const matches = executionMap['name'](req.query.name as string);

                if (matches) {
                    const jsonEmployees = matches.split('\n').map((entry) => {
                        return printStrToJSON(entry);
                    })

                    res.setHeader('content-type', 'application/json');
                    res.statusCode = 200;
                    res.end(JSON.stringify(jsonEmployees));
                }
            } catch (err) {
                res.statusCode = 404;
                res.end('employee not found');
            }
        } else if (req.query.email) {
            try {
                const matches = executionMap['email'](decodeURIComponent(req.query.email as string));

                if (matches) {
                    const jsonEmployees = matches.split('\n').map((entry) => {
                        return printStrToJSON(entry);
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
});

router.post('/', (req, res) => {
    //todo: need validation
    const newEmployee = new Employee(req.body)

    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(printStrToJSON(newEmployee.toString())));
});

router.delete('/', (req, res) => {
    try {
        if (req.body.id) {
            executionMap['del'](`${req.body.id}`);
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

export default router;
