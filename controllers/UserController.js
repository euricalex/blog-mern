import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserShema from "../modules/User.js";

export const register = async (req, res) => {
  try {
    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const doc = new UserShema({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash,
      avatarURL: req.body.avatarURL,
    });
    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    res.json({ ...user.doc, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration fallen" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserShema.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Incorrect login or password" });
    }

    // Если пользователь нашелся и
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );
    if (!isValidPass) {
      return res.status(400).json({ message: "Incorrect login or password" });
    }
    // Пароль корректный то омог авторизоваться и теперь мы берем новый токен
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Authorization fallen" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserShema.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user._doc);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "No access" });
  }
  // Этот запрос будет говорить авторизован ли я или нет и позволит показать информацию о своем профиле в  React приложении
};
export const getUsersByIds = async (req, res) => {
  try {
    const { userIds } = req.body;
    const users = await UserShema.find({ _id: { $in: userIds } });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users by ids:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
