import {query} from "../db/db";
import {NotFound} from "../helpers/error-handler";

export type Client = {
    id: number,
    data: any
}


export async function createClient(clientData: any) {
    const res = await query('INSERT INTO crm.clients (data) VALUES ($1) RETURNING id, data', [clientData])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw Error('Error creating client')
    }
}

export async function getClients() {
    const res = await query('SELECT id, data FROM crm.clients', [])
    return res.rows
}

export async function getClient(id: number) {
    const res = await query('SELECT id, data FROM crm.clients WHERE id = $1', [id])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('client', id.toString())
    }
}

export async function deleteClient(id: number) {
    return await query('DELETE FROM crm.clients WHERE id = $1', [id])
}

export async function updateClient(client: Client) {
    const res = await query('UPDATE crm.clients SET data=$2 WHERE id=$1', [client.id, client.data])
    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('client', client.id.toString())
    }
}