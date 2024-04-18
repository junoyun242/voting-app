import { Request, Response } from "express";
import { ICreatePollReq } from "../types/poll.type";
import { db } from "../db/connection";
import {
  TOptionsTable,
  optionsTable,
  pollsTable,
  votesTable,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../util/logger";

export const readPoll = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const poll = await db
      .select({
        poll: {
          id: pollsTable.id,
          title: pollsTable.title,
          description: pollsTable.description,
          createdAt: pollsTable.createdAt,
          expirationDate: pollsTable.expirationDate,
        },
        options: {
          id: optionsTable.id,
          option: optionsTable.option,
        },
        votes: {
          id: votesTable.id,
          userID: votesTable.userID,
          optionID: votesTable.optionID,
          createdAt: votesTable.createdAt,
        },
      })
      .from(pollsTable)
      .innerJoin(optionsTable, eq(pollsTable.id, optionsTable.pollID))
      .leftJoin(votesTable, eq(optionsTable.id, votesTable.optionID))
      .where(eq(pollsTable.token, token));

    if (!poll.length) {
      res.status(500).send("Internal server error");
      return;
    }

    const options = poll.map((elem) => elem.options);
    const uniqueOptions = options.filter((option, index) => {
      return (
        options.findIndex(
          (prevOption) => prevOption.option === option.option
        ) === index
      );
    });

    const resObj = {
      poll: poll[0].poll,
      options: uniqueOptions,
      votes: poll.map((elem) => elem.votes).filter((elem) => elem !== null),
    };
    res.status(200).send(resObj);
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const createPoll = async (req: Request, res: Response) => {
  const reqData: ICreatePollReq = req.body;
  const { title, description, token, options, expirationDate } = reqData;
  if (!title || !description || !token || options.length === 0) {
    res.status(400).send("Wrong body");
    return;
  }

  try {
    const poll = await db
      .select()
      .from(pollsTable)
      .where(eq(pollsTable.token, token));
    if (poll.length) {
      res.status(400).send("Token already exist");
      return;
    }
    const pollData = await db
      .insert(pollsTable)
      .values({ title, description, token, expirationDate })
      .returning();

    const optionsData: TOptionsTable[] = [];
    for (const option of options) {
      const data = await db
        .insert(optionsTable)
        .values({ pollID: pollData[0].id, option })
        .returning();
      optionsData.push(data[0]);
    }

    const resObj = {
      poll: pollData[0],
      options: optionsData,
    };

    res.status(201).send(resObj);
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};
