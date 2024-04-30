import bcrypt from 'bcrypt';
import users from '../models/user.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const user = await users.findOne({ username });
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate a profile picture URL
        const profilePicImage = `https://avatar.iran.liara.run/username?username=${username}`;

        // Create a new user object
        const newUser = new users({
            username,
            password: hashedPassword,
            profilePic: profilePicImage,
        });

        // Save the user in the database
        await newUser.save();

        // Generate JWT token and set cookie
        generateTokenAndSetCookie(newUser._id, res);

        // Send success response with user information
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            profilePic: newUser.profilePic,
            likes: newUser.likes,           // Include the likes array
            stories: newUser.stories,       // Include the stories array
            bookmarks: newUser.bookmarks,   // Optionally include bookmarks if needed
        });
    } catch (error) {
        // Handle errors
        res.status(400).json({ error: `${error.message}` });
    }
};

// Controller function for user login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await users.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        // Check if user exists and password is correct
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Generate JWT token and set cookie
        generateTokenAndSetCookie(user._id, res);

        // Send success response with user information
        res.status(200).json({
            _id: user._id,
            username: user.username,
            profilePic: user.profilePic,
            likes: user.likes,          // Include the likes array
            stories: user.stories,      // Include the stories array
            bookmarks: user.bookmarks,  // Optionally include bookmarks if needed
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error })
    }
};

// Controller function for user logout
export const logout = (req, res) => {
    try {
        // Clear JWT token cookie
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        // Handle errors
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Controller function to load user profile
export const loadUser = async (req, res, next) => {
    const { username } = req.params;
    try {
        // Find the user by username
        const user = await users.findOne({ username });
        if (user) {
            // Send success response with user information
            res.status(200).json({
                _id: user._id,
                username: user.username,
                profilePic: user.profilePic,
                likes: user.likes,         // Include the likes array
                stories: user.stories,     // Include the stories array
                bookmarks: user.bookmarks, // Optionally include bookmarks if needed
            });
        } else {
            res.status(400).json("User does not exist");
        }
    } catch (error) {
        // Handle errors
        next(new Error("Error getting user"));
    }
};
