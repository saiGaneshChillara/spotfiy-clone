import { Router } from "express";
// import { User } from "../models/user.model.js";
import { callbackController } from "../controllers/auth.controller.js";

const router = Router();

router.post('/callback', callbackController);

export default router;