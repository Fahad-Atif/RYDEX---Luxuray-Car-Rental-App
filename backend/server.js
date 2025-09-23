import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

const PORT = process.env.PORT || 3000;

// Initializing Server
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT} `);
});

await connectDB();

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter)
app.use("/api/booking", bookingRouter)
