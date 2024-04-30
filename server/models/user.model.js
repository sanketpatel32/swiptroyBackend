import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            // Add additional validation if needed
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            // Ensure proper password hashing and salting
        },
        profilePic: {
            type: String,
            default: "",
            // Add validation or preprocessing for URL format
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story",
        }],
        bookmarks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Story",
            }],
    },
    { timestamps: true }
);

const users = mongoose.model("users", userSchema);

export default users;
