import { createPool } from 'mysql2'


const pool = createPool({
    connectionLimit: 5,
    host            : process.env.MYSQL_HOST || 'localhost',
    user            : process.env.MYSQL_USER || 'crm_admin',
    password        : process.env.MYSQL_PASSWORD || 'password',
    database        : process.env.MYSQL_DATABASE || 'crm',
    port        : Number(process.env.MYSQL_PORT) || 3308,
}).promise()

export async function query(
    text: string,
    params: any[],
): Promise<any> {
    const start = Date.now()
    const [rows, fields] = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', {text, duration, params})
    return rows
}


export async function initDB() {
    console.log('Creating user table')
    await query("create table if not exists user (id serial primary key, email varchar(100) unique, name varchar(100), password varchar(512) not null)", [])
    console.log('Creating client table')
    await query('create table if not exists client (id serial primary key, data JSON)', [])
    console.log('Creating product table')
    await query('create table if not exists product (id serial primary key, data JSON)', [])
    console.log('Creating spanco table')
    await query('create table if not exists spanco (id serial primary key, product_id bigint unsigned, data JSON, ' +
        'foreign key spanco_product_id (product_id) references product(id))', [])
    console.log('Creating offer table')
    await query('create table if not exists offer (id serial primary key, spanco_id bigint unsigned, data JSON, ' +
        'foreign key offer_spanco_id (spanco_id) references spanco(id))', [])



}

export async function closeDB() {
    return pool.end()
}
