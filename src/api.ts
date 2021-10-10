import { Application, Request as Req, Response as Res } from "express";
import { Connection } from "typeorm";
import { Request } from "./entity/request.entity";
import { Response } from "./entity/response.entity";
import { RequestPayload, ResponsePayload } from "./entity/payload.entity";

export const api = (app: Application, db: Connection) => {
    app.get('/api/requests', async (req: Req, res: Res) => {
        const skip = parseInt(req.query['begin'] as string) || parseInt(req.query['b'] as string) || 0;
        const take = parseInt(req.query['end'] as string) || parseInt(req.query['e'] as string) || 15;
        const requests = await db.getRepository(Request).find({skip: skip, take: take, order: {timestamp: 'ASC'}});

        if (!requests || requests.length == 0) {
            res.send([]);
        } else {
            res.send(requests);
        }
    });

    app.get('/api/requests/:id', async (req: Req, res: Res) => {
        const request = await db.getRepository(Request).findOne({
            where: {
                id: req.params['id']
            }
        });

        if (!request) {
            res.sendStatus(404);
        } else {
            res.send(request);
        }
    });

    app.get('/api/requests/:id/payload', async (req: Req, res: Res) => {
        const payload = await db.getRepository(RequestPayload).findOne({
            where: {
                request: req.params['id']
            }
        });

        if (!payload) {
            res.sendStatus(404);
        } else {
            res.send(payload);
        }
    });

    app.get('/api/requests/:id/response/', async (req: Req, res: Res) => {
        const response = await db.getRepository(Response).findOne({
            where: {
                request: req.params['id']
            }
        });

        if (!response) {
            res.sendStatus(404);
        } else {
            res.send(response);
        }
    });

    app.get('/api/requests/:id/response/payload', async (req: Req, res: Res) => {
        const request = await db.getRepository(Request).findOne({
            where: {
                id: req.params['id']
            }
        });

        if (!request) {
            res.send(404);
            return;
        }

        const payload = await db.getRepository(ResponsePayload).findOne({
            where: {
                response: request.response
            }
        });

        console.log(payload + ' ' + req.params['id']);

        if (!payload) {
            res.sendStatus(404);
        } else {
            res.send(payload);
        }
    });
}