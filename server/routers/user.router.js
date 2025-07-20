import express from "express"

import {  createGuarantor, updateGuarantor, getWorkerWithGuarantor, getAllWorkers, getAllEndDateWorkers, getAllGuarantors, getGuarantor } from "../controllers/user.controller.js"


const router = express.Router() 


// router.get("/me",protectRoute,getCurrentUser) 
// router.post("/login",loginUser) 
router.post("/create",createGuarantor)
router.patch("/update/:cardNumber",updateGuarantor) 
router.get("/find/worker/:residenceNumber",getWorkerWithGuarantor)
router.get("/all",getAllGuarantors)
router.get("/:cardId",getGuarantor)
router.get("/workers/get",getAllWorkers) 
router.get("/workers/endDate",getAllEndDateWorkers)
// router.delete("/delete/:userId",protectRoute,deleteUser)
// router.post("/logout",protectRoute,logOut)
 
export default router   