import * as express from 'express';
import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { env } from '../../core/env';
import { Logger, LoggerInterface } from '../../decorators/Logger';


@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

    public isProduction = env.isProduction;

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public error(error: HttpError, req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.status(error.httpCode || 500);

        // Standard output of an error to the user.
        if (this.isProduction) {
            res.json({
                name: error.name,
                message: error.message,
            });
            this.log.error(error.name, error.message);
        } else {
            res.json({
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
            this.log.error(error.name, error.stack);
        }

    }

}
