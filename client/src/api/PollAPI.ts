import {
  ICreatePollReq,
  ICreatePollRes,
  IReadPollRes,
  IVote,
} from "../types/poll.types";
import { SERVER_URL, reqHeader } from "../utils";

class PollAPI {
  static createPoll = async (reqObj: ICreatePollReq) => {
    const res = await fetch(SERVER_URL + "/poll", {
      method: "POST",
      body: JSON.stringify(reqObj),
      headers: { ...reqHeader },
    });

    const resJson: ICreatePollRes = await res.json();
    return resJson;
  };

  static readPoll = async (token: string) => {
    const res = await fetch(SERVER_URL + "/poll/" + token, {
      method: "GET",
    });

    const resJson: IReadPollRes = await res.json();
    return resJson;
  };

  static castVote = async (optionID: number) => {
    const res = await fetch(SERVER_URL + "/vote", {
      method: "POST",
      body: JSON.stringify({ optionID }),
      headers: { ...reqHeader },
    });

    const resJson: IVote = await res.json();
    return resJson;
  };
}

export default PollAPI;
