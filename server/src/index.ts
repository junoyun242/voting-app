import express from "express";
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
app.use("/api/token", TokenRoutes);
app.use("/api/poll", PollRoutes);
app.use("/api/vote", VoteRoutes);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
