const cookieParser = require('cookie-parser')
const express = require('express')
require('dotenv').config()
const port = process.env.port;
const DBcontrollers = require('./database')
const rateLimit = require('express-rate-limit')
const taskRouter = require('./routes/TasksRoutes')
const authRouter = require('./routes/AuthRoutes')
const app = express()


let limiter = rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:"you have reached the limit of requests, Please try again after one hour"
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})


app.use(limiter())
app.use(cookieParser())
app.use(express.json())
app.use('/auth',authRouter)
app.use('/task',taskRouter)