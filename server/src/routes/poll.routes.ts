import { Router } from "express";
import { createPoll, readPoll } from "../controllers/poll.controllers";

const router = Router();

router.get("/:token", readPoll);
router.post("/", createPoll);

export default router;
