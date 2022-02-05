import {query} from "../db/db";
import {NotFound} from "../helpers/error-handler";

export type Product = {
    code: string,
    name: string,
    data: any
}


export async function createProduct(product: Product) {
    const res = await query('INSERT INTO crm.products (code, name, data) VALUES ($1, $2, $3) RETURNING code, name, data', [product.code, product.name, product.data])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw Error('Error creating product')
    }
}

export async function getProducts() {
    const res = await query('SELECT code, name, data FROM crm.products', [])
    return res.rows
}

export async function getProduct(code: string) {
    const res = await query('SELECT code, name, data FROM crm.products WHERE code = $1', [code])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('product', code)
    }
}

export async function deleteProduct(code: string) {
    return await query('DELETE FROM crm.products WHERE code = $1', [code])
}

export async function updateProduct(product: Product) {
    const res = await query('UPDATE crm.products SET name=$2, data=$3 WHERE code=$1', [product.code, product.name, product.data])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('product', product.code)
    }
}