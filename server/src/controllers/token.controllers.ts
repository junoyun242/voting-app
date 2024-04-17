import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { db } from "../db/connection";
import { pollsTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const issueToken = (req: Request, res: Response) => {
  const token = randomUUID();
  res.status(200).send({ token });
};

export const validateToken = async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) {
    res.status(400).send("Empty token");
    return;
  }
  const polls = await db
    .select()
    .from(pollsTable)
    .where(eq(pollsTable.token, token));
  if (!polls.length) {
    res.status(200).send({ empty: true });
    return;
  }

  res.status(200).send({ empty: false });
};
