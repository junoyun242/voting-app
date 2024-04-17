import express from "express";
import cors from "cors";
import TokenRoutes from "./routes/token.routes";
import PollRoutes from "./routes/poll.routes";
import VoteRoutes from "./routes/vote.routes";
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/token", TokenRoutes);
app.use("/poll", PollRoutes);
app.use("/vote", VoteRoutes);
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
