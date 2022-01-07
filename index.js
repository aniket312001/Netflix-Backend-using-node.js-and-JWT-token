const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const movieRoute = require('./routes/movies')
const listRoute = require('./routes/list')


dotenv.config()


mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("Db Connected ..."))
    .catch(err=>console.log(err))


app.use(express.json())

app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api/movie",movieRoute)
app.use("/api/list",listRoute)

app.listen(8800,()=>console.log("Server is running ...."))