
import express from "express"
import connectDb from "./models/config.js"
import cors from "cors"
import cookieParser from "cookie-parser"

import userRouter from "./routers/user.router.js"
import adminRouter from "./routers/admin.router.js"

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
// Routes
connectDb()
// connection
const port = process.env.PORT || 6000;
app.listen(port,"0.0.0.0", () => console.log(`Listening to port ${port}`));



 


