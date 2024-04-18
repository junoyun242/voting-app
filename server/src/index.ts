import express, { Request, Response } from "express";
import cors from "cors";
import TokenRoutes from "./routes/token.routes";
import PollRoutes from "./routes/poll.routes";
import VoteRoutes from "./routes/vote.routes";
import { join } from "path";
const app = express();
const PORT = 3001;

app.use(cors());
app.use(
  "/assets",
  express.static(join(process.cwd(), "..", "client", "dist", "assets"))
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/token", TokenRoutes);
app.use("/poll", PollRoutes);
app.use("/vote", VoteRoutes);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(join(process.cwd(), "..", "client", "dist", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
