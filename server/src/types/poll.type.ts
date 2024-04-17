import { TPollsTable } from "../db/schema";

export interface ICreatePollReq extends TPollsTable {
  options: string[];
}
