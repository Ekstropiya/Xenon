import { Application, Request as ExpressRequest, Response as ExpressResponse } from "express";
import { Connection } from "typeorm";
import { Request, Response, RequestPayload, ResponsePayload } from "./entity";

/**
 * Adds API requests to an express app.
 *
 * @param app Express app.
 * @param db Database connection.
 */
export const api = (app: Application, db: Connection) => {
    app.get('/api/requests', async (req: ExpressRequest, res: ExpressResponse) => {
        const skip = parseInt(
            req.query['begin'] as string) || parseInt(req.query['b'] as string
        ) || 0;

        const take = parseInt(
            req.query['end'] as string) || parseInt(req.query['e'] as string
        ) || 15;

        const requests = await db.getRepository(Request).find({
            skip: skip,
            take: take,
            order: {
                timestamp: 'ASC'
            },
        });

        if (!requests || requests.length == 0) {
            res.send([]);
        } else {
            res.send(requests);
        }
    });

    app.get('/api/requests/:id', async (req: ExpressRequest, res: ExpressResponse) => {
        const request = await db.getRepository(Request).findOne({
            where: {
                id: req.params['id']
            },
        });

        if (!request) {
            res.sendStatus(404);
        } else {
            res.send(request);
        }
    });

    app.get('/api/requests/:id/payload', async (req: ExpressRequest, res: ExpressResponse) => {
        const payload = await db.getRepository(RequestPayload).findOne({
            where: {
                request: req.params['id']
            },
        });

        if (!payload) {
            res.sendStatus(404);
        } else {
            res.send(payload);
        }
    });

    app.get('/api/requests/:id/response/', async (req: ExpressRequest, res: ExpressResponse) => {
        const response = await db.getRepository(Response).findOne({
            where: {
                request: req.params['id']
            },
        });

        if (!response) {
            res.sendStatus(404);
        } else {
            res.send(response);
        }
    });

    app.get('/api/requests/:id/response/payload', async (req: ExpressRequest, res: ExpressResponse) => {
        const request = await db.getRepository(Request).findOne({
            where: {
                id: req.params['id']
            },
        });

        if (!request) {
            res.send(404);
            return;
        }

        const payload = await db.getRepository(ResponsePayload).findOne({
            where: {
                response: request.response
            },
        });

        if (!payload) {
            res.sendStatus(404);
        } else {
            res.send(payload);
        }
    });
}