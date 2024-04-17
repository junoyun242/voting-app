import { Router } from "express";
import { castVote } from "../controllers/vote.controllers";

const router = Router();

router.post("/", castVote);

export default router;
