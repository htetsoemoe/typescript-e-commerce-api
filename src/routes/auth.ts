import {Router} from 'express'
import {login} from '../controllers/AuthController'

const authRoutes: Router = Router()

authRoutes.get('/login', login)

export default authRoutes