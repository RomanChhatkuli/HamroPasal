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
import addressRouter from './routes/address.route.js'
import paymentRouter from './routes/payment.route.js'
import orderRouter from './routes/order.route.js'

const app = express();
const PORT = process.env.PORT || 8080

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(helmet({
    // for backend and frontend in differnt origin keep it false 
    crossOriginResourcePolicy: false
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

app.get("/api", (req,res) =>{
    res.json({message: "Server Working"})
})

app.use("/api/auth", authRouter)
app.use("/api/category", categoryRouter)
app.use("/api/sub-category", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/address", addressRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/order", orderRouter)

app.listen(PORT,() =>{
    console.log(`Listening to http://localhost:${PORT}/`)
    connectDB();
})