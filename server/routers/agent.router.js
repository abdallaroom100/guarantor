
import {Router} from "express"
import { createAgent, deleteAgentTemporary, getAgent, getAgents, updateAgent } from "../controllers/agent.controller.js"



const router = Router()

router.post("/create",createAgent)
router.put("/:cardNumber",updateAgent)
router.post("/temp",deleteAgentTemporary)
router.get("/",getAgents)
router.get("/:cardId",getAgent)


export default router