import express, { Request, Response } from "express";
import cors from "cors";
import TokenRoutes from "./routes/token.routes";
import PollRoutes from "./routes/poll.routes";
import VoteRoutes from "./routes/vote.routes";
import CommentRoutes from "./routes/comment.routes";
import expressWinston from "express-winston";
import { loggerObj } from "./util/logger";
import swaggerUI from "swagger-ui-express";
import YAML from "yaml";
import { readFileSync } from "fs";
import { join } from "path";
const app = express();
const PORT = 3001;

const file = readFileSync(join(process.cwd(), "swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(file);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(
  cors({ origin: ["https://dev.vote.junoyun242.org", "http://localhost:5173"] })
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
app.use("/", CommentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
