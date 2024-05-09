import {Router} from 'express'
import {login, signUp} from '../controllers/AuthController'

const authRoutes: Router = Router()

authRoutes.get('/login', login)
authRoutes.post('/signup', signUp)

export default authRoutes