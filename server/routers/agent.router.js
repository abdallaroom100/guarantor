
import {Router} from "express"
import { createAgent, deleteAgentTemporary, getAgent, getAgents, updateAgent } from "../controllers/agent.controller.js"



const router = Router()

router.post("/create",createAgent)
router.put("/:id",updateAgent)
router.post("/temp",deleteAgentTemporary)
router.get("/",getAgents)
router.get("/:id",getAgent)


export default router