export default {
    validCommands: {
        all: [[], 'show all employees'],
        add: [[], 'add an employee'],
        show: [['int'], 'show employee by id'],
        del: [['int'], 'delete an employee by id'],
        reset: [[], 'delete everything'],
        h: [[], 'show this message']
    }
}
