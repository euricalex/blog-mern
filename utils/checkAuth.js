import  jwt  from "jsonwebtoken";

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if(token) {
try {
   const decoded = jwt.verify(token, 'secret123');

   req.userId = decoded._id;
//    Если я расшифровал токен и сохранил его в UserID, то мне нужно сказать что все хорошо и выполняй след функцию
next();
}   catch(error) {
    return  res.status(403).json({message: 'No access'})   
}
    } else {
       return  res.status(403).json({message: 'No access'})
    }

}