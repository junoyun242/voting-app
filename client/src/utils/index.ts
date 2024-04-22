export const SERVER_URL = import.meta.env.DEV
  ? "http://localhost:3001"
  : "https://dev.api.vote.junoyun242.org";

export const reqHeader = {
  "Content-Type": "application/json",
};
