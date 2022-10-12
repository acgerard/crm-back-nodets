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
export async function createClients(clients: any[]) {
    // check if some firstName/lastName already exists
    const alreadyExistingClients = await query('select LOWER(JSON_EXTRACT(data, \'$.firstName\')) as firstName, LOWER(JSON_EXTRACT(data, \'$.lastName\')) as lastName from client', []);
    const alreadyExisting = alreadyExistingClients.map((name: {firstName: string, lastName: string}) => (`${name.firstName}${name.lastName}`.replace(/"/g, '')))
    const filteredClients = clients.filter(client => !alreadyExisting.includes(`${client.firstName.toLowerCase()}${client.lastName.toLowerCase()}`))
    if(filteredClients.length > 0) {
        const res = await query(`INSERT INTO client (data) VALUES ${filteredClients.map(() => '(?)').join(',')}`, filteredClients.map(client => JSON.stringify(client)))
        if (res.affectedRows > 0) {
            return {count: res.affectedRows, duplicated: clients.length - filteredClients.length}
        } else {
            throw Error('Error creating clients')
        }
    }
    return {count: 0, duplicated: clients.length}
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