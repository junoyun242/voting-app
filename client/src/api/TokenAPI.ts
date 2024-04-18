import { SERVER_URL } from "../utils";

class TokenAPI {
  static issueToken = async () => {
    const res = await fetch(SERVER_URL + "/token/issue", {
      method: "GET",
    });

    const resJson: { token: string } = await res.json();
    return resJson;
  };
}

export default TokenAPI;
