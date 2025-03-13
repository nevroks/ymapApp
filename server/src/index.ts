import express, { Express } from "express";
import dotenv from "dotenv";
import { rootRouter } from "@routes/(root)";
import { filterRouter } from "@routes/filter";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT || 3000;

// Routes
app.use("/", rootRouter);
app.use("/filters", filterRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});