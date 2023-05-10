
type Config = {
    validCommands: Record<string, [(string)[], string]>
}
export default {
    validCommands: {
        all: [[], 'show all employees'],
        add: [[], 'add an employee'],
        id: [['int'], 'show employee by id'],
        name: [['string'], 'show employee by name'],
        email: [['string'], 'show employee by email'],
        del: [['int'], 'delete an employee by id'],
        reset: [[], 'delete everything'],
        h: [[], 'show this message']
    }
} as Config;
