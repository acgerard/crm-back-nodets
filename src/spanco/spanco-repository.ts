import {query} from "../db/mysql-db";
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


export async function createSpanco(productId: number, data: any): Promise<Spanco> {
    const res = await query('INSERT INTO spanco (product_id, data) VALUES (?, ?)', [productId, JSON.stringify(data)])
    if (res.affectedRows > 0) {
        return {id: res.insertId, data: data, product_id: productId}
    } else {
        throw Error('Error creating spanco')
    }
}
export async function createSpancoOffer(spancoId: number, data: any): Promise<SpancoOffer> {
    const res = await query('INSERT INTO offer (spanco_id, data) VALUES (?, ?)', [spancoId, JSON.stringify(data)])
    if (res.affectedRows > 0) {
        return {id: res.insertId, data: data, spanco_id: spancoId}
    } else {
        throw Error('Error creating spanco offer')
    }
}

export async function getSpancos(): Promise<{id: number; product_id: number; data: any; nb_offers: number}[]> {
    return await query('SELECT s.id, s.product_id , s.data, count(o.id) as nb_offers FROM spanco s left join offer o on o.spanco_id = s.id GROUP BY s.id ', [])
}

export async function getSpanco(id: string) {
    const res = await query('SELECT id, product_id, data FROM spanco WHERE id=?', [id])
    if (res.length > 0) {
        return res[0]
    } else {
        throw new NotFound('spanco', id)
    }
}

export async function getSpancoOffers(spancoId: string): Promise<{id: number; spanco_id: number; data: any}[]> {
    return await query('SELECT id, spanco_id, data FROM offer WHERE spanco_id=?', [spancoId])
}
export async function getSpancoOffer(spancoId: string, id: string) {
    const res = await query('SELECT id, spanco_id, data FROM offer WHERE spanco_id=? and id=?', [spancoId, id])
    if (res.length > 0) {
        return res[0]
    } else {
        throw new NotFound('offers', id)
    }
}

export async function deleteSpanco(id: string) {
    // delete offers first
    await query('DELETE FROM offer WHERE spanco_id = ?', [id])
    // then spanco
    return await query('DELETE FROM spanco WHERE id = ?', [id])
}

export async function deleteSpancoOffer(id: string) {
    return await query('DELETE FROM offer WHERE id = ?', [id])
}

export async function updateSpanco(spanco: Spanco) {
    const res = await query('UPDATE spanco SET data=? WHERE id = ?', [JSON.stringify(spanco.data), spanco.id])
    if (res.affectedRows > 0) {
        return res[0]
    } else {
        throw new NotFound('offer', spanco.id.toString())
    }
}

export async function updateSpancoOffer(offer: SpancoOffer) {
    const res = await query('UPDATE offer SET data=? WHERE id = ?', [JSON.stringify(offer.data), offer.id])
    if (res.affectedRows > 0) {
        return res[0]
    } else {
        throw new NotFound('offer', offer.id.toString())
    }
}