
import express from "express"
import connectDb from "./models/config.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import userRouter from "./routers/user.router.js"
import adminRouter from "./routers/admin.router.js"
import agentRouter from "./routers/agent.router.js"

import { fileURLToPath } from "url"

// Middlewares

const app = express();
app.use(express.json({ limit: "1gb" }));
app.use(express.urlencoded({ limit: "1gb", extended: true }));
app.use(cors({ 
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieParser())

app.use("/guarantor", userRouter);
app.use("/admin",adminRouter)
app.use("/agent",agentRouter)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ensure __dirname and path are available
app.use(express.static(path.join(__dirname,"../client/dist")))
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../client/dist/index.html"))
})
// Routes
connectDb()
// connection
const port = process.env.PORT || 7000;
app.listen(port,"0.0.0.0", () => console.log(`Listening to port ${port}`));



 


