import express from 'express';
import "dotenv/config";
import ApiRoutes from './routes/api.js';
import fileUpload from 'express-fileupload';
import helmet from "helmet";
import cors from "cors";
import { limiter } from './config/ratelimiter.js';
import logger from './config/logger.js';
import "./jobs/index.js"
import swaggerjsdoc from "swagger-jsdoc";
import swagger from "swagger-ui-express";
import generateSwaggerDocs from './utils/swagger.js';

 
const app = express();
const PORT = process.env.PORT || 8000;
const options = {
    definition: {
    openapi: "3.1.0",
    info: {
        title: "News API Docs",
        version: "0.0.1",
        description: "This is a simple News API made using Express with some modern Backend Sefvices like Authentication, Autorization, Caching, Loging, Rate Limiting, Pagination, Message Queues,",
        contact: {
            name: "Himanshu Aggarwal",
            email: "himanshuaggar00@gmail.com",
        },
    },

        servers: [
            {
                url: "http://localhost:8000/",
                description: 'Server',
            },
        ],
    },
    apis: ["./routes/api.js"]
}
const spacs = swaggerjsdoc(options)
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(fileUpload());
app.use(express.static("public"));
app.use(helmet());
app.use(cors());
// Rate Limiting API
app.use(limiter);


// Jobs

// API Routes

app.get("/", (req, res) => {
    return res.json({ message: " Hello from Server...."})
});
app.use("/api", ApiRoutes);

app.use("/api-docs", swagger.serve, swagger.setup(spacs))

app.listen( PORT, () => console.log(`Server is running on Port ${PORT}`));