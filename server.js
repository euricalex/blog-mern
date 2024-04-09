import express from "express";
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const PORT = process.env.PORT;


app.listen(PORT || 4444, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`Server is running on port ${PORT}`);
  });
  export default app;