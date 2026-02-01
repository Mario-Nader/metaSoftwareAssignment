const cookieParser = require('cookie-parser')
const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.port;
const DBcontrollers = require('./database')

const taskRouter = require('./routes/TasksRoutes')
const authRouter = require('./routes/AuthRoutes')



app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})

app.use(cookieParser())
app.use(express.json())
app.use('/auth',authRouter)
app.use('/task',taskRouter)