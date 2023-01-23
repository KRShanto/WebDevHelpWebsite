import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', UserSchema);

export default User;
