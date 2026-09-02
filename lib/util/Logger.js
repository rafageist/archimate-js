const APP_ENV = 'production';

const LOG_LEVEL = APP_ENV === 'production' ? 'warn' : 'log';

const NO_OP = (message, ...optionalParams) => {};

export class ConsoleLogger {

    constructor(options) {
        const { level } = options || {};

        this.error = console.error.bind(console);

        if (level === 'error') {
            this.warn = NO_OP;
            this.log = NO_OP;

            return;
        }

        this.warn = console.warn.bind(console);
        
        if (level === 'warn') {
            this.log = NO_OP;

            return;
        }

        this.log = console.log.bind(console);

    }

}

export const logger = new ConsoleLogger({ level: LOG_LEVEL });
