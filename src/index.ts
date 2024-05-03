import express from 'express'

const app = express()
const PORT = 3500

app.get('/', (req, res) => {
    res.send("App is running")
})

app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`)
})