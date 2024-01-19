import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/Authenticate.js";
import ProfileController from "../controllers/ProfileController.js";
import NewsController from "../controllers/NewsController.js";
import redisCache from "../DB/redis.config.js";

const router = Router();

router.post("/auth/register", AuthController.register)
router.post("/auth/login", AuthController.login);
router.get("/send-email", AuthController.sendTestEmail);
//Profile Routes

router.get("/profile", authMiddleware, ProfileController.index); // Private Route
router.put("/profile/:id", authMiddleware, ProfileController.update); // Private Route

// News Routes
router.get("/news", redisCache.route() ,NewsController.index);
router.post("/news", authMiddleware, NewsController.store);// Private Route
router.get("/news/:id", NewsController.show);
router.put("/news/:id", authMiddleware, NewsController.update); // Private Route
router.delete("/news/:id", authMiddleware, NewsController.destroy); // Private Route

export default router;