import express, { Request, Response } from "express";
import cors from "cors";
import TokenRoutes from "./routes/token.routes";
import PollRoutes from "./routes/poll.routes";
import VoteRoutes from "./routes/vote.routes";
import expressWinston from "express-winston";
import { loggerObj } from "./util/logger";
const app = express();
const PORT = 3001;

app.use(
  cors({ origin: ["http://dev.vote.junoyun242.org", "http://localhost:5173"] })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  expressWinston.logger({
    ...loggerObj,
    msg: "HTTP {{req.method}} {{req.url}}",
    requestWhitelist: ["headers", "query", "body"],
    responseWhitelist: ["body"],
  })
);
app.use("/token", TokenRoutes);
app.use("/poll", PollRoutes);
app.use("/vote", VoteRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
