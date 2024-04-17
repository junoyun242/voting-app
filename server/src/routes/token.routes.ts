import { Router } from "express";
import { issueToken, validateToken } from "../controllers/token.controllers";
const router = Router();

router.get("/issue", issueToken);
router.get("/validate/:token", validateToken);

export default router;
