import { Router } from "express";
import { postComment, readComments } from "../controllers/comment.controllers";

const router = Router();

router.get("/comments/:pollID", readComments);
router.post("/comment", postComment);

export default router;
