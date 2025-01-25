import express from 'express'
import 'dotenv/config'
import connectDB from './config/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import authRouter from './routes/auth.route.js';
import categoryRouter from './routes/category.route.js'
import subCategoryRouter from './routes/subCategory.route.js'
import productRouter from './routes/products.route.js'

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
app.use("/api/category", categoryRouter)
app.use("/api/sub-category", subCategoryRouter)
app.use("/api/product", productRouter)


app.listen(PORT,() =>{
    console.log(`Listening to http://localhost:${PORT}/`)
    connectDB();
})