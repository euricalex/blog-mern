import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors';
import { registerValidation, loginValidation, postCreateValidation, commentValidation } from "./validation.js";
import { getMe, getUsersByIds, login, register } from "./controllers/UserController.js";
import { create,  createComments,  getAll, getCommentsByPostId, getLastTags, getOne, getPopular,  remove, removeComment, update } from "./controllers/PostController.js";
import {validationErrors, checkAuth} from "./utils/index.js";
import app from "./server.js";


dotenv.config();
const URL = process.env.URL;

mongoose.connect(URL)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));


const storage = multer.diskStorage({destination: (_, __, cb) => {
    cb(null, 'uploads');
}, filename: (_, file, cb) => {
    cb(null, file.originalname);
}

});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// АВТОРИЗАЦИЯ
// Если пользователь нашелся и
app.post("/auth/login",  loginValidation, validationErrors, login);

// РЕГИСТРАЦИЯ
app.post("/auth/register",  registerValidation, validationErrors, register);

// цей маршрут auth/me дозволяє клієнту, який виконав успішну авторизацію, отримати доступ до захищеного ресурсу, в цьому випадку, до даних профілю користувача.
// Цей маршрут /auth/me використовує middleware checkAuth, який ми щойно обговорювали, для перевірки наявності та валідності токену авторизації. Якщо токен коректний, то він передає управління до обробника запиту, який просто відправляє відповідь з об'єктом JSON {success: true} і статусом відповіді 200 "OK".

app.get('/auth/me', checkAuth, getMe);

app.get('/tags', getLastTags);
// POSTS

app.get('/posts', getAll);
app.get('/posts/popular', checkAuth, getPopular);
app.get('/posts/tags', getLastTags);


app.get('/posts/:id', getOne);
app.get('/posts/:id/comments', checkAuth, commentValidation,  getCommentsByPostId );
app.post('/users/getByIds', checkAuth,  getUsersByIds );

app.post('/posts', checkAuth, postCreateValidation, validationErrors, create);
app.post('/posts/:id/comments', checkAuth, commentValidation,   createComments );

app.delete('/posts/:id', checkAuth,  remove);
app.delete('/posts/:postId/comments/:commentId',  checkAuth, commentValidation, removeComment)
app.patch('/posts/:id', checkAuth, postCreateValidation, validationErrors, update);
app.post('/upload', checkAuth, upload.single('image'), (req, res)=> {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});



