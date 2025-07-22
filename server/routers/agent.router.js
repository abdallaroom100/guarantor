
import {Router} from "express"
import { createAgent, deleteAgentTemporary, getAgent, getAgents, getTempAgents, returnAgentfromTemp, updateAgent } from "../controllers/agent.controller.js"



const router = Router()

router.get("/temp",getTempAgents)
router.get("/",getAgents)
router.get("/:id",getAgent)
router.post("/create",createAgent)
router.put("/:id",updateAgent)
router.post("/temp/:id",deleteAgentTemporary)
router.post("/back/:id",returnAgentfromTemp)

export default router 