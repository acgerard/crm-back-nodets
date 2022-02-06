import {query} from "../db/db";
import {NotFound} from "../helpers/error-handler";
import crypto from 'crypto'


const secret = process.env.SECRET_PWD || '9f4f7118-197c-4816-962b-8eaa237df6ec'

export async function isUser(login: string) {
    // query the DB
    const res = await query('SELECT email FROM crm.users WHERE email=$1', [login])

    return res.rowCount > 0
}

export async function getUser(login: string, password: string) {
    // get pass hashed
    const hashedPwd = getHashedPwd(password)

    // query the DB
    const res = await query('SELECT email, name FROM crm.users WHERE email=$1 and password=$2', [login, hashedPwd])

    if (res.rowCount > 0) {
        return res.rows[0]
    } else {
        throw new NotFound('user', login)
    }
}

export async function updatePassword(login: string, newPassword: string) {
    const hashedPwd = getHashedPwd(newPassword)
    const res = await query('UPDATE crm.users SET password=$2 WHERE email=$1', [login, hashedPwd])
    if (res.rowCount <= 0) {
        throw new NotFound('user', login)
    }
}

export async function resetPassword(login: string) {
    const password = randomPassword(12)
    const hashedPwd = getHashedPwd(password)
    const res = await query('UPDATE crm.users SET password=$2 WHERE email=$1', [login, hashedPwd])
    if (res.rowCount <= 0) {
        throw new NotFound('user', login)
    } else {
        return password
    }
}

export async function createUser(login: string, name: string, password?: string) {
    const pwd = password || randomPassword(12)
    const hashedPwd = getHashedPwd(pwd)
    const res = await query('INSERT INTO crm.users (email, name, password) VALUES ($1,$2, $3)', [login, name, hashedPwd])
    if (res.rowCount <= 0) {
        throw Error('Error creating user ' + login)
    } else {
        return pwd
    }
}

function getHashedPwd(password: string) {
    return crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex')
}

function randomPassword(length: number) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result;
}