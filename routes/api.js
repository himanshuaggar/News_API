import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/Authenticate.js";
import ProfileController from "../controllers/ProfileController.js";
import NewsController from "../controllers/NewsController.js";
import redisCache from "../DB/redis.config.js";
import bodyParser from "body-parser";

const router = Router();

router.use(bodyParser.json());
/**
 * @swagger
 * tags:
 *   name: News
 *   description: The News managing API
 * /api/auth/register:
 *   post:
 *     summary: Create a new User
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       200:
 *         description: The created User.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
*       400:
*           description: Bad request
 *       500:
 *         description: Some server error
 *
 */

router.post("/auth/register", AuthController.register)

/**
 * @swagger
 * 
 * /api/auth/login:
 *   post:
 *     summary: Login a existing User
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: The User Logged In.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */

router.post("/auth/login", AuthController.login);
/**
 * @swagger
 * tags:
 *   name: News
 *   description: The News managing API
 * /api/send-email:
 *   get:
 *     summary: Send an Email
 *     tags: [User]
 *     parameters:
 *      - in: query
 *        name: email
 *        schema:
 *          type: string
 *        description: To send email to the user
 *     responses:
 *       200:
 *         description: The Email Sent.
 *       500:
 *         description: Some server error
 *
 */
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



/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - password_confirmation
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the User
 *         email:
 *           type: string
 *           description: The emial of the User
 *         password:
 *           type: string
 *           description: Password of the user
 *         password_confirmation:
 *           type: string
 *           description: Confirm Password of the user
 *         
 *       example:
 *         name: Himanshu Aggarwal
 *         email: himanshuaggar00@gmail.com
 *         password: hejehvcjav
 *         password_confirmation: hejehvcjav
 *     LoginUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The emial of the User
 *         password:
 *           type: string
 *           description: Password of the user
 *         
 *       example:
 *         email: himanshuaggar00@gmail.com
 *         password: hejehvcjav
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the User
 *         email:
 *           type: string
 *           description: The emial of the User
 *         password:
 *           type: string
 *           description: Password of the user
 *         profile:
 *          type: string
 *          description: Profile of the user
 *          created_at:
 *           type: string
 *           format: date
 *           description: The date the User was added
 *         updated_at:
 *           type: string
 *           format: date
 *           description: The date the User was updated
 *       example:
 *         id: 387682534
 *         name: Himanshu 
 *         email: himanshuaggar00@gmail.com
 *         password: hejehvcjav
 *         profile: null
 *         created_at: 2024-03-10T04:05:06.157Z
 *         updated_at: 2024-04-10T04:05:06.157Z
 *          
 */

export default router;