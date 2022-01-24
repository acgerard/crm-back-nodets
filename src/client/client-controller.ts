import {NextFunction, Request, Response} from "express";
import {createClient, deleteClient, getClient, getClients, updateClient} from "./client-repository";
import {execute} from "../helpers/express-helper";


export async function create(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await createClient(req.body)
        res.status(201)
        res.send({id: result.id, data: result.data})
    })
}

export async function get(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getClient(parseInt(req.params.id))
        res.send({id: result.id, data: result.data})
    })
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getClients()
        res.send(result)
    })
}

export async function del(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        await deleteClient(parseInt(req.params.id))
        res.send()
    })
}

export async function update(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const client = {data: req.body.data, id: parseInt(req.params.id)};
        await updateClient(client)
        res.send(client)
    })
}