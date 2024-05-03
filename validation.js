import { body } from "express-validator";

export const loginValidation = [
  body("email", "Incorrect email´s format").isEmail(),
  body("password", "Password must have min 5 symbols").isLength({ min: 5 }),
];

export const registerValidation = [
  body("email", "Incorrect email´s format").isEmail(),
  body("password", "Password must have min 5 symbols").isLength({ min: 5 }),
  body("fullName", "Enter name").isLength({ min: 3 }),
  body("avatarURL", "Incorrect link to avatar").optional().isURL(),
];

export const postCreateValidation = [
  body("title", "Enter a headline").isLength({min: 3}).isString(),
  body("text", "Enter a text of the article").isLength({min: 3}).isString(),
  body("tags", "Incorrect tag format").optional().isString(),
  body("imageURL", "Incorrect image link").optional().isString(),

];

export const commentValidation = [
  body('user', 'Invalid user ID').isMongoId(),
  body('text', 'Comment must have content').isLength({ min: 1 }).isString(),
];
