import { IComment, IReadCommentsRes } from "../types/comment.types";
import { SERVER_URL, reqHeader } from "../utils";

class CommentAPI {
  public static createComment = async (
    pollID: number,
    content: string,
    nickname: string
  ) => {
    const res = await fetch(SERVER_URL + "/comment", {
      method: "POST",
      headers: { ...reqHeader },
      body: JSON.stringify({ pollID, content, nickname }),
    });

    const resJson: IComment = await res.json();
    return resJson;
  };

  public static readComments = async (pollID: number) => {
    const res = await fetch(SERVER_URL + "/comments/" + String(pollID), {
      method: "GET",
      headers: { ...reqHeader },
    });

    const resJson: IReadCommentsRes = await res.json();
    return resJson;
  };
}

export default CommentAPI;
