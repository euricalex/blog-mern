import mongoose from "mongoose";

const UserShema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarURL: String,
  

},

{
    createdAt: {
        type: Date,
        default: Date.now, // Задаем текущую дату при создании нового пользователя
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Задаем текущую дату при каждом обновлении пользователя
    }
},
);

export default mongoose.model('User', UserShema);