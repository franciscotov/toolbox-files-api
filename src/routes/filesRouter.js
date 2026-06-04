import { Router } from 'express'
import { getFiles, getFilesList } from '../services/filesService.js'

const userRouter = Router()

userRouter.get('/data', getFiles)
userRouter.get('/list', getFilesList)

export default userRouter
