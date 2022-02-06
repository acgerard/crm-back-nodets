import {NextFunction, Request, Response} from "express";
import {execute, getId} from "../helpers/express-helper";
import {createProduct, deleteProduct, getProduct, getProducts, updateProduct} from "./product-repository";


export async function create(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await createProduct(req.body)
        res.status(201)
        res.send({id: result.id, data: result.data})
    })
}

export async function get(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getProduct(req.params.id)
        res.send({id: result.id, data: result.data})
    })
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getProducts()
        res.send(result)
    })
}

export async function del(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        await deleteProduct(req.params.id)
        res.send()
    })
}

export async function update(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const product = {data: req.body, id: getId(req.params.id)};
        await updateProduct(product)
        res.send(product)
    })
}