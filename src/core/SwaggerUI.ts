import * as express from 'express';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import { Environment } from './Environment';


export class SwaggerUI {

    constructor(public app: express.Application) { }

    public setup(): void {
        if (Environment.get<string>('SWAGGER_ENABLED').toLowerCase() === 'true') {
            const baseFolder = __dirname.indexOf('/src/') >= 0 ? '/src/' : '/dist/';
            const basePath = __dirname.substring(0, __dirname.indexOf(baseFolder));
            const swaggerFile = require(path.join(basePath, Environment.get<string>('SWAGGER_FILE')));
            const packageJson = require(path.join(basePath, '/package.json'));

            // Add npm infos to the swagger doc
            swaggerFile.info = {
                title: packageJson.name,
                description: packageJson.description,
                version: packageJson.version
            };

            // Initialize swagger-jsdoc -> returns validated swagger spec in json format
            const route = path.join(Environment.get<string>('APP_URL_PREFIX'), Environment.get<string>('SWAGGER_ROUTE'));
            this.app.use(route, swaggerUi.serve, swaggerUi.setup(swaggerFile));
        }
    }

}
