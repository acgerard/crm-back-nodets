import {query} from "../db/db";
import {NotFound} from "../helpers/error-handler";

export type Spanco = {
    productCode: string,
    promo: string,
    clients: any
}


export async function createSpanco(spanco: Spanco) {
    const res = await query('INSERT INTO crm.spancos (product_code, promo, clients) VALUES ($1, $2, $3) RETURNING code, name, data', [spanco.productCode, spanco.promo, spanco.clients])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw Error('Error creating spanco')
    }
}

export async function getSpancos() {
    const res = await query('SELECT product_code, promo, clients FROM crm.spancos', [])
    return res.rows
}

export async function getSpanco(productCode: string, promo: string) {
    const res = await query('SELECT product_code, promo, clients FROM crm.spancos WHERE product_code = $1 and promo=$2', [productCode, promo])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('spanco', `${productCode}-${promo}`)
    }
}

export async function deleteSpanco(productCode: string, promo: string) {
    return await query('DELETE FROM crm.spancos WHERE product_code = $1 and promo=$2', [productCode, promo])
}

export async function updateSpanco(spanco: Spanco) {
    const res = await query('UPDATE crm.code SET clients=$3 WHERE product_code = $1 and promo=$2', [spanco.productCode, spanco.promo, spanco.clients])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('spanco', `${spanco.productCode}-${spanco.promo}`)
    }
}