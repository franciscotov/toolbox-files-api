import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routesRegister from './routes/routesRegister.js'

const router = express.Router()
const server = express()

const whitelist = ['localhost', 'localhost:3000']
const corsOptions = {
  origin: whitelist
}

server.use(express.urlencoded({ extended: true, limit: '50mb' }))
// { limit: "50mb", extended: true }
server.use(express.json())
  .use(bodyParser.json())
server.use(express.json())
server.use(cors(corsOptions))

router.get('/', (_req, res) => {
  res.send('App is running...')
})

routesRegister(router)
server.use(router)

export { server }
