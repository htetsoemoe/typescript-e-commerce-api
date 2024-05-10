import express, {Express, Request, Response} from 'express'
import { PORT } from './secrets'
import rootRouter from './routes'
import { PrismaClient } from '@prisma/client'
import { errorMiddleware } from './middlewares/errors'
import { SignUpSchema } from './schema/users'

const app: Express = express()

export const prismaClient = new PrismaClient({
    log: ['query']
})
// .$extends({
//     query: {
//         user: {
//             create({args, query}) {
//                 args.data = SignUpSchema.parse(args.data)
//                 return query(args)
//             }
//         }
//     }
// })

app.use(express.json())
app.use('/api', rootRouter)

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`)
})