import express from "express";
import cors from "cors";
import Router from "./routes/routes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(Router);

let port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server running at http://localhost:3000'));

