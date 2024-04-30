import users from "../models/user.model.js";
import Story from "../models/stories.model.js";

// Controller function to bookmark a story for a user
export const bookmarkStory = async (req, res) => {
    try {
        let storyId = req.params.id;
        const userId = req.body.userId;

        // Find user and story by their IDs
        const user = await users.findById(userId);
        const story = await Story.findById(storyId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if story exists
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        // Return error if story is already bookmarked by the user
        if (user.bookmarks.includes(storyId)) {
            return res
                .status(400)
                .json({ message: "Story already bookmarked", bookmarked: true });
        }

        // Add story to user's bookmarks
        user.bookmarks.push(storyId);
        await user.save();

        // Add user to story's bookmarks
        story.bookmarks.push(userId);
        await story.save();

        // Return success message along with updated bookmarks and story information
        res.status(200).json({
            message: "Story bookmarked successfully",
            bookmarks: user.bookmarks,
            bookmarked: true,
            story,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: "Error bookmarking story", error: error.message });
    }
};

// Controller function to get all bookmarks of a user
export const getAllBookmarks = async (req, res) => {
    try {
        
        const {userId} = req.query;
        
        // Find user and story by their IDs
        
        const user = await users.findById(userId);

        // Check if user exists
        if (!user) {
            console.log(userId)
            return res.status(404).json({ message: "User not found" });
        }

        // Find all stories that are bookmarked by the user
        const bookmarks = await Story.find({ _id: { $in: user.bookmarks } }).sort({
            createdAt: -1,
        });

        // Return bookmarks
        res.status(200).json({ bookmarks });

    } catch (error) {
        // Handle errors
        res.status(500).json({ message: "Error retrieving bookmarks", error });
    }
};

// Export controller functions