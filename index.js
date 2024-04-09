import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors';
import { registerValidation, loginValidation, postCreateValidation } from "./validation.js";
import { getMe, login, register } from "./controllers/UserController.js";
import { create, getAll, getLastTags, getOne, getPopular, getSelectedTags, remove, update } from "./controllers/PostController.js";
import {validationErrors, checkAuth} from "./utils/index.js";
import app from "./server.js";

mongoose.connect("mongodb+srv://euricalex:eociBuxqxpNqfMVs@my-first-cluster.vhjuxty.mongodb.net/blog")
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
app.get('/posts/tags/:tag', checkAuth, getSelectedTags);

app.get('/posts/:id', getOne);
app.post('/posts', checkAuth, postCreateValidation, validationErrors, create);
app.delete('/posts/:id', checkAuth,  remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, validationErrors, update);
app.post('/upload', checkAuth, upload.single('image'), (req, res)=> {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});


