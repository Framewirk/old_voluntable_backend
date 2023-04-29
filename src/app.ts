import Express from "express";
import type { ErrorRequestHandler } from "express";

require('dotenv').config();
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

// Util Imports
import { establishDBConnection } from './utils/db';

const app = Express();
Sentry.init({
    dsn: process.env.DSN,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(Express.json());

app.get('/app/health', (req, res, next) => {
    res.status(200).json({
        'status': 'OK'
    })
});

app.use(Sentry.Handlers.errorHandler());

const errorHandler : ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json({
        'status': 'ERROR',
        'message': err.message
    })
}

app.use(errorHandler);


const mainApp : Function = async () : Promise<void> => {
    try {
        await establishDBConnection();
        app.listen(3000, () => {
            console.log(`App Listening on 3000`);
        });
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

mainApp();