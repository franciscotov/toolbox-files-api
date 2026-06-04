import { server } from './src/app.js'

server.listen(process.env.PORT || 3001, () => {
  console.log('Iniciado!', process.env.PORT || 3001)
})
