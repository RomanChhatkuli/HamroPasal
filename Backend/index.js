import express from 'express'
import 'dotenv/config'
import connectDB from './config/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import authRouter from './routes/auth.route.js';

const app = express();
const PORT = process.env.PORT || 8080

app.use(cors({
    origin: process.env.FRONTEND_URL?.split(','),
    credentials: true
}))

app.use(helmet({
    // for backend and frontend in differnt origin keep it false 
    crossOriginResourcePolicy: false
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

app.use("/api/auth", authRouter)


app.listen(PORT,() =>{
    console.log(`Listening to http://localhost:${PORT}/`)
    connectDB();
})