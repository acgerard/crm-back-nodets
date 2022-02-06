import {NextFunction, Request, Response} from "express";
import {execute, getId} from "../helpers/express-helper";
import {
    createSpanco,
    deleteSpanco,
    getSpanco,
    getSpancos,
    updateSpanco,
    updateSpancoOffer,
    createSpancoOffer,
    deleteSpancoOffer,
    getSpancoOffer, getSpancoOffers
} from "./spanco-repository";


export async function create(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await createSpanco(req.body.productId, req.body.data)
        res.status(201)
        res.send({id: result.id, productId: result.product_id, data: result.data})
    })
}
export async function createOffer(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await createSpancoOffer(req.body.spancoId, req.body.data)
        res.status(201)
        res.send({id: result.id, spancoId: result.spanco_id, data: result.data})
    })
}

export async function get(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getSpanco(req.params.spancoId)
        res.send({id: result.id, productId: result.product_id, data: result.data})
    })
}
export async function getOffer(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getSpancoOffer(req.params.spancoId, req.params.id)
        res.send({id: result.id, spancoId: result.spanco_id, data: result.data})
    })
}

export async function getAllOffers(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getSpancoOffers(req.params.spancoId)
        res.send(result.map(offer => {return {id: offer.id, spancoId: offer.spanco_id, data: offer.data}}))
    })
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getSpancos()
        res.send(result.map(spanco => {return { id: spanco.id, productId: spanco.product_id, data: spanco.data, nbOffers: spanco.nb_offers}}))
    })
}

export async function del(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        await deleteSpanco(req.params.spancoId)
        res.send()
    })
}

export async function delOffer(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        await deleteSpancoOffer(req.params.id)
        res.send()
    })
}

export async function update(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const spanco = {data: req.body.data, product_id: getId(req.body.productId), id: getId(req.params.spancoId)};
        await updateSpanco(spanco)
        res.send(spanco)
    })
}
export async function updateOffer(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const offer = {data: req.body.data, spanco_id: getId(req.params.spancoId), id: getId(req.params.id)};
        await updateSpancoOffer(offer)
        res.send(offer)
    })
}