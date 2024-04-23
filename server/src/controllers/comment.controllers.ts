import { Request, Response } from "express";
import { INewCommentReq } from "../types/comment.type";
import { db } from "../db/connection";
import { pollCommentsTable } from "../db/schema";
import { desc, eq } from "drizzle-orm";

export const readComments = async (req: Request, res: Response) => {
  const { pollID } = req.params;

  if (!pollID) {
    res.status(400).send("No pollID");
    return;
  }

  try {
    const comments = await db
      .select()
      .from(pollCommentsTable)
      .where(eq(pollCommentsTable.pollID, Number(pollID)))
      .orderBy(desc(pollCommentsTable.updatedAt));
    res.status(200).send({ data: comments });
    return;
  } catch (err) {
    res.status(500).send(err);
  }
};

export const postComment = async (req: Request, res: Response) => {
  const body: INewCommentReq = req.body;
  const { pollID, content, nickname } = body;

  if (!pollID || !content) {
    res.status(400).send("Not a valid body");
    return;
  }

  try {
    const comment = await db
      .insert(pollCommentsTable)
      .values({ pollID, content, nickname })
      .returning();
    res.status(201).send(comment);
  } catch (err) {
    res.status(500).send(err);
  }
};
