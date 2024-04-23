import { Request, Response } from "express";
import {
  TVotesTable,
  optionsTable,
  pollsTable,
  votesTable,
} from "../db/schema";
import { db } from "../db/connection";
import { eq } from "drizzle-orm";
import { logger } from "../util/logger";
import dayjs from "dayjs";

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

    const poll = await db
      .select()
      .from(pollsTable)
      .innerJoin(optionsTable, eq(pollsTable.id, optionsTable.pollID))
      .where(eq(optionsTable.id, optionID));
    if (!poll) {
      res.status(400).send("Bad request");
      return;
    }

    if (dayjs(poll[0].polls.expirationDate).isBefore(dayjs())) {
      res.status(400).send("Expired");
      return;
    }

    const data = await db
      .insert(votesTable)
      .values({ userID, optionID })
      .returning();
    res.status(201).send({ vote: data[0] });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};
