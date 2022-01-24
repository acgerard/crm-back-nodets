import {NextFunction, Request, Response} from "express";
import {execute} from "../helpers/express-helper";
import {createSpanco, deleteSpanco, getSpanco, getSpancos, updateSpanco} from "./spanco-repository";


export async function create(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await createSpanco(req.body)
        res.status(201)
        res.send({code: result.code, name: result.name, data: result.data})
    })
}

export async function get(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getSpanco(req.params.productCode, req.params.promo)
        res.send({code: result.code, name: result.name, data: result.data})
    })
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getSpancos()
        res.send(result)
    })
}

export async function del(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        await deleteSpanco(req.params.productCode, req.params.promo)
        res.send()
    })
}

export async function update(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const spanco = {clients: req.body.data, productCode: req.params.productCode, promo: req.params.promo};
        await updateSpanco(spanco)
        res.send(spanco)
    })
}