import express from "express";

import protectRoute from "../middlewares/protectRoute.js";
import {
    createStory,
    getStories,
    getStoryById,
    updateStory
} from "../controllers/story.controllers.js";
import { bookmarkStory, getAllBookmarks } from "../controllers/bookmark.controllers.js"
import {likeStory} from "../controllers/like.controllers.js";

const router = express.Router();

// routes
router.post("/create", protectRoute, createStory);
router.get("/getAll", getStories);
router.get('/mybookmark', getAllBookmarks);
router.get("/getById/:storyId", getStoryById);
router.put("/update/:id",protectRoute , updateStory);
router.put("/like/:id",  protectRoute, likeStory);
router.put('/bookmark/:id', protectRoute, bookmarkStory);

export default router;