import {query} from "../db/db";
import {NotFound} from "../helpers/error-handler";

export type Product = {
    id: number,
    data: any
}


export async function createProduct(product: Product) {
    const res = await query('INSERT INTO crm.products (data) VALUES ($1) RETURNING id, data', [product])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw Error('Error creating product')
    }
}

export async function getProducts() {
    const res = await query('SELECT id, data FROM crm.products', [])
    return res.rows
}

export async function getProduct(id: string) {
    const res = await query('SELECT id, data FROM crm.products WHERE id = $1', [id])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('product', id)
    }
}

export async function deleteProduct(id: string) {
    return await query('DELETE FROM crm.products WHERE id = $1', [id])
}

export async function updateProduct(product: Product) {
    const res = await query('UPDATE crm.products SET data=$2 WHERE id=$1', [product.id, product.data])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('product', product.id.toString())
    }
}