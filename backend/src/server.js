import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import commandRoutes from "./routes/commandRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/commands", commandRoutes);
app.use("/api/queries", queryRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Audit Trail API is running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
