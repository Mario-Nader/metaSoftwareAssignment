const cookieParser = require('cookie-parser')
const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.port;
const DBcontrollers = require('./database')

app.use(cookieParser())
app.use(express.json())

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})