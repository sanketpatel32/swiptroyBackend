import express from "express";
import { register,login,logout,loadUser } from "../controllers/auth.controllers.js";
import protectRoute from "../middlewares/protectRoute.js";
const router = express.Router();

//routes for authentication

router.post("/register", register);
router.post("/login",login);
router.post("/logout",logout);

//routes after authentication
router.get("/load/:username",protectRoute,loadUser);


export default router;
