import express, {Application, Request, Response} from 'express'
import cors from 'cors'
import {closeDB, initDB} from "./db/mysql-db";
import {errorHandler} from "./helpers/error-handler";
import {basicAuth} from './helpers/basic-auth';
import {
    create as createClient,
    createBatch as createClients,
    del as deleteClient,
    get as getClient,
    getAll as getClients,
    update as updateClient
} from "./client/client-controller";
import {
    create as createProduct,
    del as deleteProduct,
    get as getProduct,
    getAll as getProducts,
    update as updateProduct
} from "./product/product-controller";
import {
    create as createSpanco,
    createOffer,
    del as deleteSpanco,
    delOffer,
    get as getSpanco,
    getAll as getSpancos,
    getAllOffers,
    getOffer,
    update as updateSpanco,
    updateOffer
} from "./spanco/spanco-controller";
import {authenticate, create, resetPassword, update} from "./user/user-controller";
import {createUser, isUser} from "./user/user-repository";

const app: Application = express()
app.use(express.json({limit: '500Kb'}))
app.use(cors());
const port: number = 8042

// use basic HTTP auth to secure the api
app.use(basicAuth);

app.get('/crm/health', async (req: Request, res: Response) => {
    res.send('Hello world!')
})

// routes USER
app.post('/crm/users/authenticate', authenticate)
app.post('/crm/users', create)
app.put('/crm/users/:email', update)
app.put('/crm/users/:email/reset', resetPassword)

// routes CLIENT
app.post('/crm/clients', createClient)
app.post('/crm/clients/batch', createClients)
app.get('/crm/clients', getClients)
app.get('/crm/clients/:id', getClient)
app.put('/crm/clients/:id', updateClient)
app.delete('/crm/clients/:id', deleteClient)

// routes PRODUCT
app.post('/crm/products', createProduct)
app.get('/crm/products', getProducts)
app.get('/crm/products/:id', getProduct)
app.put('/crm/products/:id', updateProduct)
app.delete('/crm/products/:id', deleteProduct)

// routes SPANCO
app.post('/crm/spancos', createSpanco)
app.post('/crm/spancos/:spancoId/offers', createOffer)
app.get('/crm/spancos', getSpancos)
app.get('/crm/spancos/:spancoId', getSpanco)
app.get('/crm/spancos/:spancoId/offers', getAllOffers)
app.get('/crm/spancos/:spancoId/offers/:offerId', getOffer)
app.put('/crm/spancos/:spancoId', updateSpanco)
app.put('/crm/spancos/:spancoId/offers/:id', updateOffer)
app.delete('/crm/spancos/:spancoId', deleteSpanco)
app.delete('/crm/spancos/:spancoId/offers/:offerId', delOffer)


const adminLogin = 'admin@dtcf.com'
const server = app.listen(port, async function () {
    try {
        console.log(`Initializing database...`)
        await initDB()
        console.log(`Database initialized!`)
        console.log("Checking admin user...")

        if(!await isUser(adminLogin)) {
            await createUser(adminLogin, 'admin', 'changeit')
            console.log(adminLogin + " user created")
        }
    } catch (e) {
        console.error(`Error initializing database`, e)
        process.exit(-1)
    }
    console.log(`App is listening on port ${port} !`)
})

app.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server')
    await closeDB()
    server.close(() => {
        console.log('HTTP server closed')
    })
})

app.use(errorHandler);

