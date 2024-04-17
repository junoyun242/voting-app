import { Request, Response } from "express";
import { TVotesTable, votesTable } from "../db/schema";
import { db } from "../db/connection";
import { eq } from "drizzle-orm";

export const castVote = async (req: Request, res: Response) => {
  const body: TVotesTable = req.body;
  const { userID, optionID } = body;

  if (!optionID) {
    res.status(400).send("Bad request");
    return;
  }

  try {
    if (userID) {
      const checkDuplicate = await db
        .select()
        .from(votesTable)
        .where(eq(votesTable.userID, userID));

      if (checkDuplicate.length) {
        res.status(400).send("Vote already cast");
        return;
      }
    }

    const data = await db
      .insert(votesTable)
      .values({ userID, optionID })
      .returning();
    res.status(201).send(data[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};
