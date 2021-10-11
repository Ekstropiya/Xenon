import * as https from "https";
import * as http from "http";
import * as fs from "fs";
import express from "express";
import Corrosion from "corrosion";
import { api } from "./api";
import { createConnection } from "typeorm";
import { Request, RequestHeader, Response, ResponseHeader, ResponsePayload } from "./entity";
import { formatRequest } from "./util/format";
import sha from 'sha1';

const config = require("../config.js");

const app = express();

// Import configured SSL certificates.
const ssl = {
    cert: (config.ssl["use"] || process.env["XENON_USE_SSL"]) ? fs.readFileSync(`${__dirname}/../ssl/${config.ssl["cert"]}`) : "",
    key: (config.ssl["use"] || process.env["XENON_USE_SSL"]) ? fs.readFileSync(`${__dirname}/../ssl/${config.ssl["key"]}`) : "",
};

(async () => {
    const db = (!config["container"]) ? await createConnection() : await createConnection({
        type: "postgres",
        host: process.env["XENON_DB_HOST"],
        port: parseInt(process.env["XENON_DB_PORT"] || "5432"),
        username: process.env["XENON_DB_USERNAME"],
        password: process.env["XENON_DB_PASSWORD"],
        database: "xenon_db",
        logging: false,
        synchronize: true,
        entities: [
            "./**/*.entity.js"
        ],
    });

    const middle = async (ctx) => {
        setTimeout(async () => {
            // Log request to console. Looks pretty cool.
            if (config.logging["console"]) {
                console.log(formatRequest(ctx));
            }

            // Return if some wimp doesn't want database logging.
            if (!config.logging["database"]) {
                return;
            }

            const req = new Request();
            const res = new Response();

            req.timestamp = Date.now();
            req.id = sha(req.timestamp + " " + formatRequest(ctx));
            req.method = ctx.clientRequest.method;
            req.host = ctx.url.origin;
            req.url = ctx.url.href;
            req.httpVersion = ctx.clientRequest.httpVersion;
            req.response = res;

            res.timestamp = Date.now();
            res.id = sha(res.timestamp + " " + req.id + " " + ctx.body);
            res.status = ctx.statusCode;
            res.request = req;

            req.headers = [];
            const reqHeaders = ctx.clientRequest.headers;
            for(let key in reqHeaders) {
                const header = new RequestHeader();

                header.parent = req;
                header.key = key;
                header.value = (
                    key === "host" ||
                    key === "referer"
                ) ? ctx.url.origin : reqHeaders[key];

                req.addHeader(header);
            }

            res.headers = [];
            const resHeaders = ctx.remoteResponse.headers;
            for(let key in resHeaders) {
                const header = new ResponseHeader();

                header.parent = res;
                header.key = key;
                header.value = resHeaders[key];

                res.addHeader(header);
            }

            if (ctx.body) {
                const resP = new ResponsePayload();
                resP.content = ctx.body.toString();
                resP.type = resHeaders['content-type'];

                res.payload = resP;
            }

            await db.getRepository(Request).save(req).catch(() => {});
        }, 0);
    };

    // If user has enabled SSL create an HTTPS server, otherwise, create a standard HTTP server.
    const server = (config.ssl["use"] || process.env["XENON_USE_SSL"]) ? https.createServer(ssl, app) : http.createServer(app);

    const proxy = new Corrosion({
        prefix: "/p/",
        codec: "xor",
        responseMiddleware: [ middle ],
        title: "Xenon",
    });

    proxy.bundleScripts();

    // Route requests.
    // This is for API requests.
    api(app, db);

    // This is for all requests to "/", it will try to resolve files from
    // the public directory.
    app.use("/", express.static(__dirname + "/../public"));

    // This is for proxy requests, it doesn't do anything if the request
    // doesn't start with the configured prefix.
    app.use("/", (request, response) => {
        if (request.url.startsWith(proxy["prefix"])) {
            proxy.request(request, response);
        }
    });

    // Send any upgraded requests (websocket requests) straight to the proxy.
    server.on('upgrade', (clientRequest, clientSocket, clientHead) => {
        proxy.upgrade(clientRequest, clientSocket, clientHead)
    });

    // Set listening range and port.
    server.listen(config.address["port"], () => {
        console.log("Server live on configured/default port.");
    });
})();