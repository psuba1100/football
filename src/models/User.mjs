import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    players: { type: Array }
});

export default mongoose.model("User", UserSchema, "user-profiles")