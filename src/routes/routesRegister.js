import filesRouter from './filesRouter.js'

function routesRegister (router) {
  router.use('/files', filesRouter)
}

export default routesRegister
