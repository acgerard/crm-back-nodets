import {query} from "../db/mysql-db";
import {NotFound} from "../helpers/error-handler";

export type Client = {
    id: number,
    data: any
}


export async function createClient(clientData: any) {
    const res = await query('INSERT INTO client (data) VALUES (?)', [JSON.stringify(clientData)])
    if (res.affectedRows > 0) {
        return {id: res.insertId, data: clientData}
    } else {
        throw Error('Error creating client')
    }
}

export async function getClients() {
    const res = await query('SELECT id, data FROM client', [])
    return res.map((p: any) => ({...p, data: JSON.parse(p.data)}))
}

export async function getClient(id: number) {
    const res = await query('SELECT id, data FROM client WHERE id = ?', [id])
    if (res.length > 0) {
        return {...res[0], data: JSON.parse(res[0].data)}
    } else {
        throw new NotFound('client', id.toString())
    }
}

export async function deleteClient(id: number) {
    return await query('DELETE FROM client WHERE id = ?', [id])
}

export async function updateClient(client: Client) {
    const res = await query('UPDATE client SET data=? WHERE id=?', [JSON.stringify(client.data), client.id])
    if (res.affectedRows > 0) {
        return res[0]
    } else {
        throw new NotFound('client', client.id.toString())
    }
}