const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

const router = require('./src/route')
const bodyParser = require('body-parser')

const result = dotenv.config()
if(result.error){
    throw result.error
}

const app = express()
const port = process.env.APP_PORT

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=admin`, {
    useNewUrlParser: true,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    promiseLibrary: global.Promise,
    useUnifiedTopology: true
})
.catch(error => console.log(error))
app.use(bodyParser.json())

app.use('/', router)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app