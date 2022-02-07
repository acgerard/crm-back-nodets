import {query} from "../db/db";
import {NotFound} from "../helpers/error-handler";

export type Spanco = {
    id: number,
    product_id: number,
    data: any
}
export type SpancoOffer = {
    id: number,
    spanco_id: number,
    data: any
}


export async function createSpanco(productId: number, data: any) {
    const res = await query('INSERT INTO crm.spancos (product_id, data) VALUES ($1, $2) RETURNING id, product_id, data', [productId, data])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw Error('Error creating spanco')
    }
}
export async function createSpancoOffer(spancoId: number, data: any) {
    const res = await query('INSERT INTO crm.offers (spanco_id, data) VALUES ($1, $2) RETURNING id, spanco_id, data', [spancoId, data])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw Error('Error creating spanco offer')
    }
}

export async function getSpancos(): Promise<{id: number; product_id: number; data: any; nb_offers: number}[]> {
    const res = await query('SELECT s.id, s.product_id , s.data, count(o.id) as nb_offers FROM crm.spancos s left join crm.offers o on o.spanco_id = s.id GROUP BY s.id ', [])
    return res.rows
}

export async function getSpanco(id: string) {
    const res = await query('SELECT id, product_id, data FROM crm.spancos WHERE id=$1', [id])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('spanco', id)
    }
}

export async function getSpancoOffers(spancoId: string) {
    const res = await query('SELECT id, spanco_id, data FROM crm.offers WHERE spanco_id=$1', [spancoId])
    return res.rows
}
export async function getSpancoOffer(spancoId: string, id: string) {
    const res = await query('SELECT id, spanco_id, data FROM crm.offers WHERE spanco_id=$1 and id=$2', [spancoId, id])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('offers', id)
    }
}

export async function deleteSpanco(id: string) {
    // delete offers first
    await query('DELETE FROM crm.offers WHERE spanco_id = $1', [id])
    // then spanco
    return await query('DELETE FROM crm.spancos WHERE id = $1', [id])
}

export async function deleteSpancoOffer(id: string) {
    return await query('DELETE FROM crm.offers WHERE id = $1', [id])
}

export async function updateSpanco(spanco: Spanco) {
    const res = await query('UPDATE crm.spancos SET data=$2 WHERE id = $1', [spanco.id, spanco.data])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('offer', spanco.id.toString())
    }
}

export async function updateSpancoOffer(offer: SpancoOffer) {
    const res = await query('UPDATE crm.offers SET data=$2 WHERE id = $1', [offer.id, offer.data])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('offer', offer.id.toString())
    }
}