import express, {Express, Request, Response} from 'express'

const app: Express = express()
const PORT = 3500

app.get('/', (req: Request, res: Response) => {
    res.send("App is running")
})

app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`)
})