import {query} from "../db/mysql-db";
import {NotFound} from "../helpers/error-handler";

export type Product = {
    id: number,
    data: any
}


export async function createProduct(product: Product): Promise<Product> {
    const res = await query('INSERT INTO product (data) VALUES (?)', [JSON.stringify(product)])
    if (res.affectedRows > 0) {
        return {id: res.insertId, data: product}
    }  else {
        throw Error('Error creating product')
    }
}

export async function getProducts() {
    const res = await query('SELECT id, data FROM product', [])
    return res.map((p: any) => ({...p, data: JSON.parse(p.data)}))
}

export async function getProduct(id: string) {
    const res = await query('SELECT id, data FROM product WHERE id = ?', [id])
    if (res.length > 0) {
        return {...res[0], data: JSON.parse(res[0].data)}
    } else {
        throw new NotFound('product', id)
    }
}

export async function deleteProduct(id: string) {
    return await query('DELETE FROM product WHERE id = ?', [id])
}

export async function updateProduct(product: Product) {
    const res = await query('UPDATE product SET data=? WHERE id=?', [JSON.stringify(product.data), product.id])
    if (res.affectedRows > 0) {
        return res[0]
    } else {
        throw new NotFound('product', product.id.toString())
    }
}