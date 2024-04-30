import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from 'cors';
import connectToMongoDB from './db/connectToMongoDB.js'
import authRoutes from "./routes/auth.routes.js";
import storyRoutes from "./routes/story.routes.js";

dotenv.config();
const app = express()
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join( __dirname,"/client/dist")))
app.use(cors({
    origin: '*', 
    credentials: true 
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




//authentication
app.use("/api/auth",authRoutes);
app.use("/api/story",storyRoutes)

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });

app.get('/check', (req, res) => {
    res.send('Yes you are working')
})


const port  = process.env.PORT || 8000
app.listen(port, () => {
    connectToMongoDB();
    console.log(`Hello`)
})

