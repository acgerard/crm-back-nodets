import {Pool, PoolClient} from 'pg'

export const pool = new Pool(
    // {
    //     user: 'pnaz7941_crm_admin',
    //     host: 'localhost',
    //     database: 'pnaz7941_crm',
    //     // password: 'roar4a7ihs#gjXa4',
    //     password: 'password',
    //     port: 5432,
    // }
)

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
    console.log('executed query', {text, duration, rows: res.rowCount})
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

// TODO create user with read/write rights only on schema

export async function initDB() {
    return await withClient(async (client: PoolClient) => {
        const schemaExists = await client.query("SELECT 1 FROM pg_namespace WHERE nspname = 'crm'")
        if(schemaExists.rowCount === 0) {
            console.log("Creating schema")
            await client.query("create schema crm")
        }
        console.log("Creating table users")
        await client.query('create table if not exists crm.users (email text primary key check (email ~* \'^.+@.+\\..+$\' ), password text not null check (length(password) < 512))')
        console.log("Creating table clients")
        await client.query('create table if not exists crm.clients (' +
            '  id    BIGSERIAL primary key not null,' +
            '  data     JSON not null' +
            ')')
        console.log("Creating table products")
        await client.query('create table if not exists crm.products (' +
            '    code text primary key  check (length(code) < 100),' +
            '    name text,' +
            '    data JSON not null' +
            ')')
        console.log("Creating table spancos")
        await client.query('create table if not exists crm.spancos(' +
            '    product_code text not null,' +
            '    promo text not null,' +
            '    clients JSON not null,' +
            '    CONSTRAINT product_code_fkey FOREIGN KEY (product_code) REFERENCES crm.products(code),' +
            '    CONSTRAINT spanco_key PRIMARY KEY (product_code, promo)' +
            ')')
    })
}

export async function closeDB() {
    return pool.end()
}
