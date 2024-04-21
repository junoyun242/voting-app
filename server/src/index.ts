import express, { Request, Response } from "express";
import cors from "cors";
import TokenRoutes from "./routes/token.routes";
import PollRoutes from "./routes/poll.routes";
import VoteRoutes from "./routes/vote.routes";
import expressWinston from "express-winston";
import { join } from "path";
import { loggerObj } from "./util/logger";
const app = express();
const PORT = 3001;

app.use(cors());
app.use("/assets", express.static(join(process.cwd(), "client", "assets")));
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

app.get("*", (req: Request, res: Response) => {
  res.sendFile(join(process.cwd(), "client", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
