import {Pool, PoolClient} from 'pg'

export const pool = new Pool()

pool.on('error', (err, client) => {
    console.error('Error:', err)
})

export async function query(
    text: string,
    params: any[],
) {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', {text, duration, rows: res.rowCount, params})
    return res
}


export async function withTransaction(callback: (client: PoolClient) => any) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const res = callback(client)
        await client.query('COMMIT')
        return res
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
}

export async function withClient(callback: (client: PoolClient) => any) {
    const client = await pool.connect()
    try {
        return callback(client)
    } finally {
        client.release()
    }
}

export async function initDB() {
    return await withClient(async (client: PoolClient) => {
        const schemaExists = await client.query("SELECT 1 FROM pg_namespace WHERE nspname = 'crm'")
        if(schemaExists.rowCount === 0) {
            console.log("Creating schema")
            await client.query("create schema crm")
        }
        console.log("Creating table users")
        await client.query('create table if not exists crm.users (email text primary key check (email ~* \'^.+@.+\\..+$\' ), password text not null check (length(password) < 512), name text)')
        console.log("Creating table clients")
        await client.query('create table if not exists crm.clients (' +
            '  id    BIGSERIAL primary key not null,' +
            '  data     JSON not null' +
            ')')
        console.log("Creating table products")
        await client.query('create table if not exists crm.products (' +
            '  id    BIGSERIAL primary key not null,' +
            '    data JSON not null' +
            ')')
        console.log("Creating table spancos")
        await client.query('create table if not exists crm.spancos(' +
            '  id    BIGSERIAL primary key not null,' +
            '    product_id integer not null,' +
            '    data JSON not null,' +
            '    CONSTRAINT product_id_fkey FOREIGN KEY (product_id) REFERENCES crm.products(id)' +
            ')')
        console.log("Creating table offers")
        await client.query('create table if not exists crm.offers(' +
            '  id    BIGSERIAL primary key not null,' +
            '    spanco_id integer not null,' +
            '    data JSON not null,' +
            '    CONSTRAINT spanco_id_fkey FOREIGN KEY (spanco_id) REFERENCES crm.spancos(id)' +
            ')')
    })
}

export async function closeDB() {
    return pool.end()
}
