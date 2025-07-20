

import express from "express"
import { getCurrentAdmin, loginAdmin, signUpAdmin } from "../controllers/admin.controller.js"
import { protectRoute } from "../utils/protectedRoute.js"


const router =  express.Router()

router.post("/signup",signUpAdmin)
router.post("/login",loginAdmin)
router.get("/me",protectRoute,getCurrentAdmin)



export default router