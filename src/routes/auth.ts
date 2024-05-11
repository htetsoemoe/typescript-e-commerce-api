import {Router} from 'express'
import {login, signUp} from '../controllers/AuthController'
import { errorHandler } from '../error-handler'

const authRoutes: Router = Router()

authRoutes.post('/signup', errorHandler(signUp))
authRoutes.post('/login', errorHandler(login))

export default authRoutes