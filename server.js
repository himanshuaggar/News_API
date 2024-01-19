import express from 'express';
import "dotenv/config";
import ApiRoutes from './routes/api.js';
import fileUpload from 'express-fileupload';
import helmet from "helmet";
import cors from "cors";
import { limiter } from './config/ratelimiter.js';
import logger from './config/logger.js';
import "./jobs/index.js"
 
const app = express();
const PORT = process.env.PORT || 8000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(fileUpload());
app.use(express.static("public"));
app.use(helmet());
app.use(cors());
// Rate Limiting API
app.use(limiter);

app.get("/", (req, res) => {
    return res.json({ message: " Hello from Server...."})
});

// Jobs

// API Routes
app.use("/api", ApiRoutes);



app.listen( PORT, () => console.log(`Server is running on Port ${PORT}`));