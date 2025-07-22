import express from "express"

import {  createGuarantor, updateGuarantor, getWorkerWithGuarantor, getAllWorkers, getAllEndDateWorkers, getAllGuarantors, getGuarantor, getTempGuarantors, returnGuarantorFromTemp, deleteGuarantorTemporary } from "../controllers/user.controller.js"


const router = express.Router() 


// router.get("/me",protectRoute,getCurrentUser) 
// router.post("/login",loginUser) 
router.get("/temp",getTempGuarantors)
router.post("/create",createGuarantor)
router.patch("/update/:cardNumber",updateGuarantor) 
router.get("/find/worker/:residenceNumber",getWorkerWithGuarantor)
router.get("/all",getAllGuarantors)
router.get("/:cardId",getGuarantor)
router.get("/workers/get",getAllWorkers) 
router.get("/workers/endDate",getAllEndDateWorkers)
router.post("/back/:id",returnGuarantorFromTemp)
router.post("/temp/:id",deleteGuarantorTemporary)
// router.delete("/delete/:userId",protectRoute,deleteUser)
// router.post("/logout",protectRoute,logOut)
 
export default router     